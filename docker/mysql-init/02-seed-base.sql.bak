-- ============================================================
--  PicBox Bootstrap Seed
--  Chay tu dong khi MySQL volume duoc tao lan dau
--  (docker-entrypoint-initdb.d)
-- ============================================================

-- ─── Roles ───────────────────────────────────────────────────
INSERT IGNORE INTO identity_service.role (name, description) VALUES
  ('ADMIN',   'Quan tri vien he thong'),
  ('OPS',     'Nhan vien van hanh'),
  ('SHIPPER', 'Shipper giao hang chang cuoi'),
  ('DRIVER',  'Tai xe giao lien tinh'),
  ('SENDER',  'Nguoi gui hang');

-- ─── Admin user ──────────────────────────────────────────────
--  username : admin
--  password : admin   (BCrypt rounds=10)
INSERT IGNORE INTO identity_service.`user` (id, username, password) VALUES
  ('edc34826-eace-4a04-974d-91f881928ea5',
   'admin',
   '$2a$10$BXj4k1Qsckl0dpEWGQFO3uzaqxgNecBs28wYqMXXj/ywDBYMWGwT.');

INSERT IGNORE INTO identity_service.user_roles (user_id, roles_name) VALUES
  ('edc34826-eace-4a04-974d-91f881928ea5', 'ADMIN');

-- ─── Admin profile ───────────────────────────────────────────
INSERT IGNORE INTO profile_service.profile
  (id, user_id, full_name, phone_number, avatar, gender, address, dob)
VALUES
  ('00000000-0000-0000-0000-000000000001',
   'edc34826-eace-4a04-974d-91f881928ea5',
   'Admin PicBox', '0900000000', '', '', '', NULL);
