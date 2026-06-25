#!/usr/bin/env python3
"""
PicBox Big Seed - 200 senders + 100k orders
Direct MySQL insert (bypass API), ~1-2 phut chay xong

Yeu cau: pip install pymysql bcrypt
Chay   : python docker/seed-big.py
"""

import sys
import uuid
import random
from datetime import datetime, timedelta

try:
    import pymysql
except ImportError:
    print("[ERR] Cai pymysql truoc: pip install pymysql")
    sys.exit(1)

# ─── Config (doc tu env hoac dung default cho dev local) ─────
import os
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", "3307"))
MYSQL_USER = os.getenv("MYSQL_USER", "dev")
MYSQL_PASS = os.getenv("MYSQL_PASSWORD", "devpass")

NUM_SENDERS  = 200
NUM_ORDERS   = 100_000
BATCH_SIZE   = 5_000
NUM_OPS      = 10
NUM_SHIPPERS = 50
NUM_DRIVERS  = 20

# ─── Password hash ────────────────────────────────────────────
try:
    import bcrypt as _bcrypt
    _hash = _bcrypt.hashpw(b"Sender@123", _bcrypt.gensalt(10)).decode()
    print(f"[OK] BCrypt hash generated")
except ImportError:
    # Pre-computed bcrypt("Sender@123", rounds=10) — van hop le voi Spring BCryptPasswordEncoder
    _hash = "$2a$10$slYQmyNdgzSw.XpfoFatvuOkDz.v3FMDjAeZq.pRb8Gn/R.kMJG.K"
    print("[WARN] bcrypt not installed — dung pre-computed hash")
PASSWORD_HASH = _hash

# ─── Fake data pools ─────────────────────────────────────────
_LAST  = ["Nguyen","Tran","Le","Pham","Hoang","Phan","Vo","Dang","Bui","Do",
          "Ho","Ngo","Duong","Ly","Cao","Mai","Dinh","Lam","Vu","Ha"]
_MID   = ["Van","Thi","Minh","Thanh","Quoc","Ngoc","Xuan","Duc","Kim","The",""]
_FIRST = ["An","Binh","Cuong","Dung","Huong","Khanh","Linh","Manh","Nam","Oanh",
          "Phuong","Quan","Son","Thao","Uyen","Van","Xuan","Yen","Anh","Bao",
          "Chi","Duc","Giang","Hoa","Khoa","Lan","My","Ngoc","Phu","Tuan","Viet"]

ADDRESSES = [
    ("45 Le Loi, Quan 1",               "TP Ho Chi Minh"),
    ("12 Hoang Dieu, Ba Dinh",           "Ha Noi"),
    ("78 Nguyen Van Linh, Hai Chau",     "Da Nang"),
    ("33 Tran Phu, Ninh Kieu",           "Can Tho"),
    ("56 Lach Tray, Ngo Quyen",          "Hai Phong"),
    ("90 Hai Ba Trung, Quan 3",          "TP Ho Chi Minh"),
    ("23 Dinh Tien Hoang, Hoan Kiem",    "Ha Noi"),
    ("15 Phan Chau Trinh, Hai Chau",     "Da Nang"),
    ("67 Mau Than, Binh Thuy",           "Can Tho"),
    ("102 To Hieu, Le Chan",             "Hai Phong"),
    ("8 Dong Khoi, Quan 1",              "TP Ho Chi Minh"),
    ("44 Ba Trieu, Hoan Kiem",           "Ha Noi"),
    ("37 Nguyen Chi Thanh, Thanh Khe",   "Da Nang"),
    ("19 Ly Tu Trong, Ninh Kieu",        "Can Tho"),
    ("81 Dien Bien Phu, Le Chan",        "Hai Phong"),
    ("25 Pham Ngoc Thach, Quan 3",       "TP Ho Chi Minh"),
    ("55 Lang Ha, Dong Da",              "Ha Noi"),
    ("100 Tran Phu, Hai Chau",           "Da Nang"),
    ("88 Vo Van Ngan, Thu Duc",          "TP Ho Chi Minh"),
    ("14 Ly Thai To, Hoan Kiem",         "Ha Noi"),
    ("29 Nguyen Tri Phuong, Binh Thanh", "TP Ho Chi Minh"),
    ("67 Le Duan, Hai Chau",             "Da Nang"),
    ("40 Ngo Quyen, Son Tra",            "Da Nang"),
    ("11 CMT8, Quan 10",                 "TP Ho Chi Minh"),
    ("72 Nguyen Hue, Quan 1",            "TP Ho Chi Minh"),
    ("130 Nguyen Trai, Thanh Xuan",      "Ha Noi"),
    ("250 Xa Dan, Dong Da",              "Ha Noi"),
    ("5 Bui Thi Xuan, Quan 1",           "TP Ho Chi Minh"),
    ("77 Tran Hung Dao, Hoan Kiem",      "Ha Noi"),
    ("32 Phan Dinh Phung, Ba Dinh",      "Ha Noi"),
]

