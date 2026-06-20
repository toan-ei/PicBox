# PicBox Seed Data - 10 senders + 40 orders
$BASE = "http://localhost:8080"
$ErrorActionPreference = "SilentlyContinue"

function Post($url, $body, $token) {
    $headers = @{ "Content-Type" = "application/json" }
    if ($token) { $headers["Authorization"] = "Bearer $token" }
    try {
        return Invoke-RestMethod -Method POST -Uri "$BASE$url" -Headers $headers -Body ($body | ConvertTo-Json -Depth 5)
    } catch {
        try {
            $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
            return $reader.ReadToEnd() | ConvertFrom-Json
        } catch { return $null }
    }
}

function Put($url, $body, $token) {
    $headers = @{ "Content-Type" = "application/json"; "Authorization" = "Bearer $token" }
    try { Invoke-RestMethod -Method PUT -Uri "$BASE$url" -Headers $headers -Body ($body | ConvertTo-Json -Depth 5) | Out-Null } catch { }
}

$branches = @(
    @{ id = "HCM_01"; name = "Chi nhanh TP.HCM - Quan 1" },
    @{ id = "HAN_01"; name = "Chi nhanh Ha Noi - Hoan Kiem" },
    @{ id = "DN_01";  name = "Chi nhanh Da Nang" },
    @{ id = "CT_01";  name = "Chi nhanh Can Tho" },
    @{ id = "HP_01";  name = "Chi nhanh Hai Phong" }
)

$receivers = @(
    @{ name = "Nguyen Thi Mai";   phone = "0901111001"; address = "45 Le Loi, Quan 1, TP.HCM" },
    @{ name = "Tran Van Hung";    phone = "0902222002"; address = "12 Hoang Dieu, Ba Dinh, Ha Noi" },
    @{ name = "Le Thi Hoa";       phone = "0903333003"; address = "78 Nguyen Van Linh, Da Nang" },
    @{ name = "Pham Quoc Bao";    phone = "0904444004"; address = "33 Tran Phu, Can Tho" },
    @{ name = "Hoang Minh Tuan";  phone = "0905555005"; address = "56 Lach Tray, Hai Phong" },
    @{ name = "Vo Thi Lan";       phone = "0906666006"; address = "90 Hai Ba Trung, Quan 3, TP.HCM" },
    @{ name = "Dang Van Tai";     phone = "0907777007"; address = "23 Dinh Tien Hoang, Ha Noi" },
    @{ name = "Bui Thi Ngoc";     phone = "0908888008"; address = "15 Phan Chau Trinh, Da Nang" },
    @{ name = "Dinh Xuan Khoa";   phone = "0909999009"; address = "67 Mau Than, Can Tho" },
    @{ name = "Ngo Thi Bich";     phone = "0910000010"; address = "102 To Hieu, Hai Phong" },
    @{ name = "Ly Van Duc";       phone = "0911111011"; address = "8 Dong Khoi, Quan 1, TP.HCM" },
    @{ name = "Mai Thi Huong";    phone = "0912222012"; address = "44 Ba Trieu, Ha Noi" },
    @{ name = "Tong Minh Nhat";   phone = "0913333013"; address = "37 Nguyen Chi Thanh, Da Nang" },
    @{ name = "Duong Van Phu";    phone = "0914444014"; address = "19 Ly Tu Trong, Can Tho" },
    @{ name = "Chu Thi Thao";     phone = "0915555015"; address = "81 Dien Bien Phu, Hai Phong" }
)

$products = @(
    @{ note = "Quan ao thoi trang";     weight = 0.5; fee = 35000; cod = 0 },
    @{ note = "Dien thoai Samsung";     weight = 0.3; fee = 45000; cod = 2500000 },
    @{ note = "Giay sneaker Nike";      weight = 1.2; fee = 55000; cod = 1200000 },
    @{ note = "My pham Han Quoc";       weight = 0.4; fee = 38000; cod = 850000 },
    @{ note = "Sach giao trinh";        weight = 1.5; fee = 30000; cod = 0 },
    @{ note = "Laptop Dell XPS";        weight = 2.5; fee = 85000; cod = 28000000 },
    @{ note = "Tai nghe Sony";          weight = 0.4; fee = 42000; cod = 1800000 },
    @{ note = "Dong ho Casio";          weight = 0.3; fee = 40000; cod = 950000 },
    @{ note = "May pha ca phe";         weight = 3.5; fee = 95000; cod = 0 },
    @{ note = "Balo du lich";           weight = 1.0; fee = 48000; cod = 0 },
    @{ note = "Do choi tre em";         weight = 0.8; fee = 36000; cod = 320000 },
    @{ note = "Nuoc hoa Chanel";        weight = 0.3; fee = 45000; cod = 3200000 },
    @{ note = "Kinh mat thoi trang";    weight = 0.2; fee = 32000; cod = 450000 },
    @{ note = "Thuc pham chuc nang";    weight = 0.6; fee = 38000; cod = 0 },
    @{ note = "Phu kien dien thoai";    weight = 0.2; fee = 28000; cod = 150000 }
)

