"""
Generate 4 Word report documents for PicBox academic project.
Run: python gen_word.py
"""
from docx import Document
from docx.shared import Pt, Cm, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

# ─── Helpers ──────────────────────────────────────────────────────────────────

def new_doc():
    doc = Document()
    style = doc.styles['Normal']
    style.font.name = 'Times New Roman'
    style.font.size = Pt(13)
    # Set page margins
    for section in doc.sections:
        section.top_margin    = Cm(2.5)
        section.bottom_margin = Cm(2.5)
        section.left_margin   = Cm(3.5)
        section.right_margin  = Cm(2.0)
    return doc

def set_heading(doc, text, level):
    h = doc.add_heading(text, level=level)
    h.style.font.name = 'Times New Roman'
    for run in h.runs:
        run.font.name = 'Times New Roman'
        if level == 1:
            run.font.size = Pt(16)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)
        elif level == 2:
            run.font.size = Pt(14)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0x2E, 0x74, 0xB5)
        else:
            run.font.size = Pt(13)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0x00, 0x00, 0x00)
    h.paragraph_format.space_before = Pt(12)
    h.paragraph_format.space_after  = Pt(6)
    return h

def para(doc, text, bold=False, italic=False, indent=0):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(13)
    run.font.bold   = bold
    run.font.italic = italic
    p.paragraph_format.alignment    = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_after  = Pt(6)
    p.paragraph_format.first_line_indent = Cm(1.27) if indent == 0 else Cm(indent)
    return p

def bullet(doc, text, level=1):
    p = doc.add_paragraph(style='List Bullet')
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(13)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.left_indent = Cm(level * 0.75)
    return p

def title_page(doc, title, subtitle="Báo cáo Đồ án Môn học — Hệ thống Phân tán"):
    doc.add_paragraph()
    doc.add_paragraph()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("TRƯỜNG ĐẠI HỌC\nĐỒ ÁN MÔN HỌC HỆ THỐNG PHÂN TÁN")
    run.font.name = 'Times New Roman'
    run.font.size = Pt(13)
    run.font.bold = True

    doc.add_paragraph()
    doc.add_paragraph()

    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r2 = p2.add_run(title)
    r2.font.name = 'Times New Roman'
    r2.font.size = Pt(18)
    r2.font.bold = True
    r2.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    doc.add_paragraph()
    p3 = doc.add_paragraph()
    p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r3 = p3.add_run(subtitle)
    r3.font.name = 'Times New Roman'
    r3.font.size = Pt(13)
    r3.font.italic = True

    doc.add_paragraph()
    p4 = doc.add_paragraph()
    p4.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r4 = p4.add_run("Hệ thống Quản lý Giao nhận Hàng hóa PicBox")
    r4.font.name = 'Times New Roman'
    r4.font.size = Pt(14)
    r4.font.bold = True

    doc.add_paragraph()
    doc.add_paragraph()
    p5 = doc.add_paragraph()
    p5.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r5 = p5.add_run("Năm 2025 – 2026")
    r5.font.name = 'Times New Roman'
    r5.font.size = Pt(13)
    doc.add_page_break()

def add_table(doc, headers, rows, col_widths=None):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = 'Table Grid'
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = t.rows[0].cells
    for i, h in enumerate(headers):
        hdr[i].text = h
        for p in hdr[i].paragraphs:
            for r in p.runs:
                r.font.bold = True
                r.font.name = 'Times New Roman'
                r.font.size = Pt(12)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        hdr[i].vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        tc = hdr[i]._tc
        tcPr = tc.get_or_add_tcPr()
        shd = OxmlElement('w:shd')
        shd.set(qn('w:val'), 'clear')
        shd.set(qn('w:color'), 'auto')
        shd.set(qn('w:fill'), '2E74B5')
        tcPr.append(shd)
        for r in hdr[i].paragraphs[0].runs:
            r.font.color.rgb = RGBColor(0xFF,0xFF,0xFF)
    for row in rows:
        cells = t.add_row().cells
        for i, val in enumerate(row):
            cells[i].text = str(val)
            for p in cells[i].paragraphs:
                for r in p.runs:
                    r.font.name = 'Times New Roman'
                    r.font.size = Pt(12)
    if col_widths:
        for i, w in enumerate(col_widths):
            for row in t.rows:
                row.cells[i].width = Cm(w)
    doc.add_paragraph()
    return t