# (ten san pham, can kg, phi co ban VND, cod VND)
PRODUCTS = [
    ("Quan ao thoi trang",             0.5,  35000,       0),
    ("Dien thoai Samsung Galaxy A54",  0.3,  45000, 2500000),
    ("Giay sneaker Nike Air Max",      1.2,  55000, 1200000),
    ("My pham Han Quoc set 5 mon",     0.4,  38000,  850000),
    ("Sach giao trinh Dai hoc",        1.5,  30000,       0),
    ("Laptop Dell Inspiron 15",        2.5,  85000, 18000000),
    ("Tai nghe Sony WH-1000XM5",       0.4,  42000, 4500000),
    ("Dong ho Casio G-Shock",          0.3,  40000, 2200000),
    ("May pha ca phe Delonghi",        3.5,  95000,       0),
    ("Balo du lich 40L",               1.0,  48000,       0),
    ("Do choi Lego Creator Expert",    0.8,  36000,  320000),
    ("Nuoc hoa Chanel No5 50ml",       0.3,  45000, 3200000),
    ("Kinh mat Ray-Ban Aviator",       0.2,  32000, 1800000),
    ("Thuc pham chuc nang Blackmores", 0.6,  38000,       0),
    ("Phu kien iPhone 15 Pro Max",     0.2,  28000,  150000),
    ("Vo game DualSense PS5",          0.5,  42000, 1500000),
    ("Quan Jean Levis 501 Original",   0.7,  38000,  800000),
    ("Tui xach da cao cap",            0.6,  65000, 5500000),
    ("May tinh bang iPad Air M2",      0.8,  75000, 12000000),
    ("Ghe ngoi van phong Ergonomic",  15.0, 150000,       0),
    ("Den bam thong minh Philips Hue", 0.4,  35000,  850000),
    ("Quat dieu hoa Sunhouse",         5.0,  85000,       0),
    ("Sach luyen thi IELTS 8.0",       0.8,  30000,  180000),
    ("Giay da tang chieu cao nam",     1.1,  55000, 2400000),
    ("Ban phim co AKKO 3087 RGB",      0.9,  55000, 1800000),
    ("Chuot gaming Logitech G502 X",   0.3,  40000,  950000),
    ("Man hinh LG 27 inch 4K IPS",     6.0, 120000, 9000000),
    ("Tu sach go thong tien tu nhien", 12.0, 130000,       0),
    ("Cap HDMI 2.1 8K chong nhieu",    0.1,  25000,   85000),
    ("Binh giu nhiet Lock&Lock 500ml", 0.5,  32000,  220000),
]

