# PicBox Hub & Branch Seed
$BASE = "http://localhost:8080"
$ErrorActionPreference = "SilentlyContinue"

function Post($url, $body, $token) {
    $h = @{ "Content-Type" = "application/json" }
    if ($token) { $h["Authorization"] = "Bearer $token" }
    try {
        return Invoke-RestMethod -Method POST -Uri "$BASE$url" -Headers $h -Body ($body | ConvertTo-Json -Depth 5)
    } catch {
        try {
            $r = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
            return $r.ReadToEnd() | ConvertFrom-Json
        } catch { return $null }
    }
}

# ─── 1. Login admin ──────────────────────────────────────────
$login = Post "/identity/auth/token" @{ username = "admin"; password = "admin" }
$tok   = $login.result.token
if (-not $tok) { Write-Host "LOGIN FAILED" -ForegroundColor Red; exit 1 }
Write-Host "[OK] Logged in as admin" -ForegroundColor Green

# ─── 2. Tao Regions ─────────────────────────────────────────
Write-Host "`n[1/4] Tao Regions..." -ForegroundColor Cyan
$regions = @(
    @{ name = "Mien Nam";   code = "MN"; description = "Khu vuc mien Nam" },
    @{ name = "Mien Bac";   code = "MB"; description = "Khu vuc mien Bac" },
    @{ name = "Mien Trung"; code = "MT"; description = "Khu vuc mien Trung" }
)
$regionMap = @{}
foreach ($r in $regions) {
    $res = Post "/hub/regions" $r $tok
    $id  = $res.result.id
    if ($id) {
        $regionMap[$r.code] = $id
        Write-Host "  + Region: $($r.name) [$id]" -ForegroundColor Green
    } else {
        Write-Host "  ! Loi tao region $($r.name): $($res.message)" -ForegroundColor Red
    }
}

# ─── 3. Tao Areas ────────────────────────────────────────────
Write-Host "`n[2/4] Tao Areas..." -ForegroundColor Cyan
$areas = @(
    @{ name = "TP Ho Chi Minh"; code = "HCM"; regionCode = "MN" },
    @{ name = "Binh Duong";     code = "BD";  regionCode = "MN" },
    @{ name = "Dong Nai";       code = "DN2"; regionCode = "MN" },
    @{ name = "Can Tho";        code = "CT";  regionCode = "MN" },
    @{ name = "Ha Noi";         code = "HN";  regionCode = "MB" },
    @{ name = "Hai Phong";      code = "HP";  regionCode = "MB" },
    @{ name = "Da Nang";        code = "DNA"; regionCode = "MT" }
)
$areaMap = @{}
foreach ($a in $areas) {
    $rid = $regionMap[$a.regionCode]
    if (-not $rid) { Write-Host "  ! Region $($a.regionCode) chua co" -ForegroundColor Yellow; continue }
    $res = Post "/hub/areas" @{ name = $a.name; code = $a.code; regionId = $rid } $tok
    $id  = $res.result.id
    if ($id) {
        $areaMap[$a.code] = $id
        Write-Host "  + Area: $($a.name) [$id]" -ForegroundColor Green
    } else {
        Write-Host "  ! Loi tao area $($a.name): $($res.message)" -ForegroundColor Red
    }
}

# ─── 4. Tao Hubs ─────────────────────────────────────────────
Write-Host "`n[3/4] Tao Hubs..." -ForegroundColor Cyan
$hubs = @(
    @{ name = "Hub Trung Tam TP.HCM";  areaCode = "HCM"; address = "12 Nguyen Thi Minh Khai, Q.1"; province = "TP Ho Chi Minh"; contactPhone = "028-3822-1100" },
    @{ name = "Hub Trung Tam Ha Noi";   areaCode = "HN";  address = "45 Lang Ha, Dong Da";           province = "Ha Noi";         contactPhone = "024-3825-2200" },
    @{ name = "Hub Trung Tam Da Nang";  areaCode = "DNA"; address = "78 Le Duan, Hai Chau";           province = "Da Nang";        contactPhone = "0236-382-3300" },
    @{ name = "Hub Trung Tam Can Tho";  areaCode = "CT";  address = "33 Tran Phu, Ninh Kieu";         province = "Can Tho";        contactPhone = "0292-382-4400" },
    @{ name = "Hub Trung Tam Hai Phong"; areaCode = "HP"; address = "56 Lach Tray, Ngo Quyen";        province = "Hai Phong";      contactPhone = "0225-382-5500" }
)
$hubMap = @{}
foreach ($h in $hubs) {
    $aid = $areaMap[$h.areaCode]
    if (-not $aid) { Write-Host "  ! Area $($h.areaCode) chua co" -ForegroundColor Yellow; continue }
    $res = Post "/hub/hubs" @{
        name   = $h.name; areaId = $aid; address = $h.address
        province = $h.province; contactPhone = $h.contactPhone
    } $tok
    $id = $res.result.id
    if ($id) {
        $hubMap[$h.areaCode] = $id
        Write-Host "  + Hub: $($h.name) [$id]" -ForegroundColor Green
    } else {
        Write-Host "  ! Loi tao hub $($h.name): $($res.message)" -ForegroundColor Red
    }
}

