# QUẢN LÝ DỰ ÁN
## Hệ thống Quản lý Giao nhận Hàng hóa PicBox

---

## 1. Thông tin dự án

| Thông tin | Chi tiết |
|-----------|---------|
| **Tên dự án** | PicBox — Hệ thống Quản lý Giao nhận Hàng hóa Phân tán |
| **Môn học** | Hệ thống Phân tán |
| **Loại dự án** | Đồ án môn học |
| **Thời gian thực hiện** | Tháng 3/2025 — Tháng 7/2025 |
| **Deadline** | 21/07/2025 |
| **Quy mô nhóm** | 4 thành viên |

---

## 2. Phân công công việc

### 2.1 Phân công theo thành viên

| Thành viên | Vai trò | Nhiệm vụ chính |
|-----------|---------|----------------|
| **Member 1** | Frontend Lead | sender-web, admin-web — UI/UX, tích hợp API |
| **Member 2** | Frontend | ops-dashboard, shipper-portal, driver-portal |
| **Member 3** | Backend — Auth/Order/Payment | identity-service, order-service, payment-service; triển khai Saga pattern, Outbox pattern |
| **Member 4** | Backend — Logistics/Infra | tracking-service, notification-service, hub-and-branch-service, staff-service; DevOps, Docker, K6 load testing |

### 2.2 Phân công theo module

```
Module                  | Member 1  | Member 2  | Member 3  | Member 4
─────────────────────────────────────────────────────────────────────
identity-service        |           |           |  OWNER    |
profile-service         |           |           |  OWNER    |
order-service           |           |           |  OWNER    |
payment-service         |           |           |  OWNER    |
hub-and-branch-service  |           |           |           |  OWNER
staff-service           |           |           |           |  OWNER
tracking-service        |           |           |           |  OWNER
notification-service    |           |           |           |  OWNER
gateway-api             |           |           |  REVIEW   |  OWNER
file-service            |           |           |           |  OWNER
sender-web              |  OWNER    |           |           |
admin-web               |  OWNER    |           |           |
ops-dashboard           |           |  OWNER    |           |
shipper-portal          |           |  OWNER    |           |
driver-portal           |           |  OWNER    |           |
Docker / Infra          |           |           |           |  OWNER
K6 Load Testing         |           |           |           |  OWNER
```

---

## 3. Phương pháp phát triển

### 3.1 Agile Scrum (điều chỉnh)
Dự án áp dụng phương pháp Agile với các sprint 2 tuần:

```
Sprint 1 (W1-W2):  Phân tích yêu cầu, thiết kế kiến trúc, setup môi trường
Sprint 2 (W3-W4):  Identity service, Profile service, sender-web auth flow
Sprint 3 (W5-W6):  Order service, Payment service, sender-web create order
Sprint 4 (W7-W8):  Hub service, Staff service, Gateway routing
Sprint 5 (W9-W10): Tracking service, Notification service + Kafka integration
Sprint 6 (W11-W12): Admin web, Ops dashboard — UI hoàn chỉnh
Sprint 7 (W13-W14): Kết nối frontend-backend, fix bugs, load testing
Sprint 8 (W15-W16): Docker build, push Hub, tài liệu, báo cáo
```

### 3.2 Git Workflow
- **Main branch:** `develop` — production-ready code
- **Feature branches:** `feature/<tên-tính-năng>`
- **Convention commit:** `feat(module): mô tả bằng tiếng Việt`

```
Ví dụ:
feat(admin-web): kết nối các trang quản lý với dữ liệu thật từ backend
feat(order-service): thêm outbox pattern cho kafka events
fix(gateway): sửa lỗi Spring Cloud version incompatible
```

---

## 4. Kế hoạch tiến độ (Gantt Chart)

```
Task                            | T3 | T4 | T5 | T6 | T7
────────────────────────────────────────────────────────
Phân tích yêu cầu              | ██ |    |    |    |
Thiết kế kiến trúc             | ██ | ██ |    |    |
Setup Docker, CI/CD            | ██ | ██ |    |    |
Identity + Auth service        |    | ██ | ██ |    |
Order + Payment service        |    |    | ██ | ██ |
Hub + Staff + Tracking service |    |    | ██ | ██ |
Notification + Kafka           |    |    |    | ██ |
Frontend sender-web            |    | ██ | ██ | ██ |
Frontend admin-web             |    |    | ██ | ██ |
Frontend ops/shipper/driver    |    |    |    | ██ | ██
Integration & Testing          |    |    |    | ██ | ██
Docker build & Deploy          |    |    |    |    | ██
Báo cáo & Tài liệu             |    |    |    |    | ██
```

---

## 5. Quản lý rủi ro

| Rủi ro | Xác suất | Tác động | Biện pháp xử lý |
|--------|---------|---------|-----------------|
| Dependency version conflict (Spring Boot vs Spring Cloud) | Đã xảy ra | Cao | Kiểm tra bảng tương thích trước khi nâng cấp |
| Kafka container crash khi khởi động | Đã xảy ra | Trung bình | Chạy `docker compose up -d` lần 2 |
| Port conflict giữa services | Đã xảy ra | Trung bình | Kiểm tra port assignment trước khi thêm service |
| Aliyun mirror timeout khi build | Đã xảy ra | Cao | Xóa Aliyun mirror, dùng Maven Central trực tiếp |
| DB connection refused khi dev local | Đã xảy ra | Trung bình | Kiểm tra MySQL service đang chạy |
| Member làm việc offline, mất đồng bộ | Trung bình | Trung bình | Push code lên GitHub sau mỗi buổi làm việc |
| Service bị down ảnh hưởng service khác | Thấp | Cao | Try-catch ở Feign calls, Outbox pattern cho events |

---

## 6. Công cụ quản lý dự án

| Công cụ | Mục đích |
|---------|---------|
| **GitHub** | Version control, code review, pull requests |
| **Discord** | Họp nhóm, thảo luận kỹ thuật |
| **Notion / Google Docs** | Tài liệu đặc tả, meeting notes |
| **Docker Desktop** | Quản lý containers trực quan |
| **Kafka UI** | Monitor message broker |
| **DBeaver** | Xem và query database |

---

## 7. Kết quả đạt được

| Hạng mục | Mục tiêu | Kết quả |
|----------|---------|---------|
| Số microservices | 9 | ✅ 9 service hoàn chỉnh |
| Số frontend apps | 5 | ✅ 5 apps hoàn chỉnh |
| Tổng containers | 20+ | ✅ 22 containers chạy ổn định |
| Docker Hub images | 15 | ✅ 15 images đã push |
| Admin web kết nối API | Toàn bộ | ✅ Dashboard/Orders/Users/Hubs dùng real data |
| Kafka integration | Outbox pattern | ✅ Order events → Notification |
| Load target | 10k RPS | Planned (K6 script đã chuẩn bị) |

---

*Tài liệu này là phần Quản lý Dự án của đồ án môn học Hệ thống phân tán — Nhóm phát triển PicBox.*
