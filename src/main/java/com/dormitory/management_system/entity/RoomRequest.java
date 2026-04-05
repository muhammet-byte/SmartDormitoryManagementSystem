package com.dormitory.management_system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "room_requests")
public class RoomRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentUsername; // İsteği atan öğrenci (Şimdilik temsili)
    private Long targetRoomId;      // Hangi odaya girmek istiyor?
    private String roomName;        // Odanın adı (Örn: C-202)
    private String status;          // PENDING (Bekliyor), APPROVED (Onaylandı), REJECTED (Reddedildi)

    public RoomRequest() {
    }

    public RoomRequest(String studentUsername, Long targetRoomId, String roomName) {
        this.studentUsername = studentUsername;
        this.targetRoomId = targetRoomId;
        this.roomName = roomName;
        this.status = "PENDING"; // İstek ilk atıldığında her zaman "Beklemede" olur
    }

    // Getter ve Setter'lar
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentUsername() { return studentUsername; }
    public void setStudentUsername(String studentUsername) { this.studentUsername = studentUsername; }
    public Long getTargetRoomId() { return targetRoomId; }
    public void setTargetRoomId(Long targetRoomId) { this.targetRoomId = targetRoomId; }
    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}