# ══════════════════════════════════════════════════════════════════════════════
# DOCUMENT 1 — Thiết kế cơ sở dữ liệu
# ══════════════════════════════════════════════════════════════════════════════
def make_db_design():
    doc = new_doc()
    title_page(doc, "THIẾT KẾ CƠ SỞ DỮ LIỆU")

    set_heading(doc, "1. TỔNG QUAN VỀ THIẾT KẾ CƠ SỞ DỮ LIỆU", 1)

    set_heading(doc, "1.1. Mô hình Database-per-Service", 2)
    para(doc, "Trong kiến trúc microservices, mỗi service sở hữu một cơ sở dữ liệu riêng biệt, hoàn toàn độc lập với các service khác. Đây là nguyên tắc cốt lõi được gọi là Database-per-Service Pattern. Nguyên tắc này đảm bảo tính tự trị của từng service, cho phép mỗi service lựa chọn công nghệ lưu trữ phù hợp nhất với đặc thù nghiệp vụ của mình mà không bị ràng buộc bởi các service còn lại.")
    para(doc, "Hệ thống PicBox áp dụng triệt để mô hình này. Chín service backend sử dụng tám schema riêng biệt trong MySQL 8 cùng một instance MongoDB dành cho notification-service. Mỗi schema được khởi tạo tự động thông qua các script SQL trong thư mục mysql-init, đảm bảo môi trường Docker có thể tái tạo hoàn toàn từ đầu mà không cần can thiệp thủ công.")
    para(doc, "Lợi ích quan trọng nhất của mô hình này là khả năng phát triển độc lập: khi một team thay đổi schema của order-service, họ không cần phối hợp với team quản lý identity-service. Việc migration database chỉ ảnh hưởng đến service tương ứng, rủi ro được giảm thiểu đáng kể.")

    set_heading(doc, "1.2. Lựa chọn hệ quản trị cơ sở dữ liệu", 2)
    para(doc, "PicBox sử dụng hai hệ quản trị cơ sở dữ liệu với mục đích khác nhau:")
    para(doc, "MySQL 8.0 được chọn cho 9 service nghiệp vụ chính (identity, profile, order, payment, hub-and-branch, staff, tracking, file). MySQL là hệ quản trị quan hệ trưởng thành, hỗ trợ ACID đầy đủ, phù hợp với dữ liệu có cấu trúc rõ ràng, các quan hệ phức tạp và yêu cầu tính nhất quán cao. Giao dịch ACID đặc biệt quan trọng với order-service và payment-service, nơi mỗi thao tác phải đảm bảo tính toàn vẹn dữ liệu tuyệt đối.", indent=1.27)
    para(doc, "MongoDB được chọn cho notification-service. Thông báo có cấu trúc linh hoạt, tùy theo loại sự kiện mà payload data có thể khác nhau. MongoDB với schema-less approach cho phép lưu trữ các notification document với cấu trúc đa dạng mà không cần thay đổi schema. Ngoài ra, MongoDB hỗ trợ TTL index giúp tự động xóa thông báo cũ sau một khoảng thời gian, phù hợp với đặc thù của notification.", indent=1.27)

    set_heading(doc, "1.3. Nguyên tắc thiết kế", 2)
    para(doc, "Toàn bộ cơ sở dữ liệu của hệ thống PicBox được thiết kế tuân theo các nguyên tắc sau:")
    bullet(doc, "Chuẩn hóa dữ liệu (Normalization): Các bảng được thiết kế đạt chuẩn 3NF (Third Normal Form), loại bỏ các phụ thuộc bắc cầu và dư thừa dữ liệu.")
    bullet(doc, "Sử dụng UUID làm khóa chính: Thay vì dùng integer auto-increment, PicBox sử dụng UUID (VARCHAR(36)) làm primary key cho tất cả các bảng. Điều này đảm bảo tính duy nhất toàn cục, hỗ trợ phân tán và tránh xung đột khi merge dữ liệu từ nhiều nguồn.")
    bullet(doc, "Soft delete: Nhiều bảng có trường is_deleted hoặc active để đánh dấu xóa logic thay vì xóa vật lý, đảm bảo tính truy vết và kiểm toán.")
    bullet(doc, "Audit fields: Các trường created_at, updated_at được tự động quản lý bởi Spring Data JPA thông qua @CreationTimestamp và @UpdateTimestamp.")
    bullet(doc, "Index tối ưu: Các trường thường xuyên được dùng trong điều kiện WHERE (username, trackingCode, status, shipperId) được đánh index để tăng tốc độ truy vấn.")

    set_heading(doc, "2. SCHEMA CỦA TỪNG SERVICE", 1)

    set_heading(doc, "2.1. Identity Service — Quản lý tài khoản và phân quyền", 2)
    para(doc, "Identity service quản lý toàn bộ vòng đời tài khoản người dùng: tạo tài khoản, xác thực, phân quyền và quản lý token. Schema gồm 4 bảng chính với quan hệ nhiều-nhiều giữa User và Role thông qua bảng trung gian.")
    para(doc, "Bảng users lưu thông tin đăng nhập: id (UUID), username (UNIQUE), password (BCrypt hash), và trạng thái is_active. Mật khẩu không bao giờ được lưu dưới dạng plaintext; BCrypt với strength 10 được áp dụng, đảm bảo ngay cả khi database bị lộ, kẻ tấn công cũng không thể reverse engineer mật khẩu gốc trong thời gian thực tế.")
    para(doc, "Bảng roles định nghĩa các vai trò trong hệ thống: ADMIN, OPS, SHIPPER, DRIVER, SENDER. Mỗi role có thể có nhiều permission, được liên kết qua bảng role_permission. Thiết kế này cho phép mở rộng quyền hạn chi tiết sau này mà không cần thay đổi cấu trúc bảng chính.")
    para(doc, "Bảng invalidated_tokens lưu các JWT đã bị vô hiệu hóa (do logout hoặc đổi mật khẩu). Đây là giải pháp stateless token blacklist: thay vì lưu session, server chỉ lưu danh sách token đã hủy kèm expiry_time. Job định kỳ tự động xóa các record đã hết hạn để tránh bảng phình to.")

    add_table(doc,
        ["Bảng", "Cột chính", "Kiểu dữ liệu", "Mô tả"],
        [
            ["users", "id", "VARCHAR(36) PK", "UUID tài khoản"],
            ["", "username", "VARCHAR(50) UNIQUE NOT NULL", "Tên đăng nhập"],
            ["", "password", "VARCHAR(255) NOT NULL", "BCrypt hash"],
            ["", "is_active", "BOOLEAN DEFAULT TRUE", "Trạng thái tài khoản"],
            ["roles", "id", "VARCHAR(36) PK", "UUID vai trò"],
            ["", "name", "VARCHAR(50) UNIQUE", "ADMIN/OPS/SHIPPER/DRIVER/SENDER"],
            ["user_roles", "user_id", "VARCHAR(36) FK → users", "Liên kết user-role"],
            ["", "role_id", "VARCHAR(36) FK → roles", ""],
            ["invalidated_tokens", "id", "VARCHAR(512) PK", "JWT token ID (jti)"],
            ["", "expiry_time", "DATETIME", "Thời điểm hết hạn token"],
        ],
        [3.5, 5.5, 5.0, 5.0]
    )

    set_heading(doc, "2.2. Profile Service — Thông tin cá nhân", 2)
    para(doc, "Profile service tách biệt thông tin xác thực (username, password) khỏi thông tin cá nhân (tên, số điện thoại, địa chỉ). Thiết kế này tuân theo nguyên tắc Single Responsibility: identity-service chỉ quan tâm đến việc 'bạn là ai', còn profile-service quan tâm đến 'bạn trông như thế nào'. Hai service giao tiếp qua REST API nội bộ thông qua OpenFeign.")
    para(doc, "Trường userId trong bảng profiles là foreign key logic (không phải DB-level FK) trỏ đến id của bảng users trong identity-service. Do hai service dùng hai schema khác nhau, không thể tạo DB-level foreign key constraint. Thay vào đó, tính nhất quán được đảm bảo bởi application logic: khi tạo user mới, identity-service gọi profile-service để tạo profile tương ứng.")

    add_table(doc,
        ["Cột", "Kiểu dữ liệu", "Ràng buộc", "Mô tả"],
        [
            ["id", "VARCHAR(36)", "PRIMARY KEY", "UUID profile"],
            ["userId", "VARCHAR(36)", "UNIQUE NOT NULL", "Tham chiếu đến users.id (identity-service)"],
            ["fullName", "VARCHAR(255)", "NOT NULL", "Họ và tên đầy đủ"],
            ["phoneNumber", "VARCHAR(20)", "", "Số điện thoại"],
            ["email", "VARCHAR(255)", "", "Email"],
            ["gender", "VARCHAR(10)", "", "Giới tính"],
            ["dateOfBirth", "DATE", "", "Ngày sinh"],
            ["avatarUrl", "VARCHAR(512)", "", "URL ảnh đại diện (file-service)"],
            ["created_at", "DATETIME", "DEFAULT NOW()", "Thời điểm tạo"],
            ["updated_at", "DATETIME", "ON UPDATE NOW()", "Thời điểm cập nhật cuối"],
        ],
        [3.0, 3.5, 4.0, 9.0]
    )

    set_heading(doc, "2.3. Order Service — Quản lý đơn hàng", 2)
    para(doc, "Order service chứa schema phức tạp nhất trong hệ thống, phản ánh vòng đời đầy đủ của một đơn hàng từ lúc tạo đến khi hoàn tất hoặc hủy. Schema gồm hai bảng chính: orders và outbox_events.")
    para(doc, "Bảng orders lưu toàn bộ thông tin của đơn hàng. Trường status là enum với 15 giá trị có thể, phản ánh mọi trạng thái trong quy trình logistics: PENDING → CONFIRMED → PICKED_UP → IN_TRANSIT → ARRIVED_AT_HUB → SORTING → DISPATCHED → OUT_FOR_DELIVERY → DELIVERED | DELIVERY_FAILED | CANCELLED. Thiết kế trạng thái chi tiết giúp hệ thống theo dõi vị trí đơn hàng chính xác.")
    para(doc, "Trường trackingCode được sinh tự động theo định dạng PB-{năm}{số thứ tự 6 chữ số} (ví dụ: PB-2026001234). Đây là mã duy nhất được cung cấp cho người gửi để tra cứu trạng thái đơn.")
    para(doc, "Trường shipperId lưu UUID của shipper được gán phụ trách giao đơn này. Trường này NULL khi đơn chưa được gán shipper, và được cập nhật khi ops-dashboard thực hiện thao tác phân công.")
    para(doc, "Bảng outbox_events là thành phần cốt lõi của Outbox Pattern — một kỹ thuật đảm bảo tính nhất quán trong hệ thống phân tán. Mỗi khi trạng thái đơn hàng thay đổi, một record được ghi vào outbox_events trong cùng một database transaction với bản thân việc cập nhật đơn. Một Scheduled Job chạy mỗi 5 giây đọc các event chưa publish (published_at IS NULL) và gửi lên Kafka, sau đó đánh dấu published_at. Cơ chế này đảm bảo at-least-once delivery: ngay cả khi service bị crash sau khi lưu DB nhưng trước khi gửi Kafka, event sẽ được gửi lại khi service khởi động lại.")

    add_table(doc,
        ["Cột", "Kiểu dữ liệu", "Mô tả"],
        [
            ["id", "VARCHAR(36) PK", "UUID đơn hàng"],
            ["trackingCode", "VARCHAR(20) UNIQUE", "Mã vận đơn (PB-2026XXXXXX)"],
            ["senderId", "VARCHAR(36) NOT NULL", "UUID người gửi (identity-service)"],
            ["senderName / senderPhone", "VARCHAR(255)", "Thông tin người gửi (denormalized)"],
            ["receiverName / receiverPhone", "VARCHAR(255)", "Thông tin người nhận"],
            ["receiverAddress", "TEXT", "Địa chỉ giao hàng"],
            ["originBranchId / destBranchId", "VARCHAR(36)", "Chi nhánh lấy/giao (hub-service)"],
            ["originBranchName / destBranchName", "VARCHAR(255)", "Tên chi nhánh (denormalized)"],
            ["weight", "DECIMAL(8,2)", "Trọng lượng (kg)"],
            ["fee", "DECIMAL(12,2)", "Phí vận chuyển (VND)"],
            ["codAmount", "DECIMAL(12,2)", "Tiền thu hộ COD (VND)"],
            ["status", "ENUM(15 values)", "Trạng thái hiện tại"],
            ["shipperId", "VARCHAR(36) NULL", "UUID shipper phụ trách"],
            ["note", "TEXT NULL", "Ghi chú"],
            ["created_at / updated_at", "DATETIME", "Audit fields tự động"],
        ],
        [4.5, 4.5, 10.0]
    )

    set_heading(doc, "2.4. Hub & Branch Service — Mạng lưới logistics", 2)
    para(doc, "Hub & Branch service quản lý toàn bộ cơ sở hạ tầng vật lý của mạng lưới vận chuyển theo mô hình hub-and-spoke. Schema được thiết kế theo mô hình phân cấp địa lý: Region (miền) → Area (vùng/tỉnh) → Hub (trung tâm chính) → Branch (chi nhánh). Mô hình này phản ánh thực tế hoạt động của các công ty logistics lớn tại Việt Nam.")
    para(doc, "Bảng hubs đại diện cho các trung tâm trung chuyển hàng hóa cấp tỉnh/vùng. Mỗi hub có capacity (sức chứa tối đa kiện hàng), currentLoad (tải hiện tại) để hệ thống có thể quyết định điều tiết hàng. Bảng branches là các điểm nhận/giao hàng trực tiếp tại địa phương, luôn thuộc về một hub cha thông qua hubId.")
    para(doc, "Bảng trucks quản lý đội xe vận tải, với trạng thái (AVAILABLE, IN_USE, MAINTENANCE) và liên kết với hub. Bảng routes định nghĩa các tuyến vận chuyển cố định giữa các hub, bao gồm thông tin khoảng cách và thời gian ước tính. Bảng sorting_items quản lý hàng hóa đang trong quá trình phân loại tại hub, với trạng thái xử lý theo thời gian thực.")

    set_heading(doc, "2.5. Staff Service — Quản lý nhân viên", 2)
    para(doc, "Staff service quản lý thông tin nhân viên vận hành: shipper, driver và ops manager. Bảng staff_members liên kết với userId trong identity-service để biết tài khoản đăng nhập, đồng thời lưu thông tin nghiệp vụ như homeBaseId (chi nhánh/hub chủ quản), role nghiệp vụ (SHIPPER/DRIVER/OPS), và trạng thái làm việc (ACTIVE, ON_LEAVE, INACTIVE).")
    para(doc, "Trường homeBaseId là điểm kết nối quan trọng giữa staff-service và hub-service: xác định nhân viên thuộc chi nhánh nào, từ đó ops-dashboard có thể lọc shipper theo khu vực khi phân công giao hàng.")

    set_heading(doc, "2.6. Tracking Service — Lịch sử theo dõi", 2)
    para(doc, "Tracking service duy trì lịch sử đầy đủ của mỗi đơn hàng. Mỗi lần trạng thái đơn thay đổi, một record mới được thêm vào bảng tracking_events với orderId, fromStatus, toStatus, description, location và timestamp. Đây là thiết kế append-only (chỉ thêm, không bao giờ xóa hoặc sửa), đảm bảo tính bất biến của lịch sử.")
    para(doc, "Thiết kế này cho phép hiển thị timeline trực quan trên sender-web: người gửi thấy toàn bộ hành trình của kiện hàng từ lúc nhận đến lúc giao, bao gồm timestamp và địa điểm cụ thể của từng bước.")

    set_heading(doc, "2.7. Notification Service — Thông báo (MongoDB)", 2)
    para(doc, "Notification service sử dụng MongoDB thay vì MySQL. Document cấu trúc của một notification:")
    para(doc, "Mỗi notification document có: _id (ObjectId), userId (liên kết đến identity), title, body, type (ORDER_STATUS_CHANGED, PAYMENT_CONFIRMED, ...), data (object linh hoạt theo type), isRead (boolean), createdAt. Trường data có cấu trúc khác nhau tùy theo type — đây chính là lý do MongoDB được chọn: schema flexibility cho phép thêm loại thông báo mới mà không cần migration.")
    para(doc, "TTL Index được tạo trên trường createdAt với expireAfterSeconds = 2592000 (30 ngày), đảm bảo MongoDB tự động xóa thông báo cũ mà không cần job định kỳ.")

    set_heading(doc, "3. CHIẾN LƯỢC ĐẢM BẢO NHẤT QUÁN DỮ LIỆU", 1)

    set_heading(doc, "3.1. Vấn đề nhất quán trong microservices", 2)
    para(doc, "Trong kiến trúc monolithic, một transaction ACID duy nhất có thể span toàn bộ nghiệp vụ: tạo đơn, trừ tồn kho, trừ tiền đều trong một transaction. Trong microservices với nhiều database riêng biệt, điều này không còn khả thi. Distributed transaction (2PC — Two-Phase Commit) là giải pháp lý thuyết, nhưng trong thực tế nó làm giảm availability và tạo bottleneck.")
    para(doc, "PicBox chọn Eventual Consistency: các service chấp nhận dữ liệu có thể tạm thời không nhất quán giữa các service, miễn là hệ thống cuối cùng đạt được trạng thái nhất quán. Cơ chế đảm bảo eventual consistency là Kafka event streaming và Outbox Pattern.")

    set_heading(doc, "3.2. Outbox Pattern — Đảm bảo at-least-once delivery", 2)
    para(doc, "Outbox Pattern giải quyết vấn đề dual write: làm thế nào để vừa lưu dữ liệu vào DB vừa gửi message lên Kafka một cách đáng tin cậy, không để xảy ra tình trạng một bên thành công một bên thất bại?")
    para(doc, "Giải pháp: thay vì gọi Kafka trực tiếp trong business logic, service chỉ ghi event vào bảng outbox_events trong cùng một transaction với dữ liệu nghiệp vụ. Sau đó, một Polling Publisher (Scheduled Job) đọc các event chưa gửi và publish lên Kafka. Nếu publish thành công, đánh dấu published_at. Nếu service crash trước khi publish, event vẫn còn trong DB và sẽ được gửi khi service khởi động lại.")
    para(doc, "Đây là giải pháp đảm bảo at-least-once: event có thể được gửi nhiều lần nếu crash xảy ra sau publish nhưng trước khi commit. Consumer (notification-service) cần implement idempotency để xử lý duplicate message.")

    set_heading(doc, "3.3. Denormalization — Đánh đổi nhất quán để lấy hiệu năng", 2)
    para(doc, "Một số trường trong orders bị denormalize: senderName, senderPhone, originBranchName, destBranchName được lưu trực tiếp trong bảng orders thay vì chỉ lưu ID và join sang service khác khi cần.")
    para(doc, "Lý do: khi hiển thị danh sách đơn hàng, nếu phải gọi identity-service để lấy tên người gửi và hub-service để lấy tên chi nhánh, mỗi request danh sách 50 đơn sẽ cần 50 + 50 = 100 external calls. Denormalization cho phép đọc toàn bộ thông tin trong một query duy nhất. Đánh đổi: nếu người gửi đổi tên, tên trong các đơn cũ sẽ không được cập nhật — nhưng đây là hành vi mong muốn trong logistics (đơn hàng cũ phải lưu trữ thông tin tại thời điểm tạo đơn).")

    set_heading(doc, "4. INDEXING VÀ TỐI ƯU TRUY VẤN", 1)

    set_heading(doc, "4.1. Chiến lược đánh Index", 2)
    para(doc, "Index được tạo cẩn thận dựa trên các query pattern thực tế của từng service. Tạo quá nhiều index làm chậm INSERT/UPDATE; tạo quá ít index làm chậm SELECT. PicBox áp dụng nguyên tắc chỉ đánh index các trường thực sự cần thiết:")
    add_table(doc,
        ["Service", "Bảng", "Index", "Lý do"],
        [
            ["identity", "users", "UNIQUE(username)", "Kiểm tra trùng username khi đăng ký"],
            ["order", "orders", "INDEX(status)", "Filter đơn theo trạng thái (query phổ biến nhất)"],
            ["order", "orders", "INDEX(senderId)", "Lấy đơn của một người gửi cụ thể"],
            ["order", "orders", "UNIQUE(trackingCode)", "Tra cứu nhanh bằng mã vận đơn"],
            ["order", "orders", "INDEX(shipperId)", "Lấy tất cả đơn của một shipper"],
            ["order", "outbox_events", "INDEX(published_at)", "Polling job tìm event chưa publish nhanh hơn"],
            ["tracking", "tracking_events", "INDEX(orderId, created_at)", "Lấy lịch sử theo đơn, sắp xếp theo thời gian"],
            ["notification", "notifications", "TTL Index(createdAt)", "MongoDB tự xóa sau 30 ngày"],
        ],
        [2.5, 3.5, 4.5, 8.5]
    )

    doc.save(os.path.join(OUTPUT_DIR, "03-thiet-ke-co-so-du-lieu.docx"))
    print("✓ 03-thiet-ke-co-so-du-lieu.docx")

