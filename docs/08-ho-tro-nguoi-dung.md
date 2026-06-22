# HỖ TRỢ NGƯỜI DÙNG
## Hệ thống Quản lý Giao nhận Hàng hóa PicBox

---

## 1. Hướng dẫn khởi động hệ thống

### 1.1 Yêu cầu tối thiểu
| Phần mềm | Phiên bản | Mục đích |
|----------|-----------|---------|
| Docker Desktop | 27.x trở lên | Chạy toàn bộ hệ thống |
| RAM | Tối thiểu 8GB | Docker cần ít nhất 4GB |
| Ổ đĩa | Tối thiểu 15GB trống | Images + volumes |

### 1.2 Khởi động từ Docker Hub (dành cho người dùng cuối)
```bash
# Bước 1: Clone repo (chỉ cần file docker-compose)
git clone https://github.com/toan-ei/PicBox
cd PicBox/docker

# Bước 2: Khởi động toàn bộ hệ thống
docker compose -f docker-compose.dev.yml up -d

# Bước 3: Chờ khoảng 60 giây để tất cả service khởi động
# Bước 4: Kiểm tra trạng thái
docker compose -f docker-compose.dev.yml ps
```

### 1.3 Khởi động từ source code (dành cho developer)
```bash
# Bước 1: Clone source code
git clone https://github.com/toan-ei/PicBox

# Bước 2: Build tất cả Docker images
cd PicBox/docker
docker compose -f docker-compose.dev.yml build

# Bước 3: Chạy hệ thống
docker compose -f docker-compose.dev.yml up -d
```

---

## 2. Truy cập các ứng dụng

| Ứng dụng | URL | Dành cho |
|----------|-----|---------|
| Sender Web | http://localhost:3000 | Khách hàng gửi hàng |
| Admin Web | http://localhost:3001 | Quản trị viên |
| Shipper Portal | http://localhost:3002 | Nhân viên giao hàng |
| Ops Dashboard | http://localhost:3003 | Nhân viên vận hành |
| Driver Portal | http://localhost:3004 | Tài xế |
| API Gateway | http://localhost:8080 | Cổng API (dành cho developer) |
| Kafka UI | http://localhost:8090 | Monitor message queue |

---

## 3. Hướng dẫn sử dụng theo vai trò

### 3.1 Người gửi hàng (Sender)

**Đăng ký tài khoản:**
1. Truy cập http://localhost:3000
2. Nhấn "Đăng ký" → Điền họ tên, số điện thoại, tên đăng nhập, mật khẩu
3. Nhấn "Tạo tài khoản" → Đăng nhập ngay

**Tạo đơn hàng mới:**
1. Đăng nhập → Nhấn "Tạo đơn hàng"
2. Bước 1: Thông tin người gửi — tên, SĐT, chọn chi nhánh lấy hàng
3. Bước 2: Thông tin người nhận — tên, SĐT, địa chỉ giao
4. Bước 3: Thông tin hàng hóa — trọng lượng, kích thước, ghi chú, COD
5. Bước 4: Xem tóm tắt và cước phí → Nhấn "Xác nhận tạo đơn"
6. Nhận mã vận đơn (ví dụ: PB-2026001234)

**Theo dõi đơn hàng:**
- Vào trang "Tra cứu" → Nhập mã vận đơn → Xem timeline trạng thái
- Hoặc vào "Đơn hàng của tôi" → Xem danh sách và trạng thái

---

### 3.2 Quản trị viên (Admin)

**Đăng nhập:**
- Truy cập http://localhost:3001
- Dùng tài khoản admin đã được cấp

**Quản lý đơn hàng:**
1. Sidebar → "Đơn hàng"
2. Xem tất cả đơn trong hệ thống
3. Click vào đơn để xem chi tiết (panel bên phải)
4. Filter theo tab: Chờ xử lý / Đang giao / Hoàn thành / Thất bại

**Quản lý người dùng:**
1. Sidebar → "Người dùng"
2. Xem danh sách, filter theo vai trò
3. Nhấn "Thêm người dùng" → Điền thông tin → Tạo
4. Nhấn icon thùng rác để xóa user