# Fallback branch IDs (dung neu DB chua co branch tu seed-hubs.ps1)
FALLBACK_BRANCHES = [
    ("HCM_Q1_001", "Chi nhanh Quan 1 Ben Nghe",     "TP Ho Chi Minh"),
    ("HCM_Q3_002", "Chi nhanh Quan 3 Vo Thi Sau",    "TP Ho Chi Minh"),
    ("HCM_Q7_003", "Chi nhanh Quan 7 Phu My Hung",   "TP Ho Chi Minh"),
    ("HCM_BT_004", "Chi nhanh Binh Thanh",            "TP Ho Chi Minh"),
    ("HCM_TD_005", "Chi nhanh Thu Duc",                "TP Ho Chi Minh"),
    ("HAN_HK_006", "Chi nhanh Hoan Kiem",             "Ha Noi"),
    ("HAN_BD_007", "Chi nhanh Ba Dinh",                "Ha Noi"),
    ("HAN_DD_008", "Chi nhanh Dong Da",                "Ha Noi"),
    ("HAN_CG_009", "Chi nhanh Cau Giay",               "Ha Noi"),
    ("DNA_HC_010", "Chi nhanh Hai Chau",               "Da Nang"),
    ("DNA_TK_011", "Chi nhanh Thanh Khe",              "Da Nang"),
    ("CT_NK_012",  "Chi nhanh Ninh Kieu",              "Can Tho"),
    ("CT_BT_013",  "Chi nhanh Binh Thuy",              "Can Tho"),
    ("HP_NQ_014",  "Chi nhanh Ngo Quyen",              "Hai Phong"),
    ("HP_LC_015",  "Chi nhanh Le Chan",                 "Hai Phong"),
]

# Trang thai don hang hop le (khop voi enum trong DB)
STATUSES = [
    "PENDING",
    "CONFIRMED",
    "AT_ORIGIN_BRANCH",
    "PICKED_UP",
    "AT_HUB",
    "IN_TRANSIT_TO_HUB",
    "AT_DEST_HUB",
    "IN_TRANSIT_TO_DEST_BRANCH",
    "AT_DEST_BRANCH",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "DELIVERY_FAILED",
    "CANCELLED",
    "RETURNED",
]
# Phan bo % cho 100k don (tong = 100)
WEIGHTS = [5, 3, 3, 4, 3, 3, 3, 3, 3, 8, 55, 7, 4, 2]

# Phuong thuc lay hang (hop le theo enum DB)
PICKUP_METHODS = ["PICKUP_AT_BRANCH", "PICKUP_AT_DOOR"]

REGION_MAP = {
    "TP Ho Chi Minh": "MN",
    "Ha Noi":         "MB",
    "Da Nang":        "MT",
    "Can Tho":        "MN",
    "Hai Phong":      "MB",
}

# ─── Helpers ─────────────────────────────────────────────────
def rname():
    m = random.choice(_MID)
    return f"{random.choice(_LAST)} {(m + ' ') if m else ''}{random.choice(_FIRST)}"

def rphone():
    pfx = random.choice(["090","091","093","094","096","097","098","070","079","077"])
    return pfx + str(random.randint(1000000, 9999999))

def rdate(days_back: int = 365):
    offset = random.randint(0, days_back * 86400)
    return datetime.now() - timedelta(seconds=offset)

def connect(db: str):
    return pymysql.connect(
        host=MYSQL_HOST, port=MYSQL_PORT,
        user=MYSQL_USER, password=MYSQL_PASS,
        database=db, charset="utf8mb4",
        autocommit=False,
    )

# ─── Step 1: Senders ─────────────────────────────────────────
def seed_senders():
    print(f"\n[1/4] Tao {NUM_SENDERS} sender accounts...")
    ci = connect("identity_service")
    cp = connect("profile_service")
    senders = []

    try:
        curi = ci.cursor()
        curp = cp.cursor()

        # Kiem tra role SENDER ton tai
        curi.execute("SELECT name FROM role WHERE name='SENDER'")
        if not curi.fetchone():
            curi.execute(
                "INSERT IGNORE INTO role (name, description) VALUES ('SENDER','Nguoi gui hang')"
            )
            ci.commit()
            print("  + Tao role SENDER")

        for i in range(NUM_SENDERS):
            uid   = str(uuid.uuid4())
            uname = f"seeder{i+1:04d}@picbox.vn"
            fname = rname()
            phone = rphone()

            curi.execute(
                "INSERT IGNORE INTO `user` (id, username, password) VALUES (%s, %s, %s)",
                (uid, uname, PASSWORD_HASH),
            )
            curi.execute(
                "INSERT IGNORE INTO user_roles (user_id, roles_name) VALUES (%s, 'SENDER')",
                (uid,),
            )
            curp.execute(
                """INSERT IGNORE INTO profile
                   (id, user_id, full_name, phone_number, avatar, gender, address, dob)
                   VALUES (%s, %s, %s, %s, '', '', '', NULL)""",
                (str(uuid.uuid4()), uid, fname, phone),
            )
            senders.append((uid, fname, phone))

            if (i + 1) % 50 == 0:
                ci.commit(); cp.commit()
                print(f"  -> {i+1}/{NUM_SENDERS}")

        ci.commit(); cp.commit()
        print(f"  [OK] {NUM_SENDERS} senders")
        return senders
    finally:
        ci.close(); cp.close()

