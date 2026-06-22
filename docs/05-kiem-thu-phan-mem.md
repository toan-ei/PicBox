# KIỂM THỬ PHẦN MỀM
## Hệ thống Quản lý Giao nhận Hàng hóa PicBox

---

## 1. Chiến lược kiểm thử

PicBox áp dụng chiến lược kiểm thử theo mô hình **Testing Pyramid**:

```
        [E2E Tests]          ← Ít, chạy chậm, kiểm tra toàn luồng
       [Integration Tests]   ← Kiểm tra tương tác giữa các layer
      [Unit Tests]            ← Nhiều, chạy nhanh, kiểm tra logic nhỏ
     [API Tests (manual)]     ← Kiểm tra từng endpoint qua Postman/curl
   [Load Tests (K6)]          ← Kiểm tra hiệu năng, 10k RPS target
```

---

## 2. Unit Tests

### 2.1 Công cụ
- **JUnit 5** — framework kiểm thử chính
- **Mockito** — mock dependencies
- **Spring Boot Test** — `@SpringBootTest` cho integration tests

### 2.2 Cấu trúc test

Mỗi service có thư mục `src/test/java/` với các lớp test tương ứng.

**Ví dụ — Test UserService (Identity Service):**
```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void createUser_Success() {
        // Arrange
        CreateUserRequest request = CreateUserRequest.builder()
            .username("testuser")
            .password("Test@1234")
            .build();
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashed_password");
        when(userRepository.save(any())).thenReturn(new User());

        // Act
        UserResponse result = userService.createUser(request);

        // Assert
        assertNotNull(result);
        verify(userRepository, times(1)).save(any());
    }

    @Test
    void createUser_DuplicateUsername_ThrowsException() {
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        assertThrows(AppException.class, () ->
            userService.createUser(CreateUserRequest.builder()
                .username("testuser").build())
        );
    }
}
```

**Ví dụ — Test OrderService (Order Service):**
```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock OrderRepository orderRepository;
    @Mock OutboxService outboxService;
    @InjectMocks OrderService orderService;

    @Test
    void updateStatus_ValidTransition_PublishesEvent() {
        Order order = new Order();
        order.setId("order-1");
        order.setTrackingCode("PB-2026001");
        order.setStatus(OrderStatus.CONFIRMED);

        when(orderRepository.findById("order-1"))
            .thenReturn(Optional.of(order));

        UpdateOrderStatusRequest req = new UpdateOrderStatusRequest();
        req.setStatus(OrderStatus.PICKED_UP);

        orderService.updateStatus("order-1", "shipper-1", req);

        verify(outboxService).saveEvent(
            eq("ORDER"), eq("order-1"),
            eq(KafkaTopic.ORDER_STATUS_CHANGED), any()
        );
    }
}
```

---

## 3. Integration Tests

### 3.1 Test context load
Mỗi service có `ApplicationTests.java` kiểm tra Spring context khởi động thành công:
```java
@SpringBootTest
class IdentityServiceApplicationTests {
    @Test
    void contextLoads() {
        // Đảm bảo tất cả beans được khởi tạo không lỗi
    }
}
```

### 3.2 Test API Controller với MockMvc
```java
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired MockMvc mockMvc;
    @MockBean UserService userService;

    @Test
    void getAllUsers_ReturnsList() throws Exception {
        when(userService.getAllUsers()).thenReturn(List.of(
            UserResponse.builder().id("1").username("admin").build()
        ));

        mockMvc.perform(get("/users/getAllUser")
                .header("Authorization", "Bearer test-token"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.result[0].username").value("admin"));
    }
}
```

---

## 4. API Testing (Thủ công)

### 4.1 Danh sách test cases API

#### Module Authentication
| # | Test Case | Method | Endpoint | Kết quả mong đợi |
|---|-----------|--------|----------|-----------------|
| 1 | Đăng nhập đúng | POST | `/identity/auth/token` | 200 + JWT token |
| 2 | Sai mật khẩu | POST | `/identity/auth/token` | 400 + mã lỗi WRONG_PASSWORD |
| 3 | Username không tồn tại | POST | `/identity/auth/token` | 400 + USER_NOT_FOUND |
| 4 | Đăng ký thành công | POST | `/identity/users/createUser` | 200 + user object |
| 5 | Username đã tồn tại | POST | `/identity/users/createUser` | 400 + USER_EXISTED |
| 6 | Refresh token hợp lệ | POST | `/identity/auth/refreshToken` | 200 + token mới |
| 7 | Đăng xuất | POST | `/identity/auth/logout` | 200 OK |

#### Module Order
| # | Test Case | Method | Endpoint | Kết quả mong đợi |
|---|-----------|--------|----------|-----------------|
| 8 | Tạo đơn hàng | POST | `/order/orders` | 201 + order object + trackingCode |
| 9 | Tạo đơn không có token | POST | `/order/orders` | 401 UNAUTHORIZED |
| 10 | Lấy đơn theo ID | GET | `/order/orders/{id}` | 200 + order |
| 11 | Tra cứu tracking | GET | `/order/orders/tracking/{code}` | 200 + order |
| 12 | Tracking không tồn tại | GET | `/order/orders/tracking/INVALID` | 404 NOT_FOUND |
| 13 | Lấy đơn của tôi | GET | `/order/orders/my` | 200 + paginated list |
| 14 | Cập nhật trạng thái | PUT | `/order/orders/{id}/status` | 200 + order mới |
| 15 | Hủy đơn | DELETE | `/order/orders/{id}` | 200 OK |

