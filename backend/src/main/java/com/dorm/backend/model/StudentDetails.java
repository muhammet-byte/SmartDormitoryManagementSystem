package com.dorm.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "student_details")
public class StudentDetails {

    @Id
    private Long userId; // user_id primary key ve foreign key olarak çalışır

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name = "bed_number")
    private Integer bedNumber;

    private String university;
    private String department;

    @Column(name = "sleep_schedule")
    private String sleepSchedule;

    @Column(name = "wake_schedule")
    private String wakeSchedule;

    @Column(columnDefinition = "json")
    private String vibes;

    @Column(name = "cleanliness_level")
    private Integer cleanlinessLevel;

    @Column(name = "noise_tolerance")
    private Integer noiseTolerance;

    @Column(name = "remaining_leave_days", columnDefinition = "integer default 60")
    private Integer remainingLeaveDays;
}
