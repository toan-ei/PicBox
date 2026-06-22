# THIẾT KẾ CƠ SỞ DỮ LIỆU
## Hệ thống Quản lý Giao nhận Hàng hóa PicBox

---

## 1. Tổng quan kiến trúc dữ liệu

PicBox áp dụng mô hình **Database per Service** — mỗi microservice sở hữu schema riêng biệt, không truy cập trực tiếp vào database của service khác. Giao tiếp giữa các service thực hiện qua API hoặc Kafka event.

| Service | Database | Loại |
|---------|----------|------|
| identity-service | `identity_service` | MySQL 8 |
| profile-service | `profile_service` | MySQL 8 |
| order-service | `order_service` | MySQL 8 |
| payment-service | `payment_service` | MySQL 8 |
| hub-and-branch-service | `hub_service` | MySQL 8 |
| staff-service | `staff_service` | MySQL 8 |
| tracking-service | `tracking_service` | MySQL 8 |
| notification-service | MongoDB | MongoDB 6 |
| gateway-api | *(không có DB)* | — |

---

## 2. Identity Service — `identity_service`

### 2.1 Bảng `users`
| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | VARCHAR(36) | PK | UUID tự sinh |
| `username` | VARCHAR(255) | UNIQUE, NOT NULL | Tên đăng nhập |
| `password` | VARCHAR(255) | NOT NULL | Mật khẩu đã hash BCrypt |
| `no_password` | BOOLEAN | DEFAULT FALSE | Đăng nhập OAuth (không mật khẩu) |

### 2.2 Bảng `roles`
| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `name` | VARCHAR(255) | PK | Tên role (ADMIN, OPS, SHIPPER, DRIVER, SENDER) |
| `description` | VARCHAR(255) | | Mô tả vai trò |

### 2.3 Bảng `permissions`
| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `name` | VARCHAR(255) | PK | Tên quyền (ví dụ: ORDER_READ, USER_MANAGE) |
| `description` | VARCHAR(255) | | Mô tả quyền |

### 2.4 Bảng `role_permissions` (quan hệ N-N)
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `role_name` | VARCHAR(255) | FK → roles.name |
| `permission_name` | VARCHAR(255) | FK → permissions.name |

### 2.5 Bảng `user_roles` (quan hệ N-N)
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `user_id` | VARCHAR(36) | FK → users.id |
| `role_name` | VARCHAR(255) | FK → roles.name |

### 2.6 Bảng `invalidated_tokens`
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `id` | VARCHAR(255) | PK — JWT ID (jti) |
| `expiry_time` | DATETIME | Thời gian hết hạn của token |

---

## 3. Profile Service — `profile_service`

### 3.1 Bảng `profiles`
| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | VARCHAR(36) | PK | UUID |
| `user_id` | VARCHAR(36) | UNIQUE, NOT NULL | Liên kết với identity-service |
| `full_name` | VARCHAR(255) | | Họ và tên đầy đủ |
| `dob` | DATE | | Ngày sinh |
| `gender` | VARCHAR(10) | | Giới tính |
| `address` | VARCHAR(500) | | Địa chỉ |
| `phone_number` | VARCHAR(20) | | Số điện thoại |
| `avatar` | VARCHAR(500) | | URL ảnh đại diện |

---

## 4. Order Service — `order_service`

