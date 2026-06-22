# LẬP TRÌNH PHẦN MỀM QUẢN LÝ
## Hệ thống Quản lý Giao nhận Hàng hóa PicBox

---

## 1. Kiến trúc hệ thống

### 1.1 Mô hình Microservices
PicBox được xây dựng theo kiến trúc **microservices** với mô hình **hub-and-spoke logistics**. Toàn bộ hệ thống gồm 9 service backend độc lập và 5 ứng dụng frontend.

```
[Frontend Apps]
   sender-web (3000) │ admin-web (3001) │ ops-dashboard (3003)
   shipper-portal (3002) │ driver-portal (3004)
              │
              ▼
   [API Gateway :8080]  ← Điểm vào duy nhất
              │
   ┌──────────┼───────────────────────────┐
   │          │                           │
[identity]  [order]  [payment]  [profile] [hub] [staff] [tracking] [notification] [file]
  :8087      :8082    :8083      :8081    :8084  :8085    :8088       :8086        :8089
   │          │                           │
   └──────────┴───[MySQL 8]───────────────┘
              │
           [Kafka]──────[Redis]
           :9092         :6379
              │
        [notification-service]
              │
          [MongoDB]
```

### 1.2 Công nghệ sử dụng

| Tầng | Công nghệ | Phiên bản |
|------|-----------|-----------|
| Backend language | Java | 21 (LTS) |
| Backend framework | Spring Boot | 3.5.3 |
| Service discovery / Gateway | Spring Cloud Gateway | 2025.0.0 |
| ORM | Spring Data JPA + Hibernate | 7.x |
| Bảo mật | Spring Security + JWT (jjwt) | |
| REST client giữa services | OpenFeign | |
| Message broker | Apache Kafka | 7.x |
| Cache | Redis (Lettuce) | |
| Frontend | Next.js + TypeScript | 15 + 5 |
| CSS | Tailwind CSS | 3.x |
| Container | Docker + Docker Compose | 27.x |
| CI image registry | Docker Hub | |
| Build tool | Maven (backend), npm workspaces (frontend) | |

---

## 2. Cấu trúc source code

```
PicBox/
├── apps/                         # Frontend monorepo
│   ├── packages/
│   │   ├── utils/               # Shared API client, auth helpers
│   │   └── types/               # Shared TypeScript types
│   ├── sender-web/              # Next.js — Khách hàng
│   ├── admin-web/               # Next.js — Admin
│   ├── ops-dashboard/           # Next.js — Ops
│   ├── shipper-portal/          # Next.js — Shipper
│   └── driver-portal/           # Next.js — Driver
├── services/                    # Backend microservices
│   ├── gateway-api/
│   ├── identity-service/
│   ├── profile-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── hub-and-branch-service/
│   ├── staff-service/
│   ├── tracking-service/
│   ├── notification-service/
│   └── file-service/
└── docker/
    ├── docker-compose.dev.yml
    └── mysql-init/              # SQL khởi tạo database
```

---

## 3. Triển khai từng Service

### 3.1 Gateway API (`:8080`)
**Vai trò:** Reverse proxy — tiếp nhận mọi request từ frontend và điều hướng đến service tương ứng.

**Cấu hình routing:**
```yaml
spring:
  cloud:
    gateway:
      server:
        webflux:
          routes:
            - id: identity-service
              uri: http://identity-service:8087
              predicates: [ Path=/identity/** ]
            - id: order-service
              uri: http://order-service:8082
              predicates: [ Path=/order/** ]
            # ... các service khác
```

**Đặc điểm:**
- Spring Cloud Gateway (WebFlux — reactive, non-blocking)
- Không có logic nghiệp vụ
- Có thể thêm JWT filter để pre-validate token trước khi forward

---

### 3.2 Identity Service (`:8087`)
**Vai trò:** Quản lý tài khoản, xác thực, phân quyền.

**Cấu trúc package:**
```
identity-service/
└── src/main/java/com/identity/identity_service/
    ├── controller/   # AuthenticationController, UserController, RoleController
    ├── service/      # UserService, AuthenticationService
    ├── repository/   # UserRepository, RoleRepository
    ├── entity/       # User, Role, Permission
    ├── dto/          # LoginRequest, UserResponse, RoleResponse
    ├── config/       # SecurityConfig, JwtConfig
    └── exception/    # GlobalExceptionHandler, ErrorCode
```

**Luồng đăng nhập:**
```
POST /identity/auth/token
  → AuthenticationService.authenticate()
  → Kiểm tra username/password (BCrypt verify)
  → Tạo JWT (sub=userId, scope=ROLE_NAME, exp=1h)
  → Trả về { token, refreshToken }
```

**Luồng đăng ký:**
```
POST /identity/users/createUser
  → Validate username không trùng
  → Hash password bằng BCrypt
  → Gán role SENDER mặc định
  → Lưu DB → Gọi profile-service tạo profile (best-effort)
```

---

### 3.3 Order Service (`:8082`)
**Vai trò:** Quản lý vòng đời đơn hàng từ tạo đến hoàn tất.