# ─── 5. Tao Branches ─────────────────────────────────────────
Write-Host "`n[4/4] Tao Branches..." -ForegroundColor Cyan
$branches = @(
    # HCM
    @{ name = "Chi nhanh Q.1 - Ben Nghe";    hubCode = "HCM"; address = "45 Le Loi";              district = "Quan 1";       province = "TP Ho Chi Minh"; phone = "028-3829-1001"; cap = 500 },
    @{ name = "Chi nhanh Q.3 - Vo Thi Sau";  hubCode = "HCM"; address = "90 Vo Thi Sau";           district = "Quan 3";       province = "TP Ho Chi Minh"; phone = "028-3829-1002"; cap = 400 },
    @{ name = "Chi nhanh Q.7 - Phu My Hung"; hubCode = "HCM"; address = "15 Nguyen Luong Bang";    district = "Quan 7";       province = "TP Ho Chi Minh"; phone = "028-3829-1003"; cap = 600 },
    @{ name = "Chi nhanh Binh Thanh";        hubCode = "HCM"; address = "23 Dinh Bo Linh";         district = "Binh Thanh";   province = "TP Ho Chi Minh"; phone = "028-3829-1004"; cap = 350 },
    @{ name = "Chi nhanh Thu Duc";           hubCode = "HCM"; address = "88 Vo Van Ngan";           district = "Thu Duc";      province = "TP Ho Chi Minh"; phone = "028-3829-1005"; cap = 450 },
    # HN
    @{ name = "Chi nhanh Hoan Kiem";         hubCode = "HN";  address = "12 Dinh Tien Hoang";      district = "Hoan Kiem";    province = "Ha Noi";         phone = "024-3826-2001"; cap = 500 },
    @{ name = "Chi nhanh Ba Dinh";           hubCode = "HN";  address = "44 Hoang Dieu";            district = "Ba Dinh";      province = "Ha Noi";         phone = "024-3826-2002"; cap = 400 },
    @{ name = "Chi nhanh Dong Da";           hubCode = "HN";  address = "67 Nguyen Luong Bang";     district = "Dong Da";      province = "Ha Noi";         phone = "024-3826-2003"; cap = 350 },
    @{ name = "Chi nhanh Cau Giay";          hubCode = "HN";  address = "101 Tran Dang Ninh";       district = "Cau Giay";     province = "Ha Noi";         phone = "024-3826-2004"; cap = 450 },
    # DNA
    @{ name = "Chi nhanh Hai Chau";          hubCode = "DNA"; address = "55 Tran Phu";              district = "Hai Chau";     province = "Da Nang";        phone = "0236-382-3001"; cap = 400 },
    @{ name = "Chi nhanh Thanh Khe";         hubCode = "DNA"; address = "20 Nguyen Chi Thanh";      district = "Thanh Khe";    province = "Da Nang";        phone = "0236-382-3002"; cap = 300 },
    # CT
    @{ name = "Chi nhanh Ninh Kieu";         hubCode = "CT";  address = "19 Ly Tu Trong";           district = "Ninh Kieu";    province = "Can Tho";        phone = "0292-382-4001"; cap = 350 },
    @{ name = "Chi nhanh Binh Thuy";         hubCode = "CT";  address = "8 Mau Than";               district = "Binh Thuy";    province = "Can Tho";        phone = "0292-382-4002"; cap = 250 },
    # HP
    @{ name = "Chi nhanh Ngo Quyen";         hubCode = "HP";  address = "56 Lach Tray";             district = "Ngo Quyen";    province = "Hai Phong";      phone = "0225-382-5001"; cap = 400 },
    @{ name = "Chi nhanh Le Chan";           hubCode = "HP";  address = "102 To Hieu";              district = "Le Chan";      province = "Hai Phong";      phone = "0225-382-5002"; cap = 300 }
)
$ok = 0
foreach ($b in $branches) {
    $hid = $hubMap[$b.hubCode]
    if (-not $hid) { Write-Host "  ! Hub $($b.hubCode) chua co" -ForegroundColor Yellow; continue }
    $res = Post "/hub/branches" @{
        name = $b.name; hubId = $hid; address = $b.address
        district = $b.district; province = $b.province
        contactPhone = $b.phone; maxCapacity = $b.cap
    } $tok
    if ($res.result.id) {
        $ok++
        Write-Host "  + $($b.name)" -ForegroundColor Green
    } else {
        Write-Host "  ! Loi: $($b.name) - $($res.message)" -ForegroundColor Red
    }
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host " SEED HUBS HOAN THANH!" -ForegroundColor Green
Write-Host "  5 Hubs + $ok Branches" -ForegroundColor White
Write-Host "==========================================" -ForegroundColor Cyan
