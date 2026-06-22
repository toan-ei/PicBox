# THIẾT KẾ GIAO DIỆN, WEBSITE, ỨNG DỤNG
## Hệ thống Quản lý Giao nhận Hàng hóa PicBox

---

## 1. Nguyên tắc thiết kế UI/UX

### 1.1 Design System
PicBox sử dụng dark theme nhất quán trên toàn bộ các ứng dụng quản lý, với:
- **Màu nền chính:** #0a0f1e (dark navy)
- **Màu nhấn:** Indigo (#6366f1) — gradient tím-xanh
- **Text chính:** trắng (#ffffff), phụ: slate-400 (#94a3b8)
- **Glass morphism:** backdrop-blur + border trắng mờ tạo hiệu ứng kính
- **Typography:** Inter / system-ui, kích thước 11-24px

### 1.2 Nguyên tắc chung
- **Tối giản:** Không hiển thị thông tin thừa, ưu tiên dữ liệu quan trọng
- **Phản hồi nhanh:** Skeleton loading, spinner khi chờ API
- **Mobile-first:** Shipper Portal và Driver Portal thiết kế ưu tiên mobile
- **Nhất quán:** Cùng hệ thống badge, button, card trên mọi app
- **Tiếng Việt:** Toàn bộ nhãn, thông báo lỗi bằng tiếng Việt

---

## 2. Sender Web (localhost:3000)

**Đối tượng:** Khách hàng gửi hàng
**Framework:** Next.js 15, Tailwind CSS, Light theme

### 2.1 Các màn hình chính

| Màn hình | Route | Mô tả |
|----------|-------|-------|
| Trang chủ | `/` | Giới thiệu dịch vụ, tra cứu vận đơn nhanh, call-to-action |
| Đăng nhập | `/auth/login` | Form đăng nhập với validation, thông báo lỗi rõ ràng |
| Đăng ký | `/auth/register` | Form đăng ký: username, mật khẩu, họ tên, số điện thoại |
| Dashboard | `/dashboard` | Tổng quan: đơn đang giao, đơn hoàn thành, COD chờ thu |
| Tạo đơn hàng | `/orders/new` | Wizard nhiều bước: thông tin gửi → nhận → hàng hóa → xác nhận |
| Danh sách đơn | `/orders` | Bảng đơn hàng với filter trạng thái, tìm kiếm, phân trang |
| Chi tiết đơn | `/orders/[id]` | Timeline trạng thái, thông tin chi tiết, nút hủy đơn |
| Tra cứu | `/tracking` | Nhập mã vận đơn → hiển thị timeline theo dõi |

### 2.2 Luồng tạo đơn hàng (UX Flow)
```
Bước 1: Thông tin người gửi
  → Tên, SĐT, chi nhánh giao (dropdown)

Bước 2: Thông tin người nhận
  → Tên, SĐT, địa chỉ nhận

Bước 3: Thông tin hàng hóa
  → Trọng lượng, kích thước, ghi chú, COD

Bước 4: Xác nhận & thanh toán
  → Tóm tắt + hiển thị cước phí tự động tính → Xác nhận
```

---

## 3. Admin Web (localhost:3001)

**Đối tượng:** Quản trị viên hệ thống
**Framework:** Next.js 15, Tailwind CSS, Dark glass theme

### 3.1 Cấu trúc layout
- **Sidebar cố định** bên trái: logo, navigation menu theo role
- **Topbar:** Tìm kiếm global, chuông thông báo, avatar user
- **Main content:** Responsive grid, hỗ trợ màn hình từ 1280px trở lên

### 3.2 Các màn hình chính

| Màn hình | Route | Chức năng |
|----------|-------|-----------|
| Dashboard | `/` | StatCards (tổng đơn, user, shipper, doanh thu) + danh sách đơn gần đây + trạng thái hệ thống |
| Đơn hàng | `/orders` | Bảng đơn hàng toàn hệ thống + panel chi tiết slide-in, filter theo status |
| Người dùng | `/users` | Danh sách user + role badge + modal thêm user mới + xóa user |
| Hub & Chi nhánh | `/hubs` | Card grid hub/branch: tên, địa chỉ, sức chứa, trạng thái hoạt động |
| Shipper | `/shippers` | Danh sách shipper: thông tin, khu vực, hiệu suất giao hàng |
| Phân tích | `/analytics` | Biểu đồ cột doanh thu theo tuần, biểu đồ donut trạng thái đơn, bảng xếp hạng shipper |
| Phân quyền | `/roles` | Ma trận quyền RBAC: hàng là role, cột là permission, toggle checkbox |
| Thông báo | `/notifications` | Danh sách thông báo + modal gửi thông báo hàng loạt |
| Cài đặt | `/settings` | Toggle các tính năng hệ thống |

### 3.3 Dashboard - Thiết kế chi tiết
```
┌─────────────────────────────────────────────────────┐
│  Tổng đơn      Người dùng    Shipper     Doanh thu  │
│  [Card]        [Card]        [Card]      [Card]     │
├──────────────────────────────────┬──────────────────┤
│                                  │                  │
│  Đơn hàng gần đây (5 đơn)       │  Trạng thái      │
│  ─────────────────────────────   │  hệ thống        │
│  PB-001  Nguyễn A  ₫35k  [Giao] │  • Gateway ✓     │
│  PB-002  Trần B    ₫28k  [Chờ]  │  • Identity ✓    │
│  ...                             │  • Order ✓       │
│                                  │  • Kafka ✓       │
│                    [Xem tất cả]  │  ...             │
└──────────────────────────────────┴──────────────────┘
```

---

## 4. Ops Dashboard (localhost:3003)

**Đối tượng:** Nhân viên vận hành trung tâm
**Framework:** Next.js 15, Dark theme

### 4.1 Các màn hình chính

| Màn hình | Route | Chức năng |
|----------|-------|-----------|
| Monitor thời gian thực | `/` | Live feed đơn mới, KPI realtime, trạng thái hub, biểu đồ throughput |
| Quản lý Hub | `/hubs` | Grid hub + thanh capacity, tổng đơn đang xử lý |
| Quản lý đơn | `/orders` | Bảng đơn + modal gán shipper thủ công |
| Báo cáo | `/reports` | KPI tuần/tháng, biểu đồ cột so sánh, bảng chi tiết ngày |
| Phân công giao hàng | `/branch/dispatch` | Board kéo-thả gán shipper cho đơn + Redis distributed lock simulation |
| Tuyến shipper | `/branch/shipper-routes` | Bản đồ tuyến giao hàng của từng shipper |
| Sắp xếp hàng | `/hub/sorting` | Giao diện scan QR, bảng hàng chờ, in nhãn |

### 4.2 Màn hình Dispatch (Phân công giao hàng)
```
┌──────────────────┬──────────────────────────────────┐
│  ĐƠN CHỜ GÁN     │  SHIPPER KHẢ DỤNG                │
│  ──────────────  │  ─────────────────────────────── │
│  PB-001          │  [●] Lê Shipper  - Đang rảnh      │
│  PB-002          │  [●] Trần Shipper - Đang rảnh     │
│  PB-003          │  [○] Võ Shipper  - Đang giao      │
│                  │                                  │
│  [Gán tự động]   │  [Gán thủ công]                  │
└──────────────────┴──────────────────────────────────┘
```

---

## 5. Shipper Portal (localhost:3002)

**Đối tượng:** Nhân viên giao hàng
**Framework:** Next.js 15, Mobile-first, Dark theme + Green accent

### 5.1 Các màn hình chính

| Màn hình | Route | Chức năng |
|----------|-------|-----------|
| Dashboard | `/` | Đơn đang giao (active), thống kê ngày, đơn gần đây, thông tin khu vực |
| Danh sách đơn | `/orders` | Tab filter theo trạng thái, tìm kiếm mã vận đơn |
| Chi tiết giao hàng | `/delivery/[id]` | Tiến trình giao (progress steps), thông tin gửi/nhận, nút xác nhận giao |
| Thu nhập | `/earnings` | Biểu đồ thu nhập theo ngày, bảng chi tiết, tổng tháng |
| Hồ sơ | `/profile` | Thông tin cá nhân, phương tiện, số điện thoại, toggle thông báo |

### 5.2 Màn hình giao hàng chi tiết
```
[Tiến trình: ●──●──●──○──○]
Đã nhận → Đang giao → [Hoàn thành]

Người gửi: Nguyễn Văn A  |  0901234567
Người nhận: Trần Thị B   |  0912345678
Địa chỉ: 123 Lê Lợi, Q.1

[Gọi người nhận]  [Chỉ đường]

[Xác nhận đã giao]  [Báo giao thất bại]
```

---

## 6. Driver Portal (localhost:3004)

**Đối tượng:** Tài xế vận chuyển liên hub
**Framework:** Next.js 15, Mobile-first, Green theme

### 6.1 Các màn hình chính

| Màn hình | Route | Chức năng |
|----------|-------|-----------|
| Dashboard | `/` | Chuyến hôm nay, thống kê, nút check-in, nút SOS |
| Danh sách chuyến | `/trips` | Lịch sử chuyến với search/filter, tổng quãng đường |
| Chi tiết chuyến | `/trips/[id]` | Checklist bước, thông tin tuyến, mã seal, danh sách kiện, QR modal, SOS |
| Lịch chạy | `/routes` | Lịch chuyến theo ngày, danh sách đơn trong chuyến |
| Hồ sơ | `/profile` | Thông tin cá nhân, phương tiện, bằng lái, thành tích |

---

## 7. Thiết kế Responsive

| App | Desktop (≥1280px) | Tablet (768-1279px) | Mobile (<768px) |
|-----|-------------------|---------------------|-----------------|
| Sender Web | Layout 2 cột | 1 cột | 1 cột, bottom nav |
| Admin Web | Sidebar + content | Sidebar thu gọn | Sidebar ẩn + hamburger |
| Ops Dashboard | Multi-panel | 2 cột | 1 cột scrollable |
| Shipper Portal | Centered card | Card full width | Bottom nav bar |
| Driver Portal | Centered card | Card full width | Bottom nav bar |

---

## 8. Hệ thống màu Badge và trạng thái

| Trạng thái | Màu nền | Màu chữ | Ý nghĩa |
|-----------|---------|---------|---------|
| Chờ xử lý | slate/10 | slate-400 | Đơn mới chưa xác nhận |
| Đã xác nhận | sky/10 | sky-400 | Đã tiếp nhận |
| Đang giao | sky/10 | sky-400 | Shipper đang trên đường |
| Hoàn thành | emerald/10 | emerald-400 | Giao thành công |
| Thất bại | rose/10 | rose-400 | Giao không thành công |
| Đã hủy | rose/10 | rose-400 | Đơn bị hủy |

---

*Tài liệu này là phần Thiết kế Giao diện của đồ án môn học Hệ thống phân tán — Nhóm phát triển PicBox.*