# ─── Step 2: Staff (OPS / SHIPPER / DRIVER) ──────────────────
def seed_staff():
    print(f"\n[2/4] Tao staff: {NUM_OPS} OPS + {NUM_SHIPPERS} SHIPPER + {NUM_DRIVERS} DRIVER...")
    ci = connect("identity_service")
    cp = connect("profile_service")
    shippers = []

    try:
        curi = ci.cursor()
        curp = cp.cursor()

        staff_cfg = [
            ("OPS",     NUM_OPS,      "ops",     "OPS@123"),
            ("SHIPPER", NUM_SHIPPERS, "shipper", "Shipper@123"),
            ("DRIVER",  NUM_DRIVERS,  "driver",  "Driver@123"),
        ]

        # Ensure all roles exist
        for role, _, _, _ in staff_cfg:
            curi.execute("INSERT IGNORE INTO role (name, description) VALUES (%s,%s)",
                         (role, role))
        ci.commit()

        for role, count, prefix, pwd in staff_cfg:
            try:
                import bcrypt as _bc
                phash = _bc.hashpw(pwd.encode(), _bc.gensalt(10)).decode()
            except ImportError:
                phash = PASSWORD_HASH

            for i in range(count):
                uid   = str(uuid.uuid4())
                uname = f"{prefix}{i+1:03d}@picbox.vn"
                fname = rname()
                phone = rphone()

                curi.execute(
                    "INSERT IGNORE INTO `user` (id, username, password) VALUES (%s,%s,%s)",
                    (uid, uname, phash),
                )
                curi.execute(
                    "INSERT IGNORE INTO user_roles (user_id, roles_name) VALUES (%s,%s)",
                    (uid, role),
                )
                curp.execute(
                    """INSERT IGNORE INTO profile
                       (id, user_id, full_name, phone_number, avatar, gender, address, dob)
                       VALUES (%s,%s,%s,%s,'','','',NULL)""",
                    (str(uuid.uuid4()), uid, fname, phone),
                )
                if role == "SHIPPER":
                    shippers.append(uid)

            ci.commit(); cp.commit()
            print(f"  + {count} {role}")

        print(f"  [OK] staff tao xong ({len(shippers)} shippers)")

        # Seed staff_service.staff (rieng biet voi identity_service)
        _seed_staff_service(curi, curp)

        return shippers
    finally:
        ci.close(); cp.close()