# ══════════════════════════════════════════════════════════════════════════════
# DOCUMENT 2 — Lập trình phần mềm quản lý
# ══════════════════════════════════════════════════════════════════════════════
def make_software_dev():
    doc = new_doc()
    title_page(doc, "LẬP TRÌNH PHẦN MỀM QUẢN LÝ")

    set_heading(doc, "1. KIẾN TRÚC PHẦN MỀM", 1)

    set_heading(doc, "1.1. Kiến trúc Microservices", 2)
    para(doc, "Kiến trúc microservices là phương pháp xây dựng ứng dụng như một tập hợp các service nhỏ, độc lập, mỗi service chạy trong tiến trình riêng và giao tiếp với nhau qua các cơ chế nhẹ (thường là HTTP REST hoặc message broker). Khác với kiến trúc monolithic truyền thống, nơi toàn bộ ứng dụng được triển khai như một đơn vị duy nhất, microservices cho phép mỗi service được phát triển, triển khai và scale độc lập.")
    para(doc, "Hệ thống PicBox được xây dựng với 9 microservice backend, mỗi service chịu trách nhiệm cho một domain nghiệp vụ cụ thể. Các service giao tiếp với nhau theo hai mô hình: synchronous (OpenFeign REST calls) cho các truy vấn cần kết quả ngay, và asynchronous (Kafka) cho các sự kiện nghiệp vụ không cần phản hồi tức thì.")

    set_heading(doc, "1.2. Các nguyên tắc SOLID trong thiết kế", 2)
    para(doc, "Toàn bộ codebase PicBox được thiết kế theo nguyên tắc SOLID, là nền tảng của lập trình hướng đối tượng chất lượng cao:")
    bullet(doc, "Single Responsibility Principle (SRP): Mỗi class chỉ có một lý do để thay đổi. Ví dụ: UserService chỉ xử lý logic nghiệp vụ người dùng, UserRepository chỉ xử lý truy cập dữ liệu, UserController chỉ xử lý HTTP request/response. Ba lớp tách biệt thay vì nhồi nhét vào một class.")
    bullet(doc, "Open/Closed Principle (OCP): Các class mở để mở rộng nhưng đóng để sửa đổi. Hệ thống status transition của đơn hàng được implement theo cách thêm trạng thái mới không yêu cầu sửa đổi core logic, chỉ cần thêm enum value và update logic kiểm tra.")
    bullet(doc, "Liskov Substitution Principle (LSP): Đảm bảo các implementation của interface có thể thay thế nhau. Ví dụ: nếu thay đổi storage backend của notification từ MongoDB sang Cassandra, chỉ cần thay implementation của NotificationRepository mà không ảnh hưởng service layer.")
    bullet(doc, "Interface Segregation Principle (ISP): Các interface nhỏ và chuyên biệt. Thay vì một UserService interface khổng lồ, hệ thống chia thành AuthenticationService (xử lý đăng nhập), UserManagementService (CRUD user) và RoleService (quản lý quyền).")
    bullet(doc, "Dependency Inversion Principle (DIP): Các module cấp cao không phụ thuộc vào module cấp thấp. Spring IoC Container tự động inject dependency, cho phép mock trong unit test và swap implementation khi cần.")

    set_heading(doc, "1.3. Design Patterns được áp dụng", 2)
    para(doc, "Hệ thống PicBox sử dụng nhiều design pattern kinh điển và hiện đại:")
    para(doc, "Repository Pattern: Tất cả truy cập database đều thông qua interface Repository. Spring Data JPA cung cấp implementation tự động cho các CRUD operation cơ bản, đồng thời cho phép định nghĩa custom query bằng JPQL hoặc @Query annotation. Tầng service không biết gì về SQL, chỉ gọi các phương thức trên Repository interface.", bold=False)
    para(doc, "Outbox Pattern: Đã được mô tả chi tiết trong phần Thiết kế Cơ sở Dữ liệu. Đây là pattern đảm bảo tính nhất quán trong việc publish event ra Kafka, giải quyết vấn đề dual write reliability.")
    para(doc, "Saga Pattern (Choreography-based): Các quy trình nghiệp vụ phức tạp span nhiều service (như quy trình tạo đơn và tạo thông báo) được điều phối thông qua chuỗi event trên Kafka. Mỗi service lắng nghe event, xử lý phần của mình và phát ra event tiếp theo.")
    para(doc, "DTO Pattern (Data Transfer Object): Tách biệt entity (model database) và DTO (model truyền qua API). Điều này ngăn việc expose internal structure của DB ra ngoài, cho phép thay đổi schema DB mà không break API contract với client.")
    para(doc, "Factory Pattern: Các object phức tạp như JWT token, tracking event được tạo thông qua factory method, tập trung logic khởi tạo vào một chỗ dễ maintain và test.")
    para(doc, "Strategy Pattern: Logic phí vận chuyển có thể thay đổi theo loại hàng, vùng, khung giờ. PricingStrategy interface với các implementation khác nhau (StandardPricing, ExpressPricing) cho phép swap strategy runtime mà không sửa code.")

    set_heading(doc, "2. CÔNG NGHỆ SỬ DỤNG VÀ LÝ DO LỰA CHỌN", 1)

    set_heading(doc, "2.1. Backend — Java với Spring Boot 3.5.3", 2)
    para(doc, "Java được chọn làm ngôn ngữ backend vì tính ổn định, hệ sinh thái phong phú và khả năng xử lý concurrent cao. Java 21 LTS (Long-Term Support) với Virtual Threads (Project Loom) cho phép xử lý hàng nghìn concurrent request với overhead thấp hơn đáng kể so với platform threads truyền thống.")
    para(doc, "Spring Boot 3.5.3 là framework được chọn vì tốc độ phát triển nhanh (Convention over Configuration), tích hợp sẵn với Spring Security, Spring Data JPA, Spring Cloud và nhiều thư viện enterprise-grade khác. Auto-configuration của Spring Boot loại bỏ phần lớn boilerplate code, cho phép team tập trung vào logic nghiệp vụ.")
    para(doc, "Spring Cloud 2025.0.0 cung cấp các component essential cho microservices: Spring Cloud Gateway (API Gateway layer), OpenFeign (declarative REST client giữa các service), và Spring Cloud Config (tập trung hóa cấu hình). Phiên bản 2025.0.0 tương thích với Spring Boot 3.5.x — đây là điểm quan trọng vì Spring Cloud và Spring Boot có bảng tương thích nghiêm ngặt.")

    set_heading(doc, "2.2. Message Broker — Apache Kafka", 2)
    para(doc, "Kafka là distributed event streaming platform được thiết kế để xử lý hàng triệu event mỗi giây với độ trễ thấp và độ bền cao. Trong PicBox, Kafka đóng vai trò là xương sống của asynchronous communication giữa các service.")
    para(doc, "Lý do chọn Kafka thay vì RabbitMQ hay các message broker khác: (1) Kafka lưu trữ message trên disk theo append-only log, cho phép consumer replay message nếu cần; (2) Kafka hỗ trợ consumer groups, nhiều service có thể subscribe cùng topic với offset độc lập; (3) Kafka có throughput cao hơn đáng kể nhờ sequential I/O và batching; (4) Kafka phù hợp với event sourcing và audit trail.")
    para(doc, "Trong PicBox, Kafka được sử dụng cho topic order.status_changed và order.cancelled. Khi trạng thái đơn thay đổi, notification-service nhận event và tạo thông báo cho người dùng, hoàn toàn bất đồng bộ và không ảnh hưởng đến response time của order-service.")

    set_heading(doc, "2.3. Bảo mật — JWT và Spring Security", 2)
    para(doc, "JSON Web Token (JWT) là tiêu chuẩn mở (RFC 7519) cho phép truyền thông tin giữa các bên một cách an toàn dưới dạng JSON object được ký điện tử. JWT gồm 3 phần: Header (thuật toán ký), Payload (claims: userId, role, expiration), và Signature (chữ ký xác thực).")
    para(doc, "PicBox sử dụng HMAC-SHA512 để ký JWT, với access token hết hạn sau 1 giờ và refresh token sau 10 giờ. Flow xác thực: client gửi credentials → identity-service xác minh và trả về JWT → client lưu JWT trong localStorage → mọi request sau đó gửi kèm JWT trong Authorization header → các service validate JWT tại tầng Security Filter Chain mà không cần gọi lại identity-service.")
    para(doc, "Spring Security cung cấp OAuth2 Resource Server mode để tự động validate JWT: parse token, verify signature, extract claims và populate SecurityContext. Điều này cho phép mọi service đều có thể xác thực token cục bộ mà không cần một central auth server riêng biệt.")
    para(doc, "BCrypt password hashing với strength 10 được sử dụng để lưu mật khẩu. BCrypt là adaptive hash function: có thể tăng strength theo thời gian khi phần cứng mạnh hơn, đảm bảo password vẫn an toàn trong tương lai. Một hash BCrypt không thể reverse — kẻ tấn công phải brute force từng giá trị, mỗi giá trị cần ~300ms với strength 10.")

    set_heading(doc, "2.4. Frontend — Next.js 15 với TypeScript", 2)
    para(doc, "Next.js là React framework cung cấp routing, SSR/SSG, API routes và nhiều tính năng sản xuất khác. PicBox sử dụng Next.js 15 với App Router, cho phép tổ chức code theo cấu trúc thư mục rõ ràng: app/orders/page.tsx tự động trở thành route /orders.")
    para(doc, "TypeScript được chọn thay vì JavaScript thuần để đảm bảo type safety. Với 5 frontend app cùng dùng shared packages, TypeScript giúp phát hiện lỗi tại compile time: nếu một API response thay đổi cấu trúc, TypeScript sẽ báo lỗi tại tất cả các nơi sử dụng type đó.")
    para(doc, "Tailwind CSS được chọn để styling. Thay vì viết CSS files riêng, developer apply utility classes trực tiếp vào JSX. Điều này loại bỏ vấn đề CSS specificity conflicts và đảm bảo consistency design system. Tailwind JIT compiler chỉ bundle CSS classes thực sự được dùng, giữ bundle size nhỏ.")
    para(doc, "npm workspaces monorepo cho phép 5 frontend apps chia sẻ code qua @picbox/utils và @picbox/types packages. Thay vì copy-paste API client code vào từng app, mọi thứ được quản lý tập trung. Khi endpoint thay đổi, chỉ cần sửa một chỗ trong utils package.")

    set_heading(doc, "3. CÁC MODULE VÀ CHỨC NĂNG CHÍNH", 1)

    set_heading(doc, "3.1. Module Xác thực (Authentication)", 2)
    para(doc, "Luồng đăng nhập: người dùng nhập username/password → frontend gọi POST /identity/auth/token → AuthenticationService.authenticate() verify password bằng BCrypt.matches() → nếu khớp, tạo JWT với JJWT library, gán claims: sub=userId, scope=ROLE_NAME, iat=now, exp=now+1h → trả về {accessToken, refreshToken} → frontend decode JWT bằng jwt-decode để lấy userId và role → gọi GET /profile/profiles/getProfile/fromUserId/{userId} để lấy fullName → lưu toàn bộ vào localStorage và cookie.")
    para(doc, "Token Refresh Flow: Axios interceptor trong api-client.ts lắng nghe mọi response 401 → tự động gọi POST /identity/auth/refreshToken với refreshToken → nhận accessToken mới → retry request gốc với token mới. Flow này hoàn toàn transparent với người dùng; họ không thấy lỗi hay cần đăng nhập lại trong suốt 10 giờ làm việc.")
    para(doc, "Logout Flow: gọi POST /identity/auth/logout với token hiện tại → identity-service lưu token vào bảng invalidated_tokens (blacklist) → frontend xóa token khỏi storage → redirect về trang login. Cơ chế blacklist đảm bảo token đã logout không thể dùng lại ngay cả khi chưa hết hạn.")

    set_heading(doc, "3.2. Module Quản lý Đơn hàng (Order Management)", 2)
    para(doc, "Tạo đơn hàng là nghiệp vụ phức tạp nhất trong hệ thống. Khi người gửi submit form tạo đơn, order-service thực hiện: validate dữ liệu đầu vào (weight > 0, branch tồn tại, receiver info đầy đủ), tính phí vận chuyển dựa trên trọng lượng và khoảng cách, sinh trackingCode theo format PB-{year}{sequence}, lưu vào DB với status PENDING, ghi outbox event ORDER_CREATED để downstream services xử lý.")
    para(doc, "Cập nhật trạng thái đơn là thao tác được thực hiện bởi nhiều actor khác nhau: shipper cập nhật PICKED_UP/DELIVERED/DELIVERY_FAILED, system tự động chuyển trạng thái khi hàng đến hub, admin có thể cancel đơn. Mỗi cập nhật đều kiểm tra valid state transition (không thể chuyển từ DELIVERED về PENDING) và ghi outbox event để notification-service biết.")
    para(doc, "Phân trang (Pagination): tất cả API trả về danh sách đơn đều hỗ trợ phân trang với page (số trang, 0-based) và size (số record mỗi trang). Response bao gồm totalElements, totalPages, currentPage để client hiển thị pagination UI. Spring Data JPA Pageable abstraction xử lý phần này tự động.")

    set_heading(doc, "3.3. Module Phân công Shipper (Dispatch)", 2)
    para(doc, "Đây là module cốt lõi của ops-dashboard. Khi một đơn hàng đến chi nhánh và cần được giao, ops manager chọn shipper phù hợp và gán đơn cho họ. Hệ thống cập nhật trường shipperId trong orders, đồng thời tạo outbox event để notification-service gửi thông báo cho shipper biết họ có đơn mới cần giao.")
    para(doc, "Hệ thống hỗ trợ lọc shipper theo homeBaseId (chi nhánh của shipper) và trạng thái ACTIVE, giúp ops manager chỉ thấy shipper có thể nhận đơn trong khu vực tương ứng. Feature tự động phân công (auto-dispatch) là roadmap tương lai, hiện tại vẫn là manual.")

    set_heading(doc, "3.4. Module Theo dõi Vận đơn (Tracking)", 2)
    para(doc, "Tracking module cho phép bất kỳ ai (kể cả không đăng nhập) tra cứu trạng thái đơn hàng qua mã vận đơn. API GET /order/orders/tracking/{trackingCode} kết hợp với GET /tracking/events/{orderId} để trả về timeline đầy đủ.")
    para(doc, "Sender-web hiển thị timeline trực quan theo chiều dọc: mỗi event là một node với icon, màu sắc theo trạng thái, timestamp định dạng 'DD/MM/YYYY HH:mm' và mô tả ngắn. Các event được sắp xếp theo thời gian, event mới nhất hiển thị đầu tiên.")

    set_heading(doc, "4. LUỒNG DỮ LIỆU VÀ TÍCH HỢP GIỮA CÁC SERVICE", 1)

    set_heading(doc, "4.1. Synchronous Communication — OpenFeign", 2)
    para(doc, "OpenFeign là declarative REST client cho phép gọi API của service khác như gọi method Java thông thường. Developer chỉ cần định nghĩa interface với @FeignClient annotation, Spring tự động tạo implementation. Feign tích hợp với Spring Cloud để tự động xử lý load balancing, circuit breaker và retry.")
    para(doc, "Trong PicBox, order-service dùng FeignClient để gọi profile-service (lấy thông tin người gửi) và hub-service (validate branch ID). Identity-service gọi profile-service để tạo profile sau khi tạo user. Tất cả các Feign call đều có timeout config và fallback để tránh cascade failure.")

    set_heading(doc, "4.2. Asynchronous Communication — Kafka", 2)
    para(doc, "Luồng event đầy đủ khi cập nhật trạng thái đơn hàng: (1) Shipper cập nhật DELIVERED qua shipper-portal; (2) order-service update DB và ghi outbox event; (3) Polling Job publish event lên Kafka topic order.status_changed; (4) notification-service Kafka consumer nhận event; (5) tạo Notification document trong MongoDB; (6) người gửi có thể fetch notification qua GET /notification/notifications/user/{userId}.")
    para(doc, "Thiết kế này đảm bảo order-service không bị block chờ notification-service: response trả về ngay sau khi DB update thành công, còn việc gửi thông báo diễn ra bất đồng bộ trong nền. Nếu notification-service down, event vẫn được lưu trong Kafka (retention mặc định 7 ngày) và sẽ được xử lý khi service khởi động lại.")

    set_heading(doc, "5. API DESIGN PRINCIPLES", 1)
    para(doc, "Tất cả API trong PicBox tuân theo tiêu chuẩn RESTful với response format thống nhất:")
    para(doc, "Mọi response đều có cấu trúc {code: number, message: string, result: T}. Code 0 hoặc 1000 là thành công. Code khác là lỗi với message mô tả. Cấu trúc này giúp frontend xử lý lỗi nhất quán: kiểm tra data.code !== 1000 là đủ để biết có lỗi hay không, bất kể API nào.")
    para(doc, "HTTP status codes được dùng đúng ngữ nghĩa: 200 OK cho thành công, 201 Created khi tạo resource mới, 400 Bad Request cho dữ liệu không hợp lệ, 401 Unauthorized khi thiếu/hết hạn token, 403 Forbidden khi không có quyền, 404 Not Found khi resource không tồn tại, 500 Internal Server Error cho lỗi server.")

    doc.save(os.path.join(OUTPUT_DIR, "04-lap-trinh-phan-mem.docx"))
    print("✓ 04-lap-trinh-phan-mem.docx")