#### Module Hub
| # | Test Case | Method | Endpoint | Kết quả mong đợi |
|---|-----------|--------|----------|-----------------|
| 16 | Lấy danh sách hub | GET | `/hub/hubs` | 200 + list |
| 17 | Tạo hub | POST | `/hub/hubs` | 201 + hub |
| 18 | Lấy danh sách chi nhánh | GET | `/hub/branches` | 200 + list |

### 4.2 Kết quả kiểm thử thực tế
Các API đã được kiểm thử trực tiếp qua hệ thống Docker đang chạy. Kết quả:

| Module | Số test | Pass | Fail | Ghi chú |
|--------|---------|------|------|---------|
| Authentication | 7 | 7 | 0 | Đăng nhập, đăng xuất, refresh hoạt động |
| Order | 8 | 7 | 1 | Lỗi tạo đơn khi profile-service down (đã fix try-catch) |
| Hub | 3 | 3 | 0 | Lấy hub/branch bình thường |
| Notification | 1 | 1 | 0 | Consumer nhận message từ Kafka |

---

## 5. Load Testing với K6

### 5.1 Mục tiêu
- Hệ thống phải xử lý **10.000 request/giây** (10k RPS)
- Thời gian phản hồi P95 < 500ms
- Error rate < 1%

### 5.2 Kịch bản test
```javascript
// k6/load-test-order.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 100 },   // Ramp up lên 100 VU
    { duration: '3m', target: 1000 },  // Giữ 1000 VU trong 3 phút
    { duration: '1m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% requests < 500ms
    http_req_failed: ['rate<0.01'],    // Lỗi < 1%
  },
};

export default function () {
  // Test API tra cứu vận đơn (read-heavy, thường chiếm 70% traffic)
  const res = http.get('http://localhost:8080/order/orders/tracking/PB-2026001', {
    headers: { Authorization: `Bearer ${__ENV.TOKEN}` },
  });

  check(res, {
    'status 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

### 5.3 Kịch bản tạo đơn hàng đồng thời
```javascript
// k6/load-test-create-order.js
export default function () {
  const payload = JSON.stringify({
    senderName: `Sender ${__VU}`,
    senderPhone: "0901234567",
    receiverName: `Receiver ${__VU}`,
    receiverPhone: "0912345678",
    receiverAddress: "123 Đường Test, Q.1",
    originBranchId: "BR-HCM-01",
    destBranchId: "BR-HAN-01",
    weight: 1.5,
    fee: 35000,
  });

  const res = http.post(
    'http://localhost:8080/order/orders',
    payload,
    { headers: { 'Content-Type': 'application/json',
                 Authorization: `Bearer ${__ENV.TOKEN}` } }
  );

  check(res, { 'created': (r) => r.status === 201 });
}
```

---

## 6. Kiểm thử giao diện người dùng

### 6.1 Checklist kiểm thử UI Admin Web

| Trang | Scenario | Kết quả |
|-------|----------|---------|
| Login | Đăng nhập đúng thông tin | ✅ Redirect về dashboard |
| Login | Sai mật khẩu | ✅ Hiện thông báo lỗi |
| Dashboard | Load thống kê | ✅ Hiển thị số liệu từ API |
| Dashboard | 5 đơn gần đây | ✅ Lấy từ DB thật |
| Orders | Danh sách đơn | ✅ Hiển thị đơn hàng thật |
| Orders | Filter theo tab | ✅ Lọc đúng trạng thái |
| Orders | Tìm kiếm | ✅ Filter theo tracking/tên |
| Orders | Click xem chi tiết | ✅ Panel slide-in hiển thị |
| Users | Danh sách user | ✅ Lấy từ identity + profile |
| Users | Tạo user mới | ✅ Gọi API + reload danh sách |
| Hubs | Danh sách hub | ✅ Lấy từ hub-service |
| Hubs | Filter Hub/Branch | ✅ Lọc đúng loại |

### 6.2 Checklist kiểm thử UI Sender Web

| Trang | Scenario | Kết quả |
|-------|----------|---------|
| Trang chủ | Truy cập | ✅ Hiển thị đúng |
| Đăng ký | Tạo tài khoản mới | ✅ Tạo user + profile |
| Đăng nhập | Login thành công | ✅ Lưu token, redirect |
| Tạo đơn | Điền form đầy đủ | ✅ Tạo đơn, hiển thị tracking |
| Danh sách đơn | Xem đơn của tôi | ✅ Lấy từ API |
| Tra cứu | Nhập tracking code | ✅ Hiển thị timeline |

---

## 7. Kiểm thử Kafka Event Flow

### 7.1 Kịch bản kiểm thử end-to-end
```
1. Tạo đơn hàng mới → status = PENDING
2. Cập nhật status → CONFIRMED
3. Kiểm tra:
   a. Bảng outbox_events có record mới với published_at = NULL
   b. Sau 5 giây, Scheduled job publish lên Kafka
   c. Bảng outbox_events: published_at được cập nhật
   d. notification-service nhận event
   e. MongoDB có notification mới cho user
   f. GET /notification/notifications/user/{userId} trả về notification
```

### 7.2 Kiểm tra qua Kafka UI
Truy cập http://localhost:8090 → Topics → `order.status_changed` → Messages để xem các event đã được publish.

---

*Tài liệu này là phần Kiểm thử Phần mềm của đồ án môn học Hệ thống phân tán — Nhóm phát triển PicBox.*