$senders = @(
    @{ username = "sender01@picbox.vn"; fullName = "Nguyen Van An";    phone = "0931000001" },
    @{ username = "sender02@picbox.vn"; fullName = "Tran Thi Binh";    phone = "0931000002" },
    @{ username = "sender03@picbox.vn"; fullName = "Le Quoc Cuong";    phone = "0931000003" },
    @{ username = "sender04@picbox.vn"; fullName = "Pham Thi Dung";    phone = "0931000004" },
    @{ username = "sender05@picbox.vn"; fullName = "Hoang Van Em";     phone = "0931000005" },
    @{ username = "sender06@picbox.vn"; fullName = "Vo Thi Phuong";    phone = "0931000006" },
    @{ username = "sender07@picbox.vn"; fullName = "Dang Minh Quan";   phone = "0931000007" },
    @{ username = "sender08@picbox.vn"; fullName = "Bui Thi Hang";     phone = "0931000008" },
    @{ username = "sender09@picbox.vn"; fullName = "Dinh Van Khai";    phone = "0931000009" },
    @{ username = "sender10@picbox.vn"; fullName = "Ngo Thi Lan";      phone = "0931000010" }
)

# ─── 1. Tao tai khoan ───────────────────────────────────────
Write-Host ""
Write-Host "[1/3] Tao 10 tai khoan sender..." -ForegroundColor Cyan

$createdSenders = @()
foreach ($s in $senders) {
    $res = Post "/identity/users/createUser" @{ username = $s.username; password = "Sender@123"; gender = "" }
    if ($res.result.id) {
        Post "/profile/profiles/Internal/createProfile" @{
            userId   = $res.result.id
            fullName = $s.fullName
            phone    = $s.phone
            email    = $s.username
        } | Out-Null
        Write-Host "  + $($s.fullName)" -ForegroundColor Green
    } else {
        Write-Host "  ~ $($s.username) da ton tai, bo qua" -ForegroundColor Yellow
    }
    $createdSenders += $s
}

# ─── 2. Tao don hang ────────────────────────────────────────
Write-Host ""
Write-Host "[2/3] Tao 40 don hang (4 don/sender)..." -ForegroundColor Cyan

$allOrderIds = @()
$idx = 0

foreach ($s in $createdSenders) {
    $login = Post "/identity/auth/token" @{ username = $s.username; password = "Sender@123" }
    $tok   = $login.result.token
    if (-not $tok) { Write-Host "  ! Login that bai: $($s.username)" -ForegroundColor Red; continue }

    for ($i = 0; $i -lt 4; $i++) {
        $prod   = $products[$idx % $products.Count]
        $recv   = $receivers[$idx % $receivers.Count]
        $origin = $branches[$idx % $branches.Count]
        $dest   = $branches[($idx + 2) % $branches.Count]

        $res = Post "/order/orders" @{
            senderName       = $s.fullName
            senderPhone      = $s.phone
            receiverName     = $recv.name
            receiverPhone    = $recv.phone
            receiverAddress  = $recv.address
            originBranchId   = $origin.id
            originBranchName = $origin.name
            destBranchId     = $dest.id
            destBranchName   = $dest.name
            weight           = $prod.weight
            fee              = $prod.fee
            codAmount        = $prod.cod
            pickupMethod     = "PICKUP_AT_BRANCH"
            note             = $prod.note
        } $tok

        if ($res.result.id) {
            $allOrderIds += $res.result.id
            Write-Host "  + $($res.result.trackingCode)  $($prod.note)" -ForegroundColor Green
        } else {
            Write-Host "  ! That bai cho $($s.username)" -ForegroundColor Red
        }
        $idx++
    }
}

# ─── 3. Cap nhat trang thai ─────────────────────────────────
Write-Host ""
Write-Host "[3/3] Cap nhat trang thai don hang..." -ForegroundColor Cyan

$adminLogin = Post "/identity/auth/token" @{ username = "admin"; password = "admin" }
$adminTok   = $adminLogin.result.token

if (-not $adminTok) {
    Write-Host "  ! Khong login duoc admin. Skip buoc nay." -ForegroundColor Red
} else {
    $statuses = @(
        @{ status = "PENDING";          note = "Cho xac nhan" },
        @{ status = "CONFIRMED";        note = "Da xac nhan, cho lay hang" },
        @{ status = "OUT_FOR_DELIVERY"; note = "Shipper dang giao hang" },
        @{ status = "DELIVERED";        note = "Giao thanh cong" },
        @{ status = "DELIVERY_FAILED";  note = "Khong lien lac duoc nguoi nhan" }
    )

    $total     = $allOrderIds.Count
    $groupSize = [math]::Max(1, [math]::Floor($total / 5))

    for ($i = 0; $i -lt $total; $i++) {
        $g  = [math]::Min([math]::Floor($i / $groupSize), 4)
        $sm = $statuses[$g]
        if ($sm.status -ne "PENDING") {
            Put "/order/orders/$($allOrderIds[$i])/status" @{ status = $sm.status; note = $sm.note } $adminTok
        }
        Write-Host "  [$($i+1)/$total] $($sm.status)" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " SEED HOAN THANH!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Sender: sender01@picbox.vn -> sender10@picbox.vn"
Write-Host " Pass  : Sender@123"
Write-Host " Don   : $($allOrderIds.Count) don hang"
Write-Host " Admin : admin / admin  ->  localhost:3001"
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