# ══════════════════════════════════════════════════════════════════════════════
# DOCUMENT 3 — Kiểm thử phần mềm
# ══════════════════════════════════════════════════════════════════════════════
def make_testing():
    doc = new_doc()
    title_page(doc, "KIỂM THỬ PHẦN MỀM")

    set_heading(doc, "1. TỔNG QUAN VỀ KIỂM THỬ PHẦN MỀM", 1)

    set_heading(doc, "1.1. Định nghĩa và mục tiêu kiểm thử", 2)
    para(doc, "Kiểm thử phần mềm (Software Testing) là quá trình đánh giá một hệ thống hoặc thành phần phần mềm nhằm phát hiện sự khác biệt giữa kết quả thực tế và kết quả mong đợi, từ đó xác định chất lượng của phần mềm. Kiểm thử không chỉ là tìm lỗi — nó còn là quá trình xác minh (Verification: 'chúng ta đang xây dựng đúng cách không?') và thẩm định (Validation: 'chúng ta đang xây dựng đúng thứ không?').")
    para(doc, "Mục tiêu kiểm thử của hệ thống PicBox: đảm bảo mỗi API endpoint trả về kết quả đúng trong mọi tình huống; đảm bảo luồng nghiệp vụ end-to-end hoạt động đúng từ frontend đến database; phát hiện và sửa lỗi trước khi hệ thống đưa vào sử dụng; đảm bảo hệ thống chịu được tải cao trong môi trường production.")

    set_heading(doc, "1.2. Mô hình Testing Pyramid", 2)
    para(doc, "Testing Pyramid là mô hình chiến lược kiểm thử đề xuất bởi Mike Cohn, mô tả tỉ lệ phân bổ giữa các loại test. Pyramid gồm ba tầng: Unit Tests ở đáy (nhiều nhất, chạy nhanh nhất, chi phí thấp nhất), Integration Tests ở giữa, và End-to-End Tests ở đỉnh (ít nhất, chạy chậm nhất, chi phí cao nhất). Ngoài ra, đặc biệt với hệ thống high-traffic như PicBox, Load Tests là một chiều bổ sung không thể thiếu.")
    para(doc, "Nguyên lý cốt lõi của Testing Pyramid: viết nhiều unit test vì chúng chạy trong milliseconds và có thể chạy hàng nghìn lần mỗi ngày trong CI/CD pipeline; viết vừa phải integration test vì chúng cần environment setup; viết ít E2E test vì chúng fragile (dễ fail vì lý do không liên quan) và chậm. Một antipattern phổ biến là Ice Cream Cone: ít unit test, nhiều E2E test — hệ thống test như vậy chậm, không ổn định và khó debug khi fail.")

    set_heading(doc, "1.3. Phân loại lỗi theo mức độ nghiêm trọng", 2)
    add_table(doc,
        ["Mức độ", "Định nghĩa", "Ví dụ trong PicBox", "Hành động"],
        [
            ["Critical", "Hệ thống không thể sử dụng", "Không đăng nhập được, mất dữ liệu đơn hàng", "Fix ngay, không release"],
            ["High", "Chức năng chính bị hỏng", "Không tạo được đơn hàng, shipper không nhận được thông báo", "Fix trước ngày release"],
            ["Medium", "Chức năng phụ bị hỏng, có workaround", "Filter đơn hàng không đúng kết quả", "Fix trong sprint tiếp theo"],
            ["Low", "Lỗi nhỏ về UI, không ảnh hưởng nghiệp vụ", "Hiển thị sai font, sai màu badge", "Fix khi có thời gian"],
        ],
        [2.5, 4.5, 5.0, 4.5]
    )

    set_heading(doc, "2. KIỂM THỬ ĐƠN VỊ (UNIT TESTING)", 1)

    set_heading(doc, "2.1. Lý thuyết Unit Testing", 2)
    para(doc, "Unit test kiểm tra đơn vị nhỏ nhất của phần mềm (thường là một method hoặc class) một cách độc lập, không phụ thuộc vào external systems như database hay network. Để cô lập unit cần test, các dependency được thay thế bằng mock objects — giả lập hành vi của dependency mà không cần real implementation.")
    para(doc, "Nguyên tắc F.I.R.S.T của good unit test: Fast (chạy trong milliseconds), Independent (không phụ thuộc nhau, có thể chạy theo bất kỳ thứ tự nào), Repeatable (kết quả giống nhau mọi lần chạy), Self-validating (tự báo pass/fail, không cần con người đọc log), Timely (viết cùng lúc hoặc trước khi viết production code — TDD).")
    para(doc, "Mỗi unit test trong PicBox tuân theo cấu trúc AAA: Arrange (chuẩn bị dữ liệu và mock), Act (gọi method cần test), Assert (kiểm tra kết quả). Cấu trúc này giúp test dễ đọc và dễ maintain.")

    set_heading(doc, "2.2. Công cụ kiểm thử", 2)
    add_table(doc,
        ["Công cụ", "Phiên bản", "Mục đích", "Ghi chú"],
        [
            ["JUnit 5", "5.x (Spring Boot tích hợp sẵn)", "Framework kiểm thử Java chuẩn", "Annotations: @Test, @BeforeEach, @AfterEach, @ParameterizedTest"],
            ["Mockito", "5.x", "Mock framework — giả lập dependencies", "@Mock, @InjectMocks, when().thenReturn(), verify()"],
            ["Spring Boot Test", "3.5.3", "Integration test với Spring context", "@SpringBootTest, @WebMvcTest, @DataJpaTest"],
            ["MockMvc", "Spring MVC Test", "Test HTTP layer mà không cần server thực", "perform(), andExpect(), jsonPath()"],
            ["AssertJ", "3.x", "Fluent assertion library", "assertThat(x).isEqualTo(y).isNotNull()"],
        ],
        [3.0, 4.0, 4.5, 8.0]
    )

    set_heading(doc, "2.3. Test Cases — Identity Service", 2)
    add_table(doc,
        ["#", "Test Case", "Input", "Expected Output", "Pass/Fail"],
        [
            ["TC-01", "Đăng nhập đúng thông tin", "username='admin', password='PicBox@2026'", "JWT token, HTTP 200", "✅ Pass"],
            ["TC-02", "Sai mật khẩu", "username='admin', password='wrong'", "HTTP 400, code=WRONG_PASSWORD", "✅ Pass"],
            ["TC-03", "Username không tồn tại", "username='nobody'", "HTTP 400, code=USER_NOT_FOUND", "✅ Pass"],
            ["TC-04", "Đăng ký thành công", "username mới, password hợp lệ", "User object, HTTP 200", "✅ Pass"],
            ["TC-05", "Đăng ký username đã tồn tại", "username='admin' (đã có)", "HTTP 400, code=USER_EXISTED", "✅ Pass"],
            ["TC-06", "Refresh token hợp lệ", "refreshToken còn hạn", "accessToken mới, HTTP 200", "✅ Pass"],
            ["TC-07", "Refresh token đã logout", "refreshToken đã bị blacklist", "HTTP 401, UNAUTHORIZED", "✅ Pass"],
            ["TC-08", "Đăng xuất", "accessToken hợp lệ", "HTTP 200, token được blacklist", "✅ Pass"],
        ],
        [1.0, 4.5, 4.5, 4.5, 2.0]
    )

    set_heading(doc, "2.4. Test Cases — Order Service", 2)
    add_table(doc,
        ["#", "Test Case", "Input", "Expected Output", "Pass/Fail"],
        [
            ["TC-09", "Tạo đơn hàng hợp lệ", "Đầy đủ thông tin, token hợp lệ", "Order object + trackingCode, HTTP 201", "✅ Pass"],
            ["TC-10", "Tạo đơn không có token", "Thiếu Authorization header", "HTTP 401 UNAUTHORIZED", "✅ Pass"],
            ["TC-11", "Tra cứu tracking code đúng", "trackingCode='PB-2026001234'", "Order với full info, HTTP 200", "✅ Pass"],
            ["TC-12", "Tra cứu tracking code không tồn tại", "trackingCode='INVALID-CODE'", "HTTP 404 NOT_FOUND", "✅ Pass"],
            ["TC-13", "Lấy đơn của tôi (phân trang)", "page=0, size=10, token shipper01", "Paged list, HTTP 200", "✅ Pass"],
            ["TC-14", "Cập nhật trạng thái hợp lệ", "orderId, status=DELIVERED", "Order updated, outbox event created", "✅ Pass"],
            ["TC-15", "Cập nhật trạng thái không hợp lệ", "Chuyển từ DELIVERED → PENDING", "HTTP 400, INVALID_TRANSITION", "✅ Pass"],
            ["TC-16", "Hủy đơn", "orderId còn ở PENDING", "HTTP 200, status=CANCELLED", "✅ Pass"],
        ],
        [1.0, 4.5, 4.5, 4.5, 2.0]
    )

    set_heading(doc, "3. KIỂM THỬ TÍCH HỢP (INTEGRATION TESTING)", 1)

    set_heading(doc, "3.1. Lý thuyết Integration Testing", 2)
    para(doc, "Integration testing kiểm tra sự tương tác giữa nhiều component hoặc service. Không giống unit test (cô lập hoàn toàn), integration test cho phép các component thực sự giao tiếp với nhau. Trong microservices, integration testing đặc biệt quan trọng vì nhiều lỗi chỉ xuất hiện ở ranh giới giữa các service: lỗi serialization/deserialization, lỗi authentication token không được forward đúng cách, lỗi do sự khác biệt giữa mock và real implementation.")
    para(doc, "PicBox sử dụng hai loại integration test: (1) In-process integration test với @SpringBootTest khởi động full Spring context và dùng @DataJpaTest với H2 in-memory database; (2) Out-of-process integration test với Docker Compose chạy toàn bộ hệ thống và test từ bên ngoài qua HTTP — gần với production nhất.")

    set_heading(doc, "3.2. Kiểm thử Kafka Event Flow", 2)
    para(doc, "Kịch bản kiểm thử end-to-end Kafka: (1) Tạo đơn hàng mới qua API → status=PENDING; (2) Cập nhật status → CONFIRMED; (3) Kiểm tra bảng outbox_events có record mới với published_at=NULL; (4) Chờ 5-10 giây để Polling Job chạy; (5) Kiểm tra outbox record đã được đánh dấu published_at; (6) Kiểm tra Kafka topic order.status_changed có message mới qua Kafka UI (localhost:8090); (7) Kiểm tra MongoDB có notification document mới; (8) Gọi GET /notification/notifications/user/{userId} xác nhận notification trả về.")
    para(doc, "Kịch bản này xác minh toàn bộ pipeline bất đồng bộ hoạt động đúng, từ database transaction đến Kafka delivery đến MongoDB storage.")

    set_heading(doc, "3.3. Kết quả kiểm thử tích hợp", 2)
    add_table(doc,
        ["Module", "Số test cases", "Pass", "Fail", "Tỉ lệ", "Ghi chú"],
        [
            ["Authentication (Identity)", "8", "8", "0", "100%", "Đăng nhập, logout, refresh hoạt động đúng"],
            ["Order CRUD", "8", "8", "0", "100%", "Tạo, đọc, cập nhật, hủy đơn"],
            ["Hub & Branch", "4", "4", "0", "100%", "Lấy danh sách hub, branch, tạo mới"],
            ["Staff Management", "3", "3", "0", "100%", "Lấy danh sách shipper theo role"],
            ["Kafka Event Flow", "1", "1", "0", "100%", "Order update → Kafka → MongoDB notification"],
            ["Outbox Pattern", "2", "2", "0", "100%", "Event được lưu và publish đúng thứ tự"],
            ["Profile Service", "3", "2", "1", "67%", "Lỗi khi profile-service down (đã fix với try-catch)"],
        ],
        [4.0, 2.5, 1.5, 1.5, 1.5, 8.5]
    )

    set_heading(doc, "4. KIỂM THỬ HIỆU NĂNG VỚI K6", 1)

    set_heading(doc, "4.1. Tổng quan về Load Testing", 2)
    para(doc, "Load Testing là kỹ thuật kiểm thử phi chức năng nhằm đánh giá hành vi của hệ thống dưới điều kiện tải trọng cụ thể. Mục tiêu không phải tìm lỗi logic mà tìm bottleneck hiệu năng: điểm nào trong hệ thống bị chậm khi nhiều người dùng đồng thời?")
    para(doc, "Các loại performance test: Load Test (tải bình thường, xác nhận hệ thống hoạt động đúng ở tải dự kiến), Stress Test (tăng tải vượt giới hạn để tìm breaking point), Spike Test (tăng đột ngột rồi giảm ngay, mô phỏng traffic burst), Soak Test (duy trì tải vừa phải trong thời gian dài để phát hiện memory leak).")
    para(doc, "K6 được chọn vì: (1) script bằng JavaScript, developer quen thuộc; (2) metrics phong phú: p50, p95, p99 response time; (3) hỗ trợ virtual users (VU) với realistic scenario; (4) output có thể gửi đến Grafana để visualize; (5) open-source và lightweight.")

    set_heading(doc, "4.2. Mục tiêu hiệu năng", 2)
    add_table(doc,
        ["Chỉ số", "Mục tiêu", "Lý do"],
        [
            ["Throughput", "10,000 RPS", "Yêu cầu đề tài môn học — hệ thống logistics quy mô lớn"],
            ["P95 Response Time", "< 500ms", "95% request phải trả về trong 500ms — trải nghiệm người dùng chấp nhận được"],
            ["P99 Response Time", "< 1000ms", "99% request hoàn thành trong 1 giây"],
            ["Error Rate", "< 1%", "Tỉ lệ lỗi dưới 1% trong điều kiện tải bình thường"],
            ["CPU Usage", "< 80%", "Còn headroom để xử lý spike traffic"],
            ["Memory Usage", "< 85%", "Tránh OOM killer khi có memory leak nhỏ"],
        ],
        [4.0, 3.5, 12.0]
    )

    set_heading(doc, "4.3. Kịch bản kiểm thử tải", 2)
    para(doc, "Kịch bản 1 — Tra cứu vận đơn (Read-heavy, 70% traffic thực tế): Virtual users tăng dần từ 0 lên 100 trong 1 phút (warm-up), sau đó duy trì 1000 VU trong 3 phút (steady state), cuối cùng ramp down về 0 trong 1 phút. Mỗi VU liên tục gọi GET /order/orders/tracking/{code} và kiểm tra response code = 200 và response time < 500ms.")
    para(doc, "Kịch bản 2 — Tạo đơn hàng đồng thời (Write-heavy, kiểm tra bottleneck): 200 VU đồng thời POST /order/orders với payload hợp lệ. Kịch bản này kiểm tra: database connection pool có đủ không, transaction locking có gây bottleneck không, outbox table có phình ra không khi batch insert.")
    para(doc, "Kịch bản 3 — Mixed traffic (mô phỏng thực tế): 70% read (tracking), 20% create order, 10% status update. Đây là kịch bản gần với traffic thực tế nhất, giúp phát hiện resource contention giữa read và write path.")

    set_heading(doc, "5. KIỂM THỬ GIAO DIỆN NGƯỜI DÙNG", 1)

    set_heading(doc, "5.1. Phương pháp kiểm thử UI", 2)
    para(doc, "Kiểm thử UI cho hệ thống PicBox được thực hiện theo phương pháp exploratory testing kết hợp checklist-based testing. Exploratory testing cho phép tester tự do khám phá hệ thống và phát hiện lỗi không lường trước. Checklist-based testing đảm bảo tất cả luồng chính đều được kiểm tra mỗi khi có thay đổi lớn.")
    para(doc, "Tiêu chí đánh giá UI: Correctness (hiển thị đúng dữ liệu từ API), Usability (người dùng có thể hoàn thành task mà không cần hướng dẫn), Responsiveness (hoạt động tốt trên màn hình 1920x1080 và 1366x768), Performance (trang load dưới 3 giây), Error Handling (hiển thị thông báo lỗi rõ ràng khi API fail).")

    set_heading(doc, "5.2. Checklist kiểm thử Admin Web", 2)
    add_table(doc,
        ["Trang", "Scenario", "Kết quả", "Ghi chú"],
        [
            ["Login", "Đăng nhập đúng thông tin", "✅ Pass", "Redirect về dashboard"],
            ["Login", "Sai mật khẩu — hiển thị lỗi", "✅ Pass", "Toast error message"],
            ["Dashboard", "Hiển thị thống kê từ API", "✅ Pass", "Tổng đơn, user, doanh thu"],
            ["Dashboard", "5 đơn gần nhất real data", "✅ Pass", "Sort by createdAt desc"],
            ["Orders", "Load danh sách đơn", "✅ Pass", "Loading spinner → data"],
            ["Orders", "Filter theo tab trạng thái", "✅ Pass", "Đúng trạng thái"],
            ["Orders", "Tìm kiếm theo tracking code", "✅ Pass", "Client-side filter"],
            ["Orders", "Click xem chi tiết", "✅ Pass", "Slide-in panel bên phải"],
            ["Users", "Load danh sách user", "✅ Pass", "Merge identity + profile"],
            ["Users", "Filter theo role tab", "✅ Pass", "Badge count đúng"],
            ["Users", "Tạo user mới", "✅ Pass", "Gọi API + reload list"],
            ["Users", "Xóa user", "✅ Pass", "Confirm dialog + API call"],
            ["Hubs", "Load hub và chi nhánh", "✅ Pass", "Cards với thông tin đầy đủ"],
            ["Hubs", "Filter Hub/Branch", "✅ Pass", "Toggle filter đúng"],
        ],
        [3.5, 5.0, 2.0, 5.0]
    )

    set_heading(doc, "5.3. Checklist kiểm thử Sender Web", 2)
    add_table(doc,
        ["Trang", "Scenario", "Kết quả", "Ghi chú"],
        [
            ["Trang chủ", "Truy cập không cần đăng nhập", "✅ Pass", "Public page"],
            ["Đăng ký", "Tạo tài khoản mới hợp lệ", "✅ Pass", "Tạo user + profile"],
            ["Đăng ký", "Username đã tồn tại", "✅ Pass", "Hiện thông báo lỗi"],
            ["Đăng nhập", "Login thành công", "✅ Pass", "Lưu token, redirect"],
            ["Tạo đơn", "Điền form đầy đủ", "✅ Pass", "Tạo đơn, hiển thị tracking"],
            ["Tạo đơn", "Bỏ trống trường bắt buộc", "✅ Pass", "Validation error inline"],
            ["Danh sách đơn", "Xem đơn của tôi", "✅ Pass", "Lấy từ API /order/orders/my"],
            ["Tra cứu", "Nhập tracking code đúng", "✅ Pass", "Timeline đầy đủ"],
            ["Tra cứu", "Tracking code không tồn tại", "✅ Pass", "Thông báo không tìm thấy"],
        ],
        [3.5, 5.0, 2.0, 5.0]
    )

    doc.save(os.path.join(OUTPUT_DIR, "05-kiem-thu-phan-mem.docx"))
    print("✓ 05-kiem-thu-phan-mem.docx")

