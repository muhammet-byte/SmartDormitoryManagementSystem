-- 1. Create and Use Database
CREATE DATABASE IF NOT EXISTS dormitory_management;
USE dormitory_management;

-- (Drop existing tables to prevent conflicts during fresh setup)
DROP TABLE IF EXISTS Room_Change_Request;
DROP TABLE IF EXISTS Student;
DROP TABLE IF EXISTS Bed;
DROP TABLE IF EXISTS Room;
DROP TABLE IF EXISTS Floor;
DROP TABLE IF EXISTS Building;
DROP TABLE IF EXISTS User;

-- 2. Authentication and Roles Table
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Will be hashed by Spring Boot
    role ENUM('ADMIN', 'STUDENT') NOT NULL
);

-- 3. Buildings (With map coordinates for Leaflet.js)
CREATE TABLE Building (
    building_id INT AUTO_INCREMENT PRIMARY KEY,
    building_name VARCHAR(100) NOT NULL,
    location_coordinates VARCHAR(255)
);

-- 4. Floors
CREATE TABLE Floor (
    floor_id INT AUTO_INCREMENT PRIMARY KEY,
    building_id INT,
    floor_number INT NOT NULL,
    gender_allocation ENUM('Female', 'Male', 'Mixed') NOT NULL,
    FOREIGN KEY (building_id) REFERENCES Building(building_id) ON DELETE CASCADE
);

-- 5. Rooms
CREATE TABLE Room (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    floor_id INT,
    room_number VARCHAR(10) NOT NULL,
    capacity INT NOT NULL,
    empty_beds_count INT NOT NULL,
    price DECIMAL(10,2),
    facade ENUM('North', 'South', 'East', 'West'),
    room_type VARCHAR(50),
    FOREIGN KEY (floor_id) REFERENCES Floor(floor_id) ON DELETE CASCADE
);

-- 6. Beds
CREATE TABLE Bed (
    bed_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT,
    bed_letter CHAR(1) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (room_id) REFERENCES Room(room_id) ON DELETE CASCADE
);

-- 7. Students (Including AI Vector Parameters for Roommate Matching)
CREATE TABLE Student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    bed_id INT UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    student_number VARCHAR(20) UNIQUE NOT NULL,
    department VARCHAR(100),
    -- AI Vector Parameters
    sleep_time TINYINT,
    wake_up_time TINYINT,
    cleanliness_score TINYINT,
    noise_tolerance TINYINT,
    kitchen_usage TINYINT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (bed_id) REFERENCES Bed(bed_id) ON DELETE SET NULL
);

-- 8. Room Change Requests for Admin Approval Mechanism
CREATE TABLE Room_Change_Request (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    target_room_id INT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (target_room_id) REFERENCES Room(room_id) ON DELETE CASCADE
);

-- ==========================================
-- MOCK DATA FOR SYSTEM TESTING
-- ==========================================

-- Add Admin and 2 Student Accounts
INSERT INTO User (email, password, role) VALUES
('admin@agu.edu.tr', '123456', 'ADMIN'),
('ahmet@agu.edu.tr', '123456', 'STUDENT'),
('caner@agu.edu.tr', '123456', 'STUDENT');

-- Add 1 Building and 1 Floor
INSERT INTO Building (building_name, location_coordinates) VALUES ('North Campus Block A', '38.7322, 35.4853');
INSERT INTO Floor (building_id, floor_number, gender_allocation) VALUES (1, 1, 'Male');

-- Add 2 Rooms (101 and 102) and their Beds
INSERT INTO Room (floor_id, room_number, capacity, empty_beds_count, price, facade, room_type) VALUES
(1, '101', 2, 2, 1500.00, 'South', 'Standard'),
(1, '102', 2, 2, 1500.00, 'North', 'Standard');

INSERT INTO Bed (room_id, bed_letter, is_available) VALUES
(1, 'A', TRUE), (1, 'B', TRUE),
(2, 'A', TRUE), (2, 'B', TRUE);

-- Add Student Profiles (Currently without a room, bed_id = NULL)
INSERT INTO Student (user_id, bed_id, full_name, student_number, department, sleep_time, wake_up_time, cleanliness_score, noise_tolerance, kitchen_usage) VALUES
(2, NULL, 'Ahmet Yilmaz', '2026001', 'Computer Engineering', 3, 2, 4, 1, 1),
(3, NULL, 'Caner Sahin', '2026002', 'Mechanical Engineering', 3, 2, 5, 2, 1);