def _seed_staff_service(curi, curp):
    """Dong bo identity users -> staff_service.staff."""
    try:
        cs = connect("staff_service")
        curs = cs.cursor()

        # Lay hub IDs lam homeBase (neu chua co branch)
        ch = connect("hub_branch_service")
        curh = ch.cursor()
        hub_ids = []
        for tbl in ("branches", "branch"):
            try:
                curh.execute(f"SELECT id FROM `{tbl}` LIMIT 20")
                rows = curh.fetchall()
                if rows:
                    hub_ids = [r[0] for r in rows]
                    break
            except Exception:
                pass
        if not hub_ids:
            curh.execute("SELECT id FROM hubs LIMIT 10")
            hub_ids = [r[0] for r in curh.fetchall()]
        ch.close()

        if not hub_ids:
            print("  [SKIP] staff_service: khong co hub/branch de lam homeBase")
            cs.close()
            return

        staff_role_map = {"SHIPPER": "SHIPPER", "DRIVER": "DRIVER", "OPS": "HUB_STAFF"}
        base_type_map  = {"SHIPPER": "HUB",     "DRIVER": "HUB",    "OPS": "HUB"}
        now = datetime.now()
        rows = []

        for identity_role, staff_role in staff_role_map.items():
            curi.execute('''
                SELECT u.id, u.username, p.full_name, p.phone_number
                FROM `user` u
                JOIN user_roles ur ON u.id = ur.user_id
                LEFT JOIN profile_service.profile p ON p.user_id = u.id
                WHERE ur.roles_name = %s
            ''', (identity_role,))
            users = curi.fetchall()
            for idx, (uid, uname, fname, phone) in enumerate(users):
                home_base_id = hub_ids[idx % len(hub_ids)]
                rows.append((
                    str(uuid.uuid4()), uid,
                    fname or uname, phone or '',
                    uname if '@' in uname else '',
                    staff_role, home_base_id,
                    base_type_map[identity_role],
                    'ACTIVE', now, now,
                ))

        if rows:
            curs.executemany('''
                INSERT IGNORE INTO staff
                (id, user_id, full_name, phone, email, role,
                 home_base_id, home_base_type, status, created_at, updated_at)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ''', rows)
            cs.commit()
            print(f"  [OK] {len(rows)} records trong staff_service.staff")
        cs.close()
    except Exception as e:
        print(f"  [WARN] staff_service seed that bai: {e}")

# ─── Step 3: Branch IDs ──────────────────────────────────────
def load_branches():
    print("\n[3/4] Tim branch IDs...")
    for tbl in ("branch", "branches"):
        try:
            ch  = connect("hub_branch_service")
            cur = ch.cursor()
            cur.execute(f"SELECT id, name, province FROM `{tbl}` LIMIT 50")
            rows = cur.fetchall()
            ch.close()
            if rows:
                result = [(str(r[0]), str(r[1]), str(r[2])) for r in rows]
                print(f"  [OK] {len(result)} branches tu bang '{tbl}'")
                return result
        except Exception:
            pass

    print("  [WARN] Chua co branch trong DB -> dung placeholder IDs")
    print("         (Chay seed-hubs.ps1 truoc de co branch that)")
    return FALLBACK_BRANCHES

# ─── Step 3: Orders ──────────────────────────────────────────
def seed_orders(senders, branches, shippers):
    print(f"\n[4/4] Tao {NUM_ORDERS:,} don hang (batch {BATCH_SIZE:,})...")
    co  = connect("order_service")
    cur = co.cursor()

    order_sql = """
        INSERT INTO orders
        (id, tracking_code, sender_id, sender_name, sender_phone,
         receiver_name, receiver_phone, receiver_address,
         origin_branch_id, origin_branch_name,
         dest_branch_id, dest_branch_name,
         weight, width, height, length,
         fee, cod_amount, pickup_method, status,
         region_code, shipper_id, note,
         created_at, updated_at)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
                %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """
    hist_sql = """
        INSERT INTO order_status_history
        (id, order_id, status, note, changed_by, changed_at)
        VALUES (%s, %s, %s, %s, %s, %s)
    """

    yr     = datetime.now().year
    orows  = []
    hrows  = []
    total  = 0

    try:
        for i in range(NUM_ORDERS):
            oid     = str(uuid.uuid4())
            tcode   = f"PB{yr}{i+1:08d}"
            sender  = random.choice(senders)
            recv_n  = rname()
            recv_p  = rphone()
            recv_a, recv_prov = random.choice(ADDRESSES)
            origin  = random.choice(branches)
            dest    = random.choice(branches)
            note, weight, base_fee, cod = random.choice(PRODUCTS)
            status  = random.choices(STATUSES, WEIGHTS)[0]
            method  = random.choice(PICKUP_METHODS)
            fee     = max(25000, base_fee + random.randint(-5000, 20000))
            created = rdate(365)
            region  = REGION_MAP.get(recv_prov, "MN")

            # Don da giao/that bai gan shipper that tu danh sach da seed
            shipper_id = None
            if status in ("OUT_FOR_DELIVERY", "DELIVERED", "DELIVERY_FAILED", "RETURNED"):
                shipper_id = random.choice(shippers) if shippers else str(uuid.uuid4())

            orows.append((
                oid, tcode,
                sender[0], sender[1], sender[2],
                recv_n, recv_p, recv_a,
                origin[0], origin[1],
                dest[0], dest[1],
                round(weight, 2), None, None, None,
                fee, cod,
                method, status, region,
                shipper_id, note,
                created, created,
            ))
            hrows.append((
                str(uuid.uuid4()), oid, status,
                "Auto-seeded", "system", created,
            ))

            if len(orows) >= BATCH_SIZE:
                cur.executemany(order_sql, orows)
                cur.executemany(hist_sql, hrows)
                co.commit()
                total += len(orows)
                orows = []; hrows = []
                pct = total / NUM_ORDERS * 100
                elapsed_ms = ""
                print(f"  -> {total:>7,}/{NUM_ORDERS:,}  ({pct:.0f}%)")

        # Flush cuoi
        if orows:
            cur.executemany(order_sql, orows)
            cur.executemany(hist_sql, hrows)
            co.commit()
            total += len(orows)

        print(f"  [OK] {total:,} don hang\n")
        print("  Phan bo trang thai:")
        for s, w in zip(STATUSES, WEIGHTS):
            cur.execute("SELECT COUNT(*) FROM orders WHERE status=%s", (s,))
            cnt = cur.fetchone()[0]
            bar = "#" * int(cnt / NUM_ORDERS * 40)
            print(f"    {s:<35} {cnt:>7,}  {bar}")

    finally:
        co.close()