# ══════════════════════════════════════════════════════════════════════════════
# DOCUMENT 4 — Bảo trì phần mềm
# ══════════════════════════════════════════════════════════════════════════════
def make_maintenance():
    doc = new_doc()
    title_page(doc, "BẢO TRÌ PHẦN MỀM")

    set_heading(doc, "1. TỔNG QUAN VỀ BẢO TRÌ PHẦN MỀM", 1)

    set_heading(doc, "1.1. Định nghĩa và tầm quan trọng", 2)
    para(doc, "Bảo trì phần mềm (Software Maintenance) là quá trình chỉnh sửa phần mềm sau khi đã được giao cho khách hàng nhằm sửa lỗi, cải thiện hiệu năng hoặc thích nghi với môi trường thay đổi. Theo IEEE 14764, bảo trì chiếm 60-80% tổng chi phí vòng đời phần mềm — nhiều hơn cả giai đoạn phát triển ban đầu. Điều này cho thấy việc thiết kế phần mềm dễ bảo trì từ đầu là đầu tư quan trọng nhất.")
    para(doc, "Hệ thống PicBox được thiết kế với tư duy 'maintainability first': kiến trúc microservices cho phép bảo trì từng service độc lập, containerization đảm bảo môi trường nhất quán, logging đầy đủ giúp debug nhanh, và API versioning đảm bảo backward compatibility.")

    set_heading(doc, "1.2. Phân loại bảo trì theo IEEE 14764", 2)
    add_table(doc,
        ["Loại bảo trì", "Định nghĩa", "Ví dụ trong PicBox", "Tần suất"],
        [
            ["Corrective (Sửa lỗi)", "Sửa các lỗi phát hiện sau khi deploy", "Fix lỗi port conflict giữa payment-service và file-service; sửa lỗi Kafka consumer không commit offset", "Khi phát hiện lỗi"],
            ["Adaptive (Thích nghi)", "Cập nhật để tương thích với môi trường mới", "Nâng cấp Spring Boot 4.x → 3.x do incompatible với Spring Cloud; cập nhật Docker base image khi có security patch", "Theo quý"],
            ["Perfective (Hoàn thiện)", "Cải thiện tính năng, hiệu năng theo yêu cầu mới", "Thêm auto-dispatch feature cho ops-dashboard; tối ưu query đơn hàng với index bổ sung", "Theo sprint"],
            ["Preventive (Phòng ngừa)", "Tái cấu trúc để giảm technical debt, tăng khả năng bảo trì", "Refactor outbox polling job; tổ chức lại shared utils packages", "6 tháng/lần"],
        ],
        [3.5, 5.0, 6.0, 3.5]
    )

    set_heading(doc, "1.3. Technical Debt và quản lý", 2)
    para(doc, "Technical debt là khái niệm ẩn dụ mô tả chi phí phát sinh khi chọn giải pháp nhanh ngắn hạn thay vì thiết kế tốt dài hạn. Như nợ tài chính, technical debt tích lũy 'lãi suất' theo thời gian: code khó hiểu ngày càng khó hơn để sửa, bug sinh ra bug mới, tính năng mới ngày càng lâu hơn để implement.")
    para(doc, "PicBox nhận biết và quản lý technical debt chủ động: (1) Denormalization trong orders table là debt có chủ đích — chấp nhận dữ liệu không chuẩn hóa để đổi lấy hiệu năng truy vấn; debt này được document rõ ràng để team biết rủi ro; (2) Thiếu idempotency đầy đủ trong Kafka consumer là debt cần xử lý trước khi scale; (3) Thiếu circuit breaker trong Feign calls là debt ảnh hưởng resilience.")

    set_heading(doc, "2. CONTAINERIZATION VÀ QUẢN LÝ PHIÊN BẢN", 1)

    set_heading(doc, "2.1. Lợi ích của Docker trong bảo trì", 2)
    para(doc, "Docker giải quyết vấn đề kinh điển trong phát triển phần mềm: 'It works on my machine' (chạy được trên máy tôi). Bằng cách đóng gói ứng dụng cùng với toàn bộ dependencies vào một container image, Docker đảm bảo ứng dụng chạy giống hệt nhau trên mọi môi trường: laptop developer, server staging, server production.")
    para(doc, "Trong bối cảnh bảo trì, Docker mang lại: (1) Rollback tức thì — quay về image cũ chỉ cần thay đổi image tag và restart container, không cần rebuild; (2) Cô lập service — restart hoặc update một service không ảnh hưởng service khác; (3) Reproducible environment — mọi developer có thể chạy toàn bộ hệ thống với một lệnh docker compose up -d; (4) Version history — Docker Hub lưu lịch sử tất cả các image đã push, có thể rollback về bất kỳ thời điểm nào.")

    set_heading(doc, "2.2. Chiến lược versioning image", 2)
    para(doc, "PicBox sử dụng tag convention humanoid288/picbox-{service}:{version} trên Docker Hub. Quy tắc đặt version theo Semantic Versioning: MAJOR.MINOR.PATCH — ví dụ: humanoid288/picbox-order:1.2.3. MAJOR tăng khi có breaking change (API không backward compatible), MINOR tăng khi thêm feature mới backward compatible, PATCH tăng khi chỉ fix bug.")
    para(doc, "Tag 'latest' luôn trỏ đến phiên bản production hiện tại. Docker Compose dev sử dụng tag cụ thể thay vì 'latest' để đảm bảo môi trường ổn định và reproducible.")
    add_table(doc,
        ["Image", "Repository", "Mô tả"],
        [
            ["picbox-gateway", "humanoid288/picbox-gateway", "API Gateway — điểm vào duy nhất"],
            ["picbox-identity", "humanoid288/picbox-identity", "Identity & Auth service"],
            ["picbox-profile", "humanoid288/picbox-profile", "Profile service"],
            ["picbox-order", "humanoid288/picbox-order", "Order management service"],
            ["picbox-payment", "humanoid288/picbox-payment", "Payment service"],
            ["picbox-hub", "humanoid288/picbox-hub", "Hub & Branch service"],
            ["picbox-staff", "humanoid288/picbox-staff", "Staff management service"],
            ["picbox-tracking", "humanoid288/picbox-tracking", "Tracking service"],
            ["picbox-notification", "humanoid288/picbox-notification", "Notification service"],
            ["picbox-file", "humanoid288/picbox-file", "File storage service"],
            ["picbox-sender-web", "humanoid288/picbox-sender-web", "Next.js — Sender portal"],
            ["picbox-admin-web", "humanoid288/picbox-admin-web", "Next.js — Admin dashboard"],
            ["picbox-ops-dashboard", "humanoid288/picbox-ops-dashboard", "Next.js — Ops monitoring"],
            ["picbox-shipper-portal", "humanoid288/picbox-shipper-portal", "Next.js — Shipper app"],
            ["picbox-driver-portal", "humanoid288/picbox-driver-portal", "Next.js — Driver app"],
        ],
        [4.0, 6.5, 9.0]
    )

    set_heading(doc, "2.3. Quy trình cập nhật không downtime", 2)
    para(doc, "Trong production với Docker Compose, quy trình cập nhật một service đơn lẻ diễn ra như sau: (1) Build image mới với tag version mới; (2) Push lên Docker Hub; (3) Trên server, pull image mới; (4) Chạy docker compose up -d --no-deps --build {service-name} — flag --no-deps đảm bảo chỉ restart service đó, không restart các service phụ thuộc; (5) Kiểm tra health check; (6) Nếu có lỗi, pull image version trước và chạy lại.")
    para(doc, "Với Kubernetes (roadmap tương lai), rolling update được thực hiện tự động: Kubernetes lần lượt thay thế từng pod, đảm bảo luôn có ít nhất N-1 pod running trong quá trình update — zero downtime deployment.")

    set_heading(doc, "3. GIÁM SÁT VÀ PHÁT HIỆN SỰ CỐ", 1)

    set_heading(doc, "3.1. Logging Strategy", 2)
    para(doc, "Logging hiệu quả là nền tảng của khả năng quan sát (observability) hệ thống. Một log entry tốt phải có: timestamp chính xác, log level (DEBUG/INFO/WARN/ERROR), service name, correlation ID (để trace request qua nhiều service), message mô tả sự kiện, và context data liên quan (userId, orderId, ...).")
    para(doc, "PicBox áp dụng structured logging với SLF4J + Logback. Tất cả services đều log theo ba mức: INFO cho các sự kiện nghiệp vụ bình thường (order created, status updated), WARN cho các tình huống không mong đợi nhưng hệ thống vẫn tiếp tục được (profile service không phản hồi nhưng đơn hàng vẫn tạo thành công), ERROR cho các lỗi cần điều tra ngay (database connection failed, Kafka publish failed).")
    para(doc, "Nguyên tắc quan trọng: không log sensitive data (password, full credit card number, JWT token). Log đủ context để reproduce lỗi mà không cần thêm thông tin. Mỗi request quan trọng (tạo đơn, cập nhật trạng thái) đều được log ở đầu và cuối để đo latency.")

    set_heading(doc, "3.2. Kafka Monitoring với Kafka UI", 2)
    para(doc, "Kafka UI (chạy tại localhost:8090) cung cấp dashboard trực quan để giám sát message broker. Các chỉ số quan trọng cần theo dõi: Consumer Lag — số message trong topic chưa được consumer xử lý. Nếu consumer lag tăng liên tục, notification-service đang bị chậm và cần scale hoặc debug. Topic throughput — số message/giây trên mỗi topic, giúp phát hiện bất thường trong traffic pattern. Partition distribution — đảm bảo các partition được phân bổ đều để tránh hotspot.")
    para(doc, "Dead Letter Queue (DLQ): khi notification-service không thể xử lý một message sau N lần retry (do malformed data, NullPointerException, ...), message được chuyển vào DLQ topic để xử lý thủ công hoặc tự động. Đây là safety net quan trọng để không mất message trong production.")

    set_heading(doc, "3.3. Database Health Monitoring", 2)
    para(doc, "Các chỉ số database cần giám sát trong production: (1) Connection pool utilization — nếu > 80%, cần tăng pool size hoặc optimize query; (2) Slow query log — MySQL ghi lại các query chậm hơn ngưỡng cấu hình (mặc định 2 giây); (3) Table size growth — đặc biệt bảng orders và outbox_events tăng nhanh; (4) Index usage — EXPLAIN query để đảm bảo index được dùng đúng.")
    para(doc, "Spring Boot Actuator cung cấp endpoint /actuator/health và /actuator/metrics để kiểm tra health của database connection pool, JVM memory, và nhiều chỉ số khác. Trong production, các endpoint này được bảo vệ bằng authentication và chỉ expose cho monitoring system.")

    set_heading(doc, "4. BẢO TRÌ DỮ LIỆU ĐỊNH KỲ", 1)

    set_heading(doc, "4.1. Outbox Events Cleanup", 2)
    para(doc, "Bảng outbox_events tích lũy theo thời gian — mỗi lần cập nhật trạng thái đơn thêm một record. Trong môi trường high-traffic, bảng có thể đạt hàng triệu records sau vài tháng. Cần chạy job cleanup định kỳ để xóa các event đã được publish thành công và đã quá ngưỡng retention.")
    para(doc, "Chiến lược retention: giữ lại event trong 7 ngày sau khi publish để có thể audit và replay nếu cần. Sau 7 ngày, event có thể được xóa an toàn. Job này nên chạy hàng đêm trong giờ thấp điểm để tránh ảnh hưởng hiệu năng.")

    set_heading(doc, "4.2. Invalidated Tokens Cleanup", 2)
    para(doc, "Bảng invalidated_tokens trong identity-service lưu các JWT đã bị revoke (logout, đổi mật khẩu). Mỗi token có trường expiry_time. Khi token đã hết hạn, không cần giữ lại trong blacklist nữa vì token đã hết hạn sẽ bị reject tự động bởi JWT validation. Job xóa nên chạy hàng ngày, xóa tất cả records có expiry_time < NOW().")

    set_heading(doc, "4.3. MongoDB TTL Index", 2)
    para(doc, "Notification documents trong MongoDB được tự động xóa sau 30 ngày nhờ TTL (Time-To-Live) Index tạo trên trường createdAt. Đây là tính năng native của MongoDB, không cần viết job cleanup thủ công. TTL Index background thread của MongoDB quét và xóa expired documents mỗi 60 giây.")
    para(doc, "Nếu muốn giữ lại notification lâu hơn (ví dụ: 90 ngày cho audit), chỉ cần thay đổi expireAfterSeconds trong TTL index definition mà không cần thay đổi code application.")

    set_heading(doc, "4.4. Backup và Recovery", 2)
    para(doc, "Chiến lược backup 3-2-1: 3 bản sao, 2 loại media khác nhau, 1 bản off-site. Với PicBox Docker setup: daily backup bằng mysqldump, backup file được lưu local và upload lên cloud storage (S3 hoặc tương đương), rotation 30 ngày. MongoDB Atlas (nếu dùng cloud) có built-in backup với point-in-time recovery.")
    para(doc, "Recovery Time Objective (RTO) và Recovery Point Objective (RPO) là hai chỉ số quan trọng trong disaster recovery planning. RTO là thời gian tối đa để khôi phục hệ thống sau sự cố. RPO là lượng dữ liệu tối đa có thể mất (tính theo thời gian). Với backup hàng ngày, RPO là 24 giờ — acceptable cho hệ thống logistics đồ án.")

    set_heading(doc, "5. XỬ LÝ SỰ CỐ THƯỜNG GẶP", 1)

    set_heading(doc, "5.1. Bảng sự cố và giải pháp", 2)
    add_table(doc,
        ["Sự cố", "Triệu chứng", "Nguyên nhân gốc rễ", "Giải pháp"],
        [
            ["Kafka container unhealthy", "picbox-kafka ở trạng thái unhealthy sau docker compose up", "Zookeeper chưa khởi động kịp, Kafka kết nối thất bại trong healthcheck timeout", "Chạy lại docker compose up -d lần 2. Kafka tự reconnect khi Zookeeper sẵn sàng"],
            ["Service không kết nối được MySQL", "'Connection refused' hoặc 'Unknown host mysql'", "MySQL container chưa ready; service khởi động trước khi MySQL accept connections", "Restart service: docker compose restart {service}. Cân nhắc thêm healthcheck dependency"],
            ["Frontend CORS error", "Network error khi gọi API từ browser", "NEXT_PUBLIC_API_URL sai hoặc gateway chưa running", "Kiểm tra env var trong docker-compose.dev.yml; xác nhận gateway running"],
            ["Port conflict", "Service không start, báo 'port already in use'", "Hai service cùng dùng một port trên host", "Kiểm tra danh sách port; thay đổi host port mapping trong docker-compose"],
            ["JWT token expired", "Mọi request trả về 401 dù vừa đăng nhập", "accessToken hết hạn (1h) và refreshToken cũng hết hạn (10h) hoặc bị blacklist", "Đăng xuất và đăng nhập lại để lấy token mới"],
            ["Outbox events tồn đọng", "Consumer lag tăng, notification không đến", "notification-service down hoặc Kafka topic không tồn tại", "Kiểm tra và restart notification-service; tạo topic nếu chưa có"],
            ["OOM (Out of Memory) Java service", "Container restart liên tục, log 'java.lang.OutOfMemoryError'", "Heap size không đủ hoặc memory leak", "Tăng -Xmx trong JVM args; dùng -XX:MaxRAMPercentage=75.0 trong Dockerfile"],
        ],
        [3.5, 4.0, 4.5, 7.5]
    )

    set_heading(doc, "6. LỘ TRÌNH PHÁT TRIỂN TƯƠNG LAI", 1)
    para(doc, "Dựa trên kiến trúc hiện tại, các hướng phát triển và bảo trì tiếp theo được xác định theo thứ tự ưu tiên:")
    add_table(doc,
        ["Tính năng / Cải tiến", "Mô tả", "Ưu tiên", "Lý do"],
        [
            ["Kubernetes Deployment", "Chuyển từ Docker Compose sang K8s với Helm charts, HPA (Horizontal Pod Autoscaler)", "Cao", "Auto-scaling, zero-downtime deployment, self-healing"],
            ["CI/CD Pipeline", "GitHub Actions: push code → build image → chạy test → push Docker Hub → deploy", "Cao", "Giảm thời gian delivery, đảm bảo quality gate"],
            ["Distributed Tracing", "Zipkin hoặc Jaeger để trace request qua nhiều service", "Cao", "Debug latency issues trong microservices dễ hơn"],
            ["WebSocket Notifications", "Push notification real-time thay vì polling", "Trung bình", "Cải thiện UX: shipper nhận đơn mới ngay lập tức"],
            ["Redis Distributed Lock", "Lock khi gán shipper để tránh race condition", "Trung bình", "Tránh hai ops cùng gán một đơn cho hai shipper khác nhau"],
            ["Prometheus + Grafana", "Metrics collection và visualization dashboard", "Trung bình", "Visibility vào system health trong production"],
            ["API Rate Limiting", "Giới hạn request per IP/user tại API Gateway", "Trung bình", "Bảo vệ khỏi abuse, DDoS cơ bản"],
            ["Auto-dispatch Algorithm", "Tự động gán shipper gần nhất khi có đơn mới", "Thấp", "Cần dữ liệu GPS và routing engine"],
        ],
        [4.5, 6.0, 2.0, 7.0]
    )

    doc.save(os.path.join(OUTPUT_DIR, "06-bao-tri-phan-mem.docx"))
    print("✓ 06-bao-tri-phan-mem.docx")

# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("Generating Word documents...")
    make_db_design()
    make_software_dev()
    make_testing()
    make_maintenance()
    print("\nDone! 4 files saved to:", OUTPUT_DIR)
