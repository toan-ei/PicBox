# PicBox

Hệ thống quản lý giao nhận hàng hóa theo mô hình **hub-and-spoke**, xây dựng bằng kiến trúc microservices. PicBox hỗ trợ toàn bộ luồng vận hành: khách tạo đơn, shipper lấy hàng, phân loại tại hub, vận chuyển liên hub bằng xe tải, giao hàng, thu hộ COD và thông báo tự động.


---

## Mục lục

- [Kiến trúc](#kiến-trúc)
- [Công nghệ](#công-nghệ)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Yêu cầu môi trường](#yêu-cầu-môi-trường)
- [Chạy nhanh bằng Docker](#chạy-nhanh-bằng-docker)
- [Chạy ở chế độ phát triển](#chạy-ở-chế-độ-phát-triển)
- [Nạp dữ liệu mẫu](#nạp-dữ-liệu-mẫu)
- [Địa chỉ và cổng](#địa-chỉ-và-cổng)
- [API Gateway](#api-gateway)
- [Luồng sự kiện Kafka](#luồng-sự-kiện-kafka)
- [CI/CD](#cicd)
- [Tài liệu](#tài-liệu)

---

## Kiến trúc

```
                    ┌──────────────────────────────────────────────┐
                    │              Frontend (Next.js)               │
                    │  sender-web · admin-web · ops-dashboard       │
                    │  shipper-portal · driver-portal               │
                    └──────────────────────┬───────────────────────┘
                                           │ HTTP + JWT
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │         gateway-api  (Spring Cloud Gateway)   │
                    │   xác thực token qua identity-service         │
                    └──────────────────────┬───────────────────────┘
                                           │
      ┌──────────┬──────────┬──────────┬───┴──────┬──────────┬──────────┬──────────┐
      ▼          ▼          ▼          ▼          ▼          ▼          ▼          ▼
  identity   profile     order     payment     hub &      staff    tracking   notification
                                               branch
      │          │          │          │          │          │          │          │
   MySQL      MySQL      MySQL      MySQL      MySQL      MySQL     MongoDB     MySQL
                        + Redis                + Redis   + Redis   + Redis
                            │          │                     ▲          ▲          ▲
                            └──────────┴──────── Kafka ──────┴──────────┴──────────┘
```

Mỗi service có database riêng, giao tiếp đồng bộ qua REST (OpenFeign) và bất đồng bộ qua Kafka. `order-service` áp dụng **Saga** khi tạo đơn và **Transactional Outbox** khi phát sự kiện. `payment-service` dùng **optimistic locking** cho ví và **idempotency key** cho thanh toán.

### Backend services

| Service | Nhiệm vụ | Lưu trữ |
|---|---|---|
| `gateway-api` | Điểm vào duy nhất, định tuyến, kiểm tra JWT | — |
| `identity-service` | Đăng nhập, refresh, logout, user, role, permission | MySQL |
| `profile-service` | Hồ sơ người dùng, ảnh đại diện | MySQL |
| `order-service` | Đơn hàng, saga, outbox, lịch sử trạng thái, custody, route shipper | MySQL, Redis |
| `payment-service` | Ví điện tử, nạp tiền, ghi nợ, COD settlement | MySQL |
| `hub-and-branch-service` | Region, area, hub, chi nhánh, xe tải, tuyến, manifest, hàng đợi phân loại | MySQL, Redis |
| `staff-service` | Nhân viên (ops, shipper, driver), cache | MySQL, Redis |
| `tracking-service` | Timeline đơn hàng, vị trí GPS, WebSocket | MongoDB, Redis |
| `notification-service` | Nhận sự kiện, lưu thông báo, gửi email | MySQL |
| `file-service` | Upload / download file | MongoDB, đĩa |

### Frontend apps

| App | Người dùng | Cổng |
|---|---|---|
| `sender-web` | Khách gửi hàng: landing, tạo đơn, ví, tra cứu vận đơn | 3000 |
| `admin-web` | Quản trị viên: user, role, hub, đơn hàng, thống kê | 3001 |
| `shipper-portal` | Shipper: đơn được giao, cập nhật giao hàng, thu nhập | 3002 |
| `driver-portal` | Tài xế: chuyến hàng liên hub, lộ trình | 3003 |
| `ops-dashboard` | Vận hành: điều phối, phân loại tại hub, báo cáo | 3004 |

---

## Công nghệ

| Lớp | Công nghệ |
|---|---|
| Backend | Java 21, Spring Boot 4 / 3, Spring Security (OAuth2 Resource Server), Spring Data JPA, Spring Cloud Gateway, OpenFeign, Spring Kafka, MapStruct, Lombok |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4, Zustand, TanStack Query, Axios, Turborepo |
| Dữ liệu | MySQL 8, MongoDB 7, Redis 7 |
| Messaging | Apache Kafka 7.6 (Confluent), Kafka UI |
| Hạ tầng | Docker Compose, GitHub Actions, GitHub Container Registry |

---

## Cấu trúc thư mục

```
PicBox/
├── apps/                      # Frontend monorepo (npm workspaces + Turborepo)
│   ├── sender-web/
│   ├── admin-web/
│   ├── ops-dashboard/
│   ├── shipper-portal/
│   ├── driver-portal/
│   └── packages/
│       ├── types/             # TypeScript types dùng chung
│       ├── ui/                # Component UI dùng chung
│       └── utils/             # Axios client, API wrapper, auth helper
├── services/                  # Backend microservices (mỗi service một Maven project)
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
├── docker/
│   ├── docker-compose.dev.yml     # Full stack: infra + backend + frontend
│   ├── docker-compose.infra.yml   # Chỉ Redis + Kafka cho dev native
│   ├── mysql-init/                # Tạo database cho từng service
│   ├── seed-big.py                # Seed 200 sender + 100k đơn (ghi thẳng MySQL)
│   ├── seed.ps1                   # Seed nhỏ qua API
│   └── seed-hubs.ps1              # Seed hub & chi nhánh qua API
├── infra/
│   └── kafka/init-topics.sh       # Tạo Kafka topic khi khởi động
├── docs/                          # Tài liệu đồ án (8 chương)
├── .github/workflows/             # CI, CD staging, CD production
├── dev-start.ps1                  # Script dev nhẹ trên Windows
└── Makefile                       # Lệnh tắt cho docker compose
```

---

## Yêu cầu môi trường

| Công cụ | Phiên bản |
|---|---|
| Docker Desktop | 24+ (có Docker Compose v2) |
| Java (JDK) | 21 |
| Maven | 3.9+ (hoặc dùng `mvnw` có sẵn) |
| Node.js | 20+ |
| npm | 10+ |
| Python | 3.12 (chỉ cần nếu chạy `seed-big.py` ngoài Docker) |

Chạy full stack bằng Docker cần khoảng **6–8 GB RAM** trống.

---

## Chạy nhanh bằng Docker

Cách này dựng toàn bộ hệ thống: cơ sở dữ liệu, Kafka, 10 service backend và 5 frontend.

```bash
# 1. Tạo file env (mặc định đã có sẵn giá trị dev)
cp docker/.env.example docker/.env

# 2. Khởi động
make up
# hoặc
docker compose -f docker/docker-compose.dev.yml --env-file docker/.env up -d

# 3. Theo dõi log
make logs

# 4. Dừng
make down

# 5. Xóa sạch dữ liệu và dựng lại
make reset
```

Lần đầu build image Java và Next.js mất khoảng 10–15 phút. Sau khi các container lên, chờ thêm khoảng 60 giây để JVM khởi động xong.

Tài khoản quản trị mặc định được tạo tự động khi `identity-service` khởi động:

```
username: admin
password: admin
```

---

## Chạy ở chế độ phát triển

Cách này chỉ chạy Redis và Kafka trong Docker, còn service Java và frontend chạy trực tiếp trên máy để tiết kiệm RAM và tải lại nhanh. Cần MySQL cài sẵn trên máy ở cổng 3306 với user `dev` / `devpass`, đã chạy script [docker/mysql-init/01-create-databases.sql](docker/mysql-init/01-create-databases.sql).

### Windows (PowerShell)

```powershell
.\dev-start.ps1
```

Script mở 4 cửa sổ chạy `identity-service`, `profile-service`, `order-service` và `gateway-api`. Các service khác chạy thủ công nếu cần.

### Thủ công

```bash
# Hạ tầng
docker compose -f docker/docker-compose.infra.yml up -d

# Một service backend bất kỳ
cd services/order-service
./mvnw spring-boot:run

# Frontend: cài dependency một lần ở thư mục apps
cd apps
npm install

# Chạy một app
npm run dev:sender     # http://localhost:3000
npm run dev:admin      # http://localhost:3001
npm run dev:shipper    # http://localhost:3002
npm run dev:driver     # http://localhost:3003
npm run dev:ops        # http://localhost:3004

# Hoặc chạy tất cả qua Turborepo
npm run dev
```

Frontend đọc địa chỉ gateway từ biến `NEXT_PUBLIC_API_URL`, mặc định `http://localhost:8080`.

### Build và test backend

```bash
cd services/<tên-service>
./mvnw clean verify          # build + test
./mvnw clean package -DskipTests
```

---

## Nạp dữ liệu mẫu

| Script | Nội dung | Cách chạy |
|---|---|---|
| `docker/seed-hubs.ps1` | Hub và chi nhánh qua API (cần gateway đang chạy) | `.\docker\seed-hubs.ps1` |
| `docker/seed.ps1` | 10 sender + 40 đơn qua API | `.\docker\seed.ps1` |
| `docker/seed-big.py` | 200 sender + 100.000 đơn ghi thẳng MySQL | `docker compose -f docker/docker-compose.dev.yml run --rm seed` |

Chạy `seed-big.py` ngoài Docker:

```bash
pip install pymysql bcrypt
python docker/seed-big.py      # mặc định kết nối localhost:3307
```

Mật khẩu của các tài khoản seed là `Sender@123`.

---

## Địa chỉ và cổng

| Thành phần | Địa chỉ |
|---|---|
| API Gateway | http://localhost:8080 |
| Kafka UI | http://localhost:8090 |
| MySQL (Docker) | localhost:3307 |
| MongoDB | localhost:27017 |
| Redis | localhost:6379 |
| Kafka | localhost:9092 |

Cổng nội bộ của từng service backend (khi chạy native):

| Service | Cổng | Context path |
|---|---|---|
| gateway-api | 8080 | — |
| profile-service | 8081 | `/profile` |
| order-service | 8082 | `/order` |
| payment-service | 8083 | `/payment` |
| hub-and-branch-service | 8084 | `/hub` |
| staff-service | 8085 | `/staff` |
| notification-service | 8086 | `/notification` |
| identity-service | 8087 | `/identity` |
| tracking-service | 8088 | — |
| file-service | 8089 | `/file` |

---

## API Gateway

Mọi request từ frontend đi qua gateway. Gateway kiểm tra header `Authorization: Bearer <token>` bằng cách gọi `identity-service`, trừ các đường dẫn public như đăng nhập, đăng ký và download file.

```bash
# Đăng nhập
curl -X POST http://localhost:8080/identity/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Gọi API có xác thực
curl http://localhost:8080/order/orders/my \
  -H "Authorization: Bearer <token>"

# Tra cứu vận đơn
curl http://localhost:8080/order/orders/tracking/PKB1234567890 \
  -H "Authorization: Bearer <token>"
```

Mọi response có dạng chung:

```json
{
  "code": 0,
  "message": "...",
  "result": { }
}
```

`code = 0` là thành công. Mã lỗi khác được định nghĩa trong `ErrorCode` của từng service.

---

## Luồng sự kiện Kafka

| Topic | Producer | Consumer |
|---|---|---|
| `order.created` | order-service | tracking-service, notification-service |
| `order.status_changed` | order-service | tracking-service, notification-service |
| `order.cancelled` | order-service | notification-service |
| `shipper.assigned` | order-service | staff-service |
| `payment.success` | payment-service | notification-service |
| `notification.events` | bất kỳ | notification-service |

Topic được tạo sẵn bởi `infra/kafka/init-topics.sh` với 3 partition. Ba topic `order.created`, `payment.events`, `tracking.events` có thêm hàng đợi `.DLQ`.

Trạng thái đơn hàng đi qua 15 bước:

```
PENDING → CONFIRMED → PICKED_UP → AT_ORIGIN_BRANCH
→ IN_TRANSIT_TO_HUB → AT_HUB → IN_TRANSIT_TO_DEST_HUB
→ AT_DEST_HUB → IN_TRANSIT_TO_DEST_BRANCH → AT_DEST_BRANCH
→ OUT_FOR_DELIVERY → DELIVERED
                  ↘ DELIVERY_FAILED → RETURNED
                  ↘ CANCELLED
```

---

## CI/CD

| Workflow | Kích hoạt | Việc làm |
|---|---|---|
| `ci.yml` | push / PR vào `develop` | `mvn verify` cho 9 service theo matrix, build toàn bộ frontend |
| `cd-staging.yml` | push vào `develop` | Build JAR, push image lên GHCR với tag `sha-*` và `latest` |
| `cd-prod.yml` | push vào `main` | Build JAR, push image với tag `stable` và semver |
| `notify.yml` | sau khi các workflow trên xong | In kết quả (chưa nối kênh thông báo) |

Image được đẩy lên `ghcr.io/<owner>/<tên-service>`.

---

## Tài liệu

| File | Nội dung |
|---|---|
| [docs/01-phan-tich-yeu-cau.md](docs/01-phan-tich-yeu-cau.md) | Tác nhân, yêu cầu chức năng và phi chức năng |
| [docs/02-thiet-ke-giao-dien.md](docs/02-thiet-ke-giao-dien.md) | Thiết kế giao diện các app |
| [docs/03-thiet-ke-co-so-du-lieu.md](docs/03-thiet-ke-co-so-du-lieu.md) | Sơ đồ và bảng dữ liệu từng service |
| [docs/04-lap-trinh-phan-mem.md](docs/04-lap-trinh-phan-mem.md) | Quy ước code, pattern áp dụng |
| [docs/05-kiem-thu-phan-mem.md](docs/05-kiem-thu-phan-mem.md) | Kế hoạch và kịch bản kiểm thử |
| [docs/06-bao-tri-phan-mem.md](docs/06-bao-tri-phan-mem.md) | Bảo trì và vận hành |
| [docs/07-quan-ly-du-an.md](docs/07-quan-ly-du-an.md) | Quản lý dự án |
| [docs/08-ho-tro-nguoi-dung.md](docs/08-ho-tro-nguoi-dung.md) | Hướng dẫn người dùng |
| [ANALYSIS.md](ANALYSIS.md) | Phân tích kiến trúc, điểm mạnh và vấn đề cần khắc phục |

---

## Giấy phép

Dự án phục vụ mục đích học tập.
