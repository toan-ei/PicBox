# PHÂN TÍCH YÊU CẦU PHẦN MỀM
## Hệ thống Quản lý Giao nhận Hàng hóa PicBox

---

## 1. Giới thiệu hệ thống

### 1.1 Mô tả tổng quan
PicBox là hệ thống quản lý giao nhận hàng hóa phân tán (distributed logistics management system) được xây dựng theo kiến trúc microservices. Hệ thống hỗ trợ toàn bộ luồng vận hành từ lúc khách hàng tạo đơn hàng đến khi giao thành công, bao gồm quản lý kho hub, phân công shipper, theo dõi trạng thái và thông báo tự động.

### 1.2 Mục tiêu hệ thống
- Số hóa toàn bộ quy trình giao nhận theo mô hình hub-and-spoke
- Giảm thời gian xử lý đơn hàng thông qua tự động hóa phân công và thông báo
- Hỗ trợ đồng thời nhiều vai trò: khách gửi, admin, nhân viên vận hành, shipper, tài xế
- Đảm bảo khả năng mở rộng lên 10.000 request/giây (10k RPS)
- Cung cấp khả năng theo dõi đơn hàng thời gian thực

### 1.3 Phạm vi hệ thống
Hệ thống bao gồm 5 ứng dụng front-end và 9 microservice back-end, phục vụ các nghiệp vụ:
- Đăng ký / đăng nhập và phân quyền người dùng
- Tạo và theo dõi đơn hàng
- Quản lý hub trung tâm và chi nhánh
- Quản lý shipper và tài xế
- Thanh toán và thu hộ COD
- Thông báo trạng thái tự động

---

## 2. Tác nhân hệ thống (Actors)

| Tác nhân | Mô tả |
|----------|-------|
| **Sender (Người gửi)** | Khách hàng tạo đơn hàng, theo dõi vận đơn, thanh toán |
| **Admin** | Quản trị viên toàn hệ thống: quản lý user, hub, đơn hàng |
| **Ops Manager** | Nhân viên vận hành: phân công shipper, theo dõi hub |
| **Shipper** | Nhân viên giao hàng: nhận đơn, cập nhật trạng thái giao |
| **Driver** | Tài xế vận chuyển liên hub: quản lý chuyến, cập nhật vị trí |
| **Hệ thống (System)** | Kafka message broker, scheduler tự động xử lý outbox events |

---

## 3. Yêu cầu chức năng (Functional Requirements)

### 3.1 Module Quản lý người dùng (Identity & Profile)
| Mã | Chức năng | Mô tả |
|----|-----------|-------|
| F-USR-01 | Đăng ký tài khoản | Người dùng tạo tài khoản với username, password, vai trò mặc định là Sender |
| F-USR-02 | Đăng nhập | Xác thực bằng username/password, trả về JWT access token và refresh token |
| F-USR-03 | Đăng xuất | Vô hiệu hóa token hiện tại |
| F-USR-04 | Làm mới token | Refresh access token khi hết hạn |
| F-USR-05 | Quản lý hồ sơ | Xem và cập nhật thông tin cá nhân, ảnh đại diện |
| F-USR-06 | Phân quyền vai trò | Admin gán vai trò (Admin/Ops/Shipper/Driver/Sender) cho người dùng |
| F-USR-07 | Quản lý quyền | Tạo, xem, xóa permission; gán permission vào role |

### 3.2 Module Quản lý đơn hàng (Order)
| Mã | Chức năng | Mô tả |
|----|-----------|-------|
| F-ORD-01 | Tạo đơn hàng | Sender tạo đơn với thông tin người gửi, người nhận, trọng lượng, phương thức lấy hàng |
| F-ORD-02 | Xem đơn của tôi | Sender xem lịch sử đơn hàng của mình (phân trang) |
| F-ORD-03 | Tra cứu vận đơn | Tìm kiếm đơn bằng mã tracking code |
| F-ORD-04 | Cập nhật trạng thái | Nhân viên cập nhật trạng thái đơn qua 15 bước từ PENDING → DELIVERED |
| F-ORD-05 | Hủy đơn hàng | Sender hoặc Admin hủy đơn khi chưa lấy hàng |
| F-ORD-06 | Xem lịch sử trạng thái | Xem toàn bộ timeline thay đổi trạng thái đơn |
| F-ORD-07 | Lọc theo trạng thái | Admin/Ops lọc danh sách đơn theo từng trạng thái (phân trang) |

**Luồng trạng thái đơn hàng:**
```
PENDING → CONFIRMED → PICKED_UP → AT_ORIGIN_BRANCH
→ IN_TRANSIT_TO_HUB → AT_HUB → IN_TRANSIT_TO_DEST_HUB
→ AT_DEST_HUB → IN_TRANSIT_TO_DEST_BRANCH → AT_DEST_BRANCH
→ OUT_FOR_DELIVERY → DELIVERED
                  ↘ DELIVERY_FAILED → RETURNED
                  ↘ CANCELLED
```

### 3.3 Module Thanh toán (Payment)
| Mã | Chức năng | Mô tả |
|----|-----------|-------|
| F-PAY-01 | Tạo thanh toán | Tạo bản ghi thanh toán liên kết với đơn hàng |
| F-PAY-02 | Xem thanh toán theo đơn | Lấy lịch sử thanh toán của một đơn hàng |
| F-PAY-03 | Hoàn tiền | Admin xử lý hoàn tiền khi đơn bị trả |

