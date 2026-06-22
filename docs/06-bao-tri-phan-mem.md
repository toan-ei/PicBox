# BẢO TRÌ PHẦN MỀM
## Hệ thống Quản lý Giao nhận Hàng hóa PicBox

---

## 1. Chiến lược bảo trì

PicBox được thiết kế để dễ bảo trì và nâng cấp nhờ kiến trúc microservices và containerization. Có 4 loại bảo trì chính:

| Loại bảo trì | Mô tả | Tần suất |
|-------------|-------|---------|
| **Corrective** | Sửa lỗi phát sinh | Khi phát hiện lỗi |
| **Adaptive** | Cập nhật theo thay đổi môi trường (OS, JDK, thư viện) | Theo quý |
| **Perfective** | Cải thiện tính năng, hiệu năng | Theo sprint |
| **Preventive** | Tái cấu trúc code, cập nhật dependencies | Định kỳ 6 tháng |

---

## 2. Containerization với Docker

### 2.1 Lợi ích của Docker trong bảo trì
- **Môi trường nhất quán:** Image Docker đảm bảo code chạy giống hệt trên dev, staging, production
- **Rollback nhanh:** Quay về image cũ bằng cách pull version cũ từ Docker Hub
- **Cô lập service:** Restart hoặc update một service không ảnh hưởng các service khác
- **Tái sử dụng:** Các developer khác chỉ cần `docker compose up` để có môi trường đầy đủ

### 2.2 Quản lý image trên Docker Hub
Tất cả 15 image được push lên Docker Hub với prefix `humanoid288/picbox-*`:

```bash
# Danh sách images
humanoid288/picbox-gateway
humanoid288/picbox-identity
humanoid288/picbox-profile
humanoid288/picbox-order
humanoid288/picbox-payment
humanoid288/picbox-hub
humanoid288/picbox-staff
humanoid288/picbox-tracking
humanoid288/picbox-notification
humanoid288/picbox-file
humanoid288/picbox-sender-web
humanoid288/picbox-admin-web
humanoid288/picbox-ops-dashboard
humanoid288/picbox-shipper-portal
humanoid288/picbox-driver-portal
```

### 2.3 Quy trình cập nhật một service
```bash
# 1. Chỉnh sửa code service
# 2. Build image mới
docker compose -f docker-compose.dev.yml build identity-service

# 3. Restart chỉ service đó (không restart các service khác)
docker compose -f docker-compose.dev.yml up -d identity-service

# 4. Kiểm tra logs
docker compose -f docker-compose.dev.yml logs identity-service -f

# 5. Nếu OK, push lên Hub
docker tag docker-identity-service humanoid288/picbox-identity:v1.1
docker push humanoid288/picbox-identity:v1.1
```

---

## 3. Logging và Monitoring

### 3.1 Logging trong Java Services
Tất cả services sử dụng **SLF4J + Logback** (tích hợp sẵn với Spring Boot):

```java
@Slf4j  // Lombok annotation — tự động tạo logger
@Service
public class OrderService {

    public Order updateStatus(String orderId, String updatedBy,
                               UpdateOrderStatusRequest request) {
        log.info("Updating order {} to status {} by {}",
                  orderId, request.getStatus(), updatedBy);
        // ...
        log.info("Order {} status updated successfully", orderId);
        return order;
    }

    // Log lỗi không nghiêm trọng (non-fatal)
    public Order createOrder(String senderId, CreateOrderRequest request) {
        // ...
        try {
            profileClient.createProfile(profileRequest);
        } catch (Exception e) {
            log.warn("Could not create profile for user {}: {}",
                      senderId, e.getMessage());
            // Tiếp tục xử lý — profile tạo sau
        }
    }
}
```

### 3.2 Xem logs khi vận hành
```bash
# Xem log tất cả services (live)
docker compose -f docker-compose.dev.yml logs -f

# Xem log một service cụ thể
docker compose -f docker-compose.dev.yml logs order-service -f --tail=100

# Xem log lỗi gần đây của identity
docker compose -f docker-compose.dev.yml logs identity-service 2>&1 | grep -i "error\|warn"
```

### 3.3 Kafka Monitoring
Truy cập **Kafka UI** tại http://localhost:8090:
- Xem danh sách topics và số message
- Kiểm tra consumer lag (độ trễ xử lý)
- Replay message khi cần

