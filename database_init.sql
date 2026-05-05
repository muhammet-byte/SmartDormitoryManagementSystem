-- 1. Veritabanı Oluşturma ve Seçme
CREATE DATABASE IF NOT EXISTS smart_dorm_db
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE smart_dorm_db;

-- 2. Var Olan Tabloları Temizleme (Bağımlılık sırasının TERSİNE göre silinmeli)
DROP PROCEDURE IF EXISTS SeedDormStructure;
DROP PROCEDURE IF EXISTS SeedStudents;
DROP TABLE IF EXISTS maintenance_requests;
DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS student_details;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS blocks;
DROP TABLE IF EXISTS users;

-- 3. TABLO OLUŞTURMA İŞLEMLERİ

-- KULLANICILAR (Yönetici ve Öğrenci)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('ADMIN', 'STUDENT') NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    status ENUM('ACTIVE', 'ON_LEAVE', 'PASSIVE', 'LEFT') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BLOKLAR (1-16 Arası)
CREATE TABLE blocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    block_number INT NOT NULL UNIQUE
);

-- ODALAR
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    block_id INT NOT NULL,
    floor_number INT NOT NULL,     
    apartment_number INT NOT NULL, 
    room_number INT NOT NULL,      
    capacity INT DEFAULT 2,        
    FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE
);

-- ÖĞRENCİ DETAYLARI VE AI EŞLEŞTİRME METRİKLERİ
CREATE TABLE student_details (
    user_id INT PRIMARY KEY,
    room_id INT,
    bed_number INT CHECK (bed_number IN (1, 2)),
    university VARCHAR(100),
    department VARCHAR(100),
    sleep_schedule ENUM('10PM', '11PM', '12PM', '1AM', '2AM'),
    wake_schedule ENUM('7AM', '8AM', '9AM', '10AM'),
    vibes JSON,
    cleanliness_level INT CHECK (cleanliness_level BETWEEN 1 AND 5),
    noise_tolerance INT CHECK (noise_tolerance BETWEEN 1 AND 5),
    remaining_leave_days INT DEFAULT 60,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

-- ADRESLER (İzin işlemleri için)
CREATE TABLE addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    city VARCHAR(50) NOT NULL,
    full_address TEXT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- İZİN TALEPLERİ
CREATE TABLE leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    address_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE RESTRICT
);

-- BAKIM VE ŞİKAYET TALEPLERİ
CREATE TABLE maintenance_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    room_id INT,
    type ENUM('REPAIR', 'COMPLAINT') NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'PENDING',
    description TEXT NOT NULL,
    admin_response TEXT,
    assigned_to VARCHAR(100),
    estimated_time VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

-- ÖDEMELER VE FATURALAR
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    invoice_no VARCHAR(50) UNIQUE NOT NULL,
    payment_type ENUM('MONTHLY_INSTALLMENT', 'DEPOSIT') NOT NULL,
    expected_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,
    due_date DATE NOT NULL,
    status ENUM('PENDING', 'PAID', 'OVERDUE') DEFAULT 'PENDING',
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. OTOMATİK VERİ DOLDURMA İŞLEMLERİ (STORED PROCEDURES)
DELIMITER $$

-- Yurt Mimarisini Oluşturan Döngü (16 Blok, 128 Oda)
CREATE PROCEDURE SeedDormStructure()
BEGIN
    DECLARE b INT DEFAULT 1;
    DECLARE f INT;
    DECLARE a INT;
    DECLARE r INT;
    DECLARE global_room_number INT;
    DECLARE current_block_id INT;

    WHILE b <= 16 DO
        INSERT INTO blocks (block_number) VALUES (b);
        SET current_block_id = LAST_INSERT_ID();
        
        SET f = 1;
        SET global_room_number = 1;
        
        WHILE f <= 2 DO
            SET a = 1;
            WHILE a <= 2 DO
                SET r = 1;
                WHILE r <= 2 DO
                    INSERT INTO rooms (block_id, floor_number, apartment_number, room_number, capacity)
                    VALUES (current_block_id, f, a, global_room_number, 2);
                    
                    SET r = r + 1;
                    SET global_room_number = global_room_number + 1;
                END WHILE;
                SET a = a + 1;
            END WHILE;
            SET f = f + 1;
        END WHILE;
        SET b = b + 1;
    END WHILE;
END$$

-- %30 Kapasiteyi (Yaklaşık 76 Öğrenci) Rastgele Verilerle Dolduran Döngü
CREATE PROCEDURE SeedStudents()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE current_user_id INT;
    DECLARE assigned_room INT;
    DECLARE assigned_bed INT;
    
    WHILE i <= 76 DO
        -- Öğrenci Kullanıcısı Oluşturma
        INSERT INTO users (role, first_name, last_name, email, password, phone, status)
        VALUES (
            'STUDENT', 
            CONCAT('Ogrenci', i), 
            CONCAT('Soyad', i), 
            CONCAT('ogrenci', i, '@smartdorm.com'), 
            '$2a$10$DUMMYHASHEDPASSWORD', -- Gerçek projede BCrypt ile şifrelenmeli. Şimdilik dummy.
            CONCAT('555', LPAD(i, 7, '0')),
            'ACTIVE'
        );
        SET current_user_id = LAST_INSERT_ID();
        
        -- Oda ve Yatak Ataması (1. odadan başlayarak sırayla doldurur)
        SET assigned_room = CEIL(i / 2);
        SET assigned_bed = MOD((i - 1), 2) + 1;
        
        -- Öğrenci Detayları ve Yapay Zeka Metrikleri (Rastgele Seçimler)
        INSERT INTO student_details (
            user_id, room_id, bed_number, university, department, 
            sleep_schedule, wake_schedule, vibes, cleanliness_level, noise_tolerance
        )
        VALUES (
            current_user_id,
            assigned_room,
            assigned_bed,
            ELT(FLOOR(RAND() * 3) + 1, 'Marmara Üniversitesi', 'Boğaziçi Üniversitesi', 'İTÜ'),
            ELT(FLOOR(RAND() * 4) + 1, 'Bilgisayar Mühendisliği', 'İşletme', 'Mimarlık', 'Tıp'),
            ELT(FLOOR(RAND() * 5) + 1, '10PM', '11PM', '12PM', '1AM', '2AM'),
            ELT(FLOOR(RAND() * 4) + 1, '7AM', '8AM', '9AM', '10AM'),
            JSON_ARRAY(ELT(FLOOR(RAND() * 3) + 1, 'Oyun', 'Müzik', 'Kitap'), ELT(FLOOR(RAND() * 3) + 1, 'Spor', 'Kahve', 'Hayvan')),
            FLOOR(RAND() * 5) + 1,
            FLOOR(RAND() * 5) + 1
        );
        
        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;

-- 5. VERİLERİ OLUŞTURMA (Prosedürleri Çalıştırma)
CALL SeedDormStructure();
CALL SeedStudents();

-- 6. YÖNETİCİ (ADMIN) HESABININ EKLENMESİ
INSERT INTO users (role, first_name, last_name, email, password, phone, status)
VALUES ('ADMIN', 'Sistem', 'Yöneticisi', 'admin@smartdorm.com', '$2a$10$DUMMYHASHEDPASSWORD', '5550000000', 'ACTIVE');
-- Not: Şifre backend'de kontrol edilirken "admin123" gibi bir şifrenin BCrypt karşılığı girilmelidir. 
-- Şimdilik test için backend yazılırken Spring Security yapılandırmasına göre güncellenebilir.