**Pattern quan trọng — Outbox Pattern:**
```
updateStatus() {
  // 1. Cập nhật status trong DB (trong cùng transaction)
  order.setStatus(newStatus);
  orderRepository.save(order);

  // 2. Ghi event vào bảng outbox (cùng transaction → đảm bảo atomic)
  outboxService.saveEvent("ORDER", orderId,
    KafkaTopic.ORDER_STATUS_CHANGED,
    OrderStatusChangedEvent.builder()
      .orderId(orderId)
      .trackingCode(order.getTrackingCode())
      .newStatus(newStatus.name())
      .changedAt(LocalDateTime.now())
      .build()
  );
}

// Scheduled job (mỗi 5 giây): đọc outbox chưa publish → gửi Kafka → đánh dấu published
@Scheduled(fixedDelay = 5000)
void publishPendingEvents() { ... }
```

**Các Kafka Topics:**
- `order.status_changed` — khi trạng thái đơn thay đổi
- `order.cancelled` — khi đơn bị hủy

---

### 3.4 Notification Service (`:8086`)
**Vai trò:** Lắng nghe Kafka events và lưu/gửi thông báo tới người dùng.

**Luồng xử lý:**
```
[Kafka Consumer] order.status_changed
  → Deserialize OrderStatusChangedEvent
  → Tạo Notification { userId, title, body, type, data }
  → Lưu vào MongoDB
  → (Mở rộng: push FCM/WebSocket)
```

---

### 3.5 Hub & Branch Service (`:8084`)
**Vai trò:** Quản lý mạng lưới hub-and-spoke: vùng, khu vực, hub, chi nhánh, xe tải, tuyến vận chuyển, sắp xếp hàng hóa.

**Các controller:**
- `HubController` — CRUD hub
- `BranchController` — CRUD chi nhánh  
- `AreaController` / `RegionController` — phân vùng địa lý
- `TruckController` — quản lý xe tải
- `RouteController` — quản lý tuyến vận chuyển
- `SortingController` — hàng chờ sắp xếp tại hub

---

## 4. Frontend — Shared Package Architecture

### 4.1 npm Workspaces Monorepo
```
apps/
├── package.json          # workspace root: "workspaces": ["packages/*", "*/"]
├── packages/
│   ├── utils/            # @picbox/utils
│   │   ├── api-client.ts # Axios instance + JWT interceptor
│   │   ├── auth-api.ts   # login, logout, register, refresh
│   │   ├── order-api.ts  # createOrder, getMyOrders, getOrder...
│   │   └── admin-api.ts  # getAllAdminOrders, getAllUsers, getAllHubsAndBranches...
│   └── types/            # @picbox/types: User, Order, OrderStatus...
└── sender-web/           # import { apiLogin } from "@picbox/utils"
```

### 4.2 API Client — Axios với Auto Refresh Token
```typescript
// api-client.ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  timeout: 15000,
});

// Request interceptor: gắn JWT token từ localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: tự động refresh khi 401
apiClient.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401) {
    const newToken = await apiRefreshToken(refreshToken);
    // retry request với token mới
  }
});
```

### 4.3 Luồng đăng nhập trên Frontend
```
User nhập username/password
  → apiLogin() gọi POST /identity/auth/token
  → Nhận JWT → decode lấy userId, scope (role)
  → Gọi GET /profile/profiles/getProfile/fromUserId/{userId}
  → Lưu { accessToken, refreshToken, user } vào localStorage + cookie
  → Redirect về dashboard theo role
```

---

## 5. Bảo mật

### 5.1 JWT Configuration
```yaml
app:
  jwt:
    signerKey: "your-256-bit-secret"
    valid-duration: 3600      # 1 giờ
    refreshable-duration: 36000  # 10 giờ
```

### 5.2 Spring Security Filter Chain
```java
@Bean
SecurityFilterChain filterChain(HttpSecurity http) {
  http
    .csrf(AbstractHttpConfigurer::disable)
    .authorizeHttpRequests(auth -> auth
      .requestMatchers("/auth/**", "/users/createUser").permitAll()
      .requestMatchers("/users/getAllUser").hasRole("ADMIN")
      .anyRequest().authenticated()
    )
    .oauth2ResourceServer(oauth2 -> oauth2
      .jwt(jwt -> jwt.decoder(jwtDecoder()))
      .authenticationEntryPoint(jwtAuthEntrypoint)
    );
  return http.build();
}
```

---

## 6. Docker — Containerization

### 6.1 Multi-stage Dockerfile (Java services)
```dockerfile
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn dependency:go-offline -B
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn clean package -B -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=builder --chown=app:app /app/target/*.jar app.jar
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
```

### 6.2 Tổng số containers (docker-compose.dev.yml)
| Loại | Số lượng |
|------|----------|
| Java microservices | 9 |
| Frontend Next.js | 5 |
| MySQL 8 | 1 |
| MongoDB | 1 |
| Kafka | 1 |
| Zookeeper | 1 |
| Redis | 1 |
| Kafka UI | 1 |
| **Tổng** | **20** |

---

*Tài liệu này là phần Lập trình Phần mềm của đồ án môn học Hệ thống phân tán — Nhóm phát triển PicBox.*