# ─── Step 4: Wallets ─────────────────────────────────────────
def seed_wallets(senders):
    print("\n[+] Tao wallets cho senders...")
    try:
        cp  = connect("payment_service")
        cur = cp.cursor()
        now = datetime.now()
        rows = [
            (str(uuid.uuid4()), s[0], 0, now, now, 0)
            for s in senders
        ]
        cur.executemany(
            "INSERT IGNORE INTO wallets (id, user_id, balance, created_at, updated_at, version) VALUES (%s,%s,%s,%s,%s,%s)",
            rows,
        )
        cp.commit()
        cp.close()
        print(f"  [OK] {len(senders)} wallets")
    except Exception as e:
        print(f"  [SKIP] Loi wallet: {e}")

# ─── Main ────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print(f"  PicBox Big Seed  —  {NUM_SENDERS} senders + {NUM_ORDERS:,} orders")
    print("=" * 60)
    print(f"  MySQL : {MYSQL_HOST}:{MYSQL_PORT}  user={MYSQL_USER}")

    # Test ket noi
    try:
        c = connect("order_service"); c.close()
    except Exception as e:
        print(f"\n[ERR] Khong ket noi MySQL: {e}")
        print("  Kiem tra: docker ps | grep picbox-mysql")
        sys.exit(1)

    t0 = datetime.now()

    senders  = seed_senders()
    shippers = seed_staff()
    branches = load_branches()
    seed_orders(senders, branches, shippers)
    seed_wallets(senders)

    elapsed = (datetime.now() - t0).total_seconds()

    print("\n" + "=" * 60)
    print("  SEED HOAN THANH!")
    print("=" * 60)
    print(f"  Senders : seeder0001@picbox.vn -> seeder{NUM_SENDERS:04d}@picbox.vn  (Sender@123)")
    print(f"  OPS     : ops001@picbox.vn -> ops{NUM_OPS:03d}@picbox.vn              (OPS@123)")
    print(f"  Shippers: shipper001@picbox.vn -> shipper{NUM_SHIPPERS:03d}@picbox.vn (Shipper@123)")
    print(f"  Drivers : driver001@picbox.vn -> driver{NUM_DRIVERS:03d}@picbox.vn    (Driver@123)")
    print(f"  Orders  : {NUM_ORDERS:,} don voi 14 trang thai phan bo thuc te")
    print(f"  Thoi gian: {elapsed:.1f}s")
    print("=" * 60)
    print()
    print("  Admin dashboard: http://localhost:3001")
    print("  Login: admin / admin")
    print()

if __name__ == "__main__":
    main()