### 3.4 Module Hub & Chi nhánh
| Mã | Chức năng | Mô tả |
|----|-----------|-------|
| F-HUB-01 | Quản lý hub trung tâm | Tạo, xem, kích hoạt/tắt hub |
| F-HUB-02 | Quản lý chi nhánh | Tạo, xem chi nhánh thuộc hub |
| F-HUB-03 | Quản lý khu vực | Phân chia vùng địa lý (region → area → hub/branch) |
| F-HUB-04 | Quản lý xe tải | Tạo xe, gán tài xế, cập nhật trạng thái xe |
| F-HUB-05 | Quản lý tuyến vận chuyển | Tạo tuyến, xuất phát, đến nơi |
| F-HUB-06 | Phân loại hàng | Hàng vào hàng chờ → nhân viên sắp xếp vào xe phù hợp |

### 3.5 Module Nhân sự (Staff)
| Mã | Chức năng | Mô tả |
|----|-----------|-------|
| F-STF-01 | Quản lý nhân viên | Tạo, xem danh sách nhân viên, lọc theo vai trò/hub |
| F-STF-02 | Cập nhật trạng thái | Kích hoạt / tạm ngưng nhân viên |

### 3.6 Module Theo dõi (Tracking)
| Mã | Chức năng | Mô tả |
|----|-----------|-------|
| F-TRK-01 | Cập nhật vị trí shipper | Shipper gửi tọa độ GPS theo thời gian thực |
| F-TRK-02 | Xem vị trí đơn hàng | Hiển thị vị trí shipper đang giao đơn |

### 3.7 Module Thông báo (Notification)
| Mã | Chức năng | Mô tả |
|----|-----------|-------|
| F-NOT-01 | Gửi thông báo tự động | Khi trạng thái đơn thay đổi, hệ thống gửi thông báo tới người dùng qua Kafka |
| F-NOT-02 | Xem thông báo | Người dùng xem danh sách thông báo của mình (phân trang) |

---

## 4. Yêu cầu phi chức năng (Non-Functional Requirements)

### 4.1 Hiệu năng
- Hệ thống phải xử lý tối thiểu **10.000 request/giây** trong điều kiện tải cao
- Thời gian phản hồi API < 500ms ở mức tải bình thường
- Kafka xử lý event không đồng bộ, không block luồng chính

### 4.2 Bảo mật
- Xác thực bằng **JWT (JSON Web Token)** với thời hạn access token 1 giờ
- Phân quyền dựa trên **RBAC** (Role-Based Access Control)
- Mật khẩu mã hóa bằng **BCrypt**
- HTTPS bắt buộc trên môi trường production
- Không lưu sensitive data trong log

### 4.3 Tính sẵn sàng (Availability)
- Mục tiêu uptime: **99.9%**
- Mỗi service độc lập, lỗi một service không kéo sập toàn hệ thống
- Tự động restart container khi crash (Docker `restart: unless-stopped`)

### 4.4 Khả năng mở rộng (Scalability)
- Kiến trúc microservices cho phép scale từng service độc lập
- Stateless services → dễ dàng chạy nhiều instance song song
- Redis cache giảm tải database

### 4.5 Khả năng bảo trì (Maintainability)
- Mỗi service có codebase riêng biệt
- API Gateway làm điểm vào duy nhất, dễ update routing
- Docker image đảm bảo môi trường nhất quán

### 4.6 Khả năng tương thích
- API RESTful, tương thích với mọi HTTP client
- Frontend Next.js chạy trên mọi trình duyệt hiện đại
- Database MySQL 8.x, MongoDB 6.x

---

## 5. Ràng buộc hệ thống

| Loại ràng buộc | Nội dung |
|----------------|----------|
| **Công nghệ** | Backend: Java 21, Spring Boot 3.5, Spring Cloud; Frontend: Next.js 15, TypeScript |
| **Hạ tầng** | Docker & Docker Compose; có thể triển khai trên Kubernetes |
| **Database** | MySQL 8 cho các service nghiệp vụ; MongoDB cho notification |
| **Message Broker** | Apache Kafka (Zookeeper mode) |
| **Cache** | Redis (single node) |
| **Bảo mật** | JWT phải được gửi trong header Authorization: Bearer |

---

## 6. Biểu đồ Use Case tổng quan

```
+------------------------------------------+
|              HỆ THỐNG PICBOX             |
|                                          |
|  [Đăng ký / Đăng nhập]                  |
|  [Tạo đơn hàng]                          |
|  [Theo dõi vận đơn]                      |
|  [Quản lý Hub]                           |
|  [Phân công Shipper]                     |
|  [Giao hàng & Cập nhật trạng thái]       |
|  [Nhận thông báo]                        |
+------------------------------------------+
    ↑           ↑           ↑         ↑
  Sender      Admin     Ops/Staff  Shipper/Driver
```

---

*Tài liệu này là phần Phân tích Yêu cầu của đồ án môn học Hệ thống phân tán — Nhóm phát triển PicBox.*