**Quản lý Hub & Chi nhánh:**
1. Sidebar → "Hub & Chi nhánh"
2. Xem card từng hub: tên, địa chỉ, sức chứa, trạng thái
3. Filter: Tất cả / Hub chính / Chi nhánh

**Xem Dashboard tổng quan:**
- Sidebar → Dashboard (trang mặc định)
- Xem: Tổng đơn, số người dùng, số shipper, doanh thu ước tính
- 5 đơn hàng gần nhất với trạng thái real-time

---

### 3.3 Nhân viên vận hành (Ops Manager)

**Theo dõi real-time:**
1. Truy cập http://localhost:3003
2. Trang chủ: Live monitor — KPI đơn hàng, trạng thái hub, biểu đồ throughput

**Phân công giao hàng:**
1. Sidebar → "Phân công"
2. Xem danh sách đơn chờ gán và shipper khả dụng
3. Chọn đơn + shipper → Nhấn "Gán"

**Quản lý sắp xếp hàng tại hub:**
1. Sidebar → "Sắp xếp hàng"
2. Scan QR kiện hàng → Phân loại vào xe/tuyến

---

### 3.4 Shipper (Nhân viên giao hàng)

**Xem đơn được giao:**
1. Truy cập http://localhost:3002
2. Dashboard: Xem đơn đang giao ngay trên trang chủ
3. Tab "Đơn hàng": Xem tất cả, filter theo trạng thái

**Cập nhật giao hàng:**
1. Nhấn vào đơn hàng → Trang chi tiết
2. Xem địa chỉ và thông tin người nhận
3. Nhấn "Xác nhận đã giao" khi giao thành công
4. Hoặc "Báo giao thất bại" nếu không gặp người nhận

---

## 4. Câu hỏi thường gặp (FAQ)

**Q: Quên mật khẩu làm sao?**
A: Hiện tại liên hệ Admin để reset. Tính năng "Quên mật khẩu" đang trong lộ trình phát triển.

**Q: Tôi không thấy đơn hàng vừa tạo trong admin-web?**
A: Nhấn nút "Tải lại" (icon reload) trên trang. Dữ liệu được load từ API mỗi lần vào trang.

**Q: Kafka UI hiển thị 0 message, có bình thường không?**
A: Bình thường nếu chưa tạo đơn hàng. Tạo đơn và cập nhật trạng thái, Kafka UI sẽ hiển thị message trong topic `order.status_changed`.

**Q: Container bị "Restarting", làm sao fix?**
A: Chạy lệnh sau để xem log lỗi:
```bash
docker logs <tên-container> --tail=20
```
Thường gặp: database chưa ready → chờ thêm 30 giây và `docker compose up -d` lại.

**Q: Làm sao xóa hết data và chạy lại từ đầu?**
```bash
docker compose -f docker-compose.dev.yml down -v  # Xóa containers + volumes
docker compose -f docker-compose.dev.yml up -d    # Chạy lại
```

---

## 5. Hỗ trợ kỹ thuật

| Vấn đề | Cách liên hệ |
|--------|-------------|
| Lỗi kỹ thuật | Tạo issue trên GitHub repository |
| Câu hỏi chức năng | Liên hệ thành viên nhóm qua Discord |
| Yêu cầu tính năng mới | Tạo Feature Request trên GitHub |

**Repository:** https://github.com/toan-ei/PicBox

---

## 6. Tài khoản mẫu để demo

> **Lưu ý:** Cần chạy seed data trước khi dùng các tài khoản mẫu.

| Vai trò | Username | Mật khẩu |
|---------|---------|---------|
| Admin | admin | PicBox@2026 |
| Ops Manager | ops01 | PicBox@2026 |
| Shipper | shipper01 | PicBox@2026 |
| Driver | driver01 | PicBox@2026 |
| Sender (Khách) | sender01 | PicBox@2026 |

---

*Tài liệu này là phần Hỗ trợ Người dùng của đồ án môn học Hệ thống phân tán — Nhóm phát triển PicBox.*
