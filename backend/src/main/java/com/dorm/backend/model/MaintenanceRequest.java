package com.dorm.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "maintenance_requests")
public class MaintenanceRequest {

    public enum RequestType {
        REPAIR, COMPLAINT
    }

    public enum Priority {
        LOW, MEDIUM, HIGH
    }

    public enum RequestStatus {
        PENDING, IN_PROGRESS, COMPLETED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(20) default 'PENDING'")
    private RequestStatus status = RequestStatus.PENDING;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "admin_response", columnDefinition = "TEXT")
    private String adminResponse;

    @Column(name = "assigned_to")
    private String assignedTo;

    @Column(name = "estimated_time")
    private String estimatedTime;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // Öğrenci için doğru setter metodu
    public void setStudent(User student) {
        this.student = student;
    }

    // Oda için doğru setter metodu
    public void setRoom(Room room) {
        this.room = room;
    }
}
