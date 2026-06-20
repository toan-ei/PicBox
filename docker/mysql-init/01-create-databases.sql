CREATE DATABASE IF NOT EXISTS identity_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS profile_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS order_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS payment_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS hub_branch_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS staff_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS notification_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON identity_service.* TO 'dev'@'%';
GRANT ALL PRIVILEGES ON profile_service.* TO 'dev'@'%';
GRANT ALL PRIVILEGES ON order_service.* TO 'dev'@'%';
GRANT ALL PRIVILEGES ON payment_service.* TO 'dev'@'%';
GRANT ALL PRIVILEGES ON hub_branch_service.* TO 'dev'@'%';
GRANT ALL PRIVILEGES ON staff_service.* TO 'dev'@'%';
GRANT ALL PRIVILEGES ON notification_service.* TO 'dev'@'%';
FLUSH PRIVILEGES;