---

## 4. Database Maintenance

### 4.1 Backup dữ liệu MySQL
```bash
# Backup toàn bộ databases
docker exec picbox-mysql mysqldump -u root -proot \
  --all-databases > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i picbox-mysql mysql -u root -proot < backup_20260620.sql
```

### 4.2 Outbox table cleanup
Bảng `outbox_events` tích lũy theo thời gian. Cần định kỳ xóa các event đã publish:
```sql
-- Chạy hàng tuần để xóa event đã publish > 7 ngày
DELETE FROM order_service.outbox_events
WHERE published_at IS NOT NULL
  AND published_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
```

### 4.3 Invalidated tokens cleanup (Identity)
```sql
-- Xóa token hết hạn (chạy hàng ngày)
DELETE FROM identity_service.invalidated_tokens
WHERE expiry_time < NOW();
```

---

## 5. Xử lý sự cố thường gặp

### 5.1 Kafka container unhealthy khi khởi động
**Triệu chứng:** `picbox-kafka` ở trạng thái `unhealthy`
**Nguyên nhân:** Zookeeper chưa khởi động kịp
**Giải pháp:**
```bash
# Chạy lại docker compose lần 2 (Kafka tự reconnect)
docker compose -f docker-compose.dev.yml up -d
```

### 5.2 Service không kết nối được database
**Triệu chứng:** `Connection refused` hoặc `Unknown host 'mysql'`
**Giải pháp:**
```bash
# Kiểm tra MySQL container có đang chạy không
docker ps | grep mysql

# Xem network
docker network ls

# Restart service (chờ MySQL ready)
docker compose -f docker-compose.dev.yml restart identity-service
```

### 5.3 Frontend không gọi được API
**Triệu chứng:** Network error, CORS error
**Kiểm tra:**
```bash
# Đảm bảo NEXT_PUBLIC_API_URL đúng
# Trong docker-compose.dev.yml:
# NEXT_PUBLIC_API_URL: http://localhost:8080  ← Đúng (browser → host)

# Kiểm tra gateway đang chạy
docker ps | grep gateway
curl http://localhost:8080/identity/auth/token
```

### 5.4 Port conflict
**Vấn đề:** Hai service dùng chung port
**Đã gặp:** payment-service và file-service đều dùng 8083 → file-service chuyển sang **8089**
**Cách phòng tránh:** Kiểm tra danh sách port trong `docker-compose.dev.yml` trước khi thêm service mới.

---

## 6. Nâng cấp Dependencies

### 6.1 Kiểm tra version compatibility
Khi nâng cấp Spring Boot hoặc Spring Cloud, kiểm tra bảng tương thích:

| Spring Boot | Spring Cloud |
|-------------|-------------|
| 3.3.x | 2023.0.x |
| 3.5.x | **2025.0.x** ← Đang dùng |

> **Lưu ý quan trọng:** Nâng cấp từ Spring Boot 4.x xuống 3.x là bắt buộc nếu dùng Spring Cloud. Spring Boot 4.0.x không tương thích với Spring Cloud 2023.0.x.

### 6.2 Config key thay đổi theo version
Trong Spring Cloud 4.3.0+, key cấu hình gateway thay đổi:
```yaml
# Cũ (deprecated):
spring.cloud.gateway.routes: ...

# Mới (đang dùng):
spring.cloud.gateway.server.webflux.routes: ...
```

---

## 7. Mở rộng hệ thống trong tương lai

| Tính năng mở rộng | Mô tả | Độ ưu tiên |
|-------------------|-------|-----------|
| Kubernetes deployment | Scale auto từng service | Cao |
| WebSocket thông báo real-time | Push notification không cần F5 | Cao |
| FCM Push Notification | Thông báo đẩy đến mobile app | Trung bình |
| Redis distributed lock | Tránh race condition khi gán shipper | Trung bình |
| CI/CD pipeline | GitHub Actions → build → push Hub | Cao |
| Monitoring (Prometheus + Grafana) | Dashboard giám sát hệ thống | Trung bình |

---

*Tài liệu này là phần Bảo trì Phần mềm của đồ án môn học Hệ thống phân tán — Nhóm phát triển PicBox.*
