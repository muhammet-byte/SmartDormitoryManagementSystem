package com.dormitory.management_system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(name = "student_number")
    private String studentNumber;

    @Column(name = "department")
    private String department;

    @Column(name = "sleep_time")
    private Integer sleepTime;

    @Column(name = "wake_up_time")
    private Integer wakeUpTime;

    @Column(name = "cleanliness_score")
    private Integer cleanlinessScore;

    @Column(name = "noise_tolerance")
    private Integer noiseTolerance;

    @Column(name = "kitchen_usage")
    private Integer kitchenUsage;

    // Getter ve Setter Metotları
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getStudentNumber() { return studentNumber; }
    public void setStudentNumber(String studentNumber) { this.studentNumber = studentNumber; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getSleepTime() { return sleepTime; }
    public void setSleepTime(Integer sleepTime) { this.sleepTime = sleepTime; }

    public Integer getWakeUpTime() { return wakeUpTime; }
    public void setWakeUpTime(Integer wakeUpTime) { this.wakeUpTime = wakeUpTime; }

    public Integer getCleanlinessScore() { return cleanlinessScore; }
    public void setCleanlinessScore(Integer cleanlinessScore) { this.cleanlinessScore = cleanlinessScore; }

    public Integer getNoiseTolerance() { return noiseTolerance; }
    public void setNoiseTolerance(Integer noiseTolerance) { this.noiseTolerance = noiseTolerance; }

    public Integer getKitchenUsage() { return kitchenUsage; }
    public void setKitchenUsage(Integer kitchenUsage) { this.kitchenUsage = kitchenUsage; }
}