### 4.1 Bảng `orders`
| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | VARCHAR(36) | PK | UUID |
| `tracking_code` | VARCHAR(50) | UNIQUE, NOT NULL | Mã vận đơn (format: PB-YYYYXXXXXX) |
| `sender_id` | VARCHAR(36) | NOT NULL | ID người gửi (ref identity-service) |
| `sender_name` | VARCHAR(255) | | Tên người gửi |
| `sender_phone` | VARCHAR(20) | | SĐT người gửi |
| `receiver_name` | VARCHAR(255) | NOT NULL | Tên người nhận |
| `receiver_phone` | VARCHAR(20) | NOT NULL | SĐT người nhận |
| `receiver_address` | VARCHAR(500) | NOT NULL | Địa chỉ giao hàng |
| `origin_branch_id` | VARCHAR(36) | NOT NULL | Chi nhánh gửi |
| `origin_branch_name` | VARCHAR(255) | | Tên chi nhánh gửi |
| `dest_branch_id` | VARCHAR(36) | NOT NULL | Chi nhánh nhận |
| `dest_branch_name` | VARCHAR(255) | | Tên chi nhánh nhận |
| `weight` | DOUBLE | NOT NULL | Trọng lượng (kg) |
| `width` | DOUBLE | | Chiều rộng (cm) |
| `height` | DOUBLE | | Chiều cao (cm) |
| `length` | DOUBLE | | Chiều dài (cm) |
| `fee` | BIGINT | NOT NULL | Cước phí vận chuyển (VNĐ) |
| `cod_amount` | BIGINT | DEFAULT 0 | Tiền thu hộ COD (VNĐ) |
| `pickup_method` | ENUM | NOT NULL | PICKUP_AT_BRANCH \| PICKUP_AT_DOOR |
| `status` | ENUM | NOT NULL | Trạng thái hiện tại (15 giá trị) |
| `shipper_id` | VARCHAR(36) | | ID shipper được gán |
| `region_code` | VARCHAR(50) | | Vùng xử lý |
| `note` | TEXT | | Ghi chú |
| `created_at` | DATETIME | NOT NULL | Thời gian tạo |
| `updated_at` | DATETIME | NOT NULL | Thời gian cập nhật cuối |

### 4.2 Bảng `order_status_history`
| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | VARCHAR(36) | PK | UUID |
| `order_id` | VARCHAR(36) | FK → orders.id | Mã đơn hàng |
| `status` | ENUM | NOT NULL | Trạng thái |
| `note` | TEXT | | Ghi chú khi đổi trạng thái |
| `updated_by` | VARCHAR(36) | | ID nhân viên cập nhật |
| `created_at` | DATETIME | NOT NULL | Thời điểm thay đổi |

### 4.3 Bảng `outbox_events` (Outbox Pattern)
| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | VARCHAR(36) | PK | UUID |
| `aggregate_type` | VARCHAR(100) | NOT NULL | Loại entity (ORDER, PAYMENT...) |
| `aggregate_id` | VARCHAR(36) | NOT NULL | ID của entity |
| `event_type` | VARCHAR(100) | NOT NULL | Tên topic Kafka |
| `payload` | TEXT | NOT NULL | JSON payload |
| `created_at` | DATETIME | NOT NULL | Thời gian tạo |
| `published_at` | DATETIME | | Thời gian đã publish lên Kafka |

---

## 5. Payment Service — `payment_service`

### 5.1 Bảng `payments`
| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | VARCHAR(36) | PK | UUID |
| `order_id` | VARCHAR(36) | NOT NULL | Mã đơn hàng liên kết |
| `amount` | BIGINT | NOT NULL | Số tiền thanh toán (VNĐ) |
| `method` | ENUM | NOT NULL | COD \| BANK_TRANSFER \| WALLET |
| `status` | ENUM | NOT NULL | PENDING \| COMPLETED \| REFUNDED |
| `note` | TEXT | | Ghi chú |
| `created_at` | DATETIME | NOT NULL | Thời gian tạo |
| `updated_at` | DATETIME | NOT NULL | Thời gian cập nhật |

---

## 6. Hub & Branch Service — `hub_service`

### 6.1 Bảng `regions` (Vùng)
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `id` | VARCHAR(36) | PK |
| `name` | VARCHAR(255) | Tên vùng (Miền Nam, Miền Bắc...) |
| `code` | VARCHAR(50) | Mã vùng |

### 6.2 Bảng `areas` (Khu vực)
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `id` | VARCHAR(36) | PK |
| `region_id` | VARCHAR(36) | FK → regions.id |
| `name` | VARCHAR(255) | Tên khu vực (TP.HCM, Hà Nội...) |

### 6.3 Bảng `hubs` (Hub trung tâm)
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `id` | VARCHAR(36) | PK |
| `name` | VARCHAR(255) | Tên hub |
| `area_id` | VARCHAR(36) | FK → areas.id |
| `address` | VARCHAR(500) | Địa chỉ |
| `province` | VARCHAR(255) | Tỉnh/Thành phố |
| `latitude` | DOUBLE | Vĩ độ |
| `longitude` | DOUBLE | Kinh độ |
| `contact_phone` | VARCHAR(20) | SĐT liên hệ |
| `active` | BOOLEAN | Trạng thái hoạt động |

### 6.4 Bảng `branches` (Chi nhánh)
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `id` | VARCHAR(36) | PK |
| `hub_id` | VARCHAR(36) | FK → hubs.id |
| `name` | VARCHAR(255) | Tên chi nhánh |
| `address` | VARCHAR(500) | Địa chỉ |
| `district` | VARCHAR(255) | Quận/Huyện |
| `ward` | VARCHAR(255) | Phường/Xã |
| `province` | VARCHAR(255) | Tỉnh/Thành phố |
| `max_capacity` | INT | Sức chứa tối đa (kiện) |
| `active` | BOOLEAN | Trạng thái hoạt động |

### 6.5 Bảng `trucks` (Xe tải)
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `id` | VARCHAR(36) | PK |
| `license_plate` | VARCHAR(20) | Biển số xe |
| `home_base_id` | VARCHAR(36) | FK → hubs.id |
| `driver_id` | VARCHAR(36) | ID tài xế (ref staff-service) |
| `status` | ENUM | AVAILABLE \| IN_USE \| MAINTENANCE |
| `max_weight` | DOUBLE | Tải trọng tối đa (kg) |

### 6.6 Bảng `routes` (Tuyến vận chuyển)
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `id` | VARCHAR(36) | PK |
| `truck_id` | VARCHAR(36) | FK → trucks.id |
| `origin_hub_id` | VARCHAR(36) | Hub xuất phát |
| `dest_hub_id` | VARCHAR(36) | Hub đích |
| `departed_at` | DATETIME | Thời gian xuất phát |
| `arrived_at` | DATETIME | Thời gian đến nơi |
| `status` | ENUM | PLANNED \| IN_TRANSIT \| ARRIVED |

---

## 7. Staff Service — `staff_service`

### 7.1 Bảng `staffs`
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `id` | VARCHAR(36) | PK |
| `user_id` | VARCHAR(36) | Liên kết identity-service |
| `full_name` | VARCHAR(255) | Họ tên |
| `phone` | VARCHAR(20) | SĐT |
| `role` | ENUM | SHIPPER \| DRIVER \| SORTER \| HUB_MANAGER |
| `home_base_id` | VARCHAR(36) | Hub/Branch công tác |
| `status` | ENUM | ACTIVE \| INACTIVE \| ON_LEAVE |
| `created_at` | DATETIME | Ngày vào làm |

---

## 8. Tracking Service — `tracking_service`

### 8.1 Bảng `shipper_locations`
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `id` | VARCHAR(36) | PK |
| `shipper_id` | VARCHAR(36) | ID shipper |
| `order_id` | VARCHAR(36) | Đơn hàng đang giao |
| `latitude` | DOUBLE | Vĩ độ GPS |
| `longitude` | DOUBLE | Kinh độ GPS |
| `recorded_at` | DATETIME | Thời điểm ghi nhận |

---

## 9. Notification Service — MongoDB

### 9.1 Collection `notifications`
```json
{
  "_id": "ObjectId",
  "userId": "string (ref identity-service)",
  "title": "string",
  "body": "string",
  "type": "ORDER_STATUS | SYSTEM | PROMOTION",
  "data": {
    "orderId": "string",
    "trackingCode": "string",
    "newStatus": "string"
  },
  "isRead": false,
  "createdAt": "ISODate"
}
```

---

## 10. Sơ đồ quan hệ tổng quan

```
identity_service.users ──── profile_service.profiles (via userId)
        │
        └── order_service.orders (via senderId)
                │
                ├── order_service.order_status_history
                ├── order_service.outbox_events
                ├── payment_service.payments (via orderId)
                └── notification_service.notifications (via userId, orderId)

hub_service.regions
    └── hub_service.areas
            └── hub_service.hubs
                    ├── hub_service.branches
                    ├── hub_service.trucks
                    │       └── hub_service.routes
                    └── staff_service.staffs (via homeBaseId)
```

---

## 11. Kafka Topics

| Topic | Producer | Consumer | Mô tả |
|-------|----------|----------|-------|
| `order.status_changed` | order-service (outbox) | notification-service | Khi trạng thái đơn thay đổi |
| `order.cancelled` | order-service (outbox) | notification-service | Khi đơn bị hủy |
| `notification.events` | notification-service | (logging/analytics) | Ghi nhận sự kiện gửi thông báo |

---

*Tài liệu này là phần Thiết kế Cơ sở Dữ liệu của đồ án môn học Hệ thống phân tán — Nhóm phát triển PicBox.*
