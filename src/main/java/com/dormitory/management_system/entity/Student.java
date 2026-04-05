package com.dormitory.management_system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Login için kritik alanlar
    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "role")
    private String role;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "department")
    private String department;

    // Veritabanındaki 'bed_time' sütunuyla eşleştiriyoruz
    @Column(name = "bed_time")
    private String bedTime;

    // Veritabanındaki 'wake_time' sütunuyla eşleştiriyoruz
    @Column(name = "wake_time")
    private String wakeTime;

    // Veritabanındaki 'noise_level' sütunuyla eşleştiriyoruz
    @Column(name = "noise_level")
    private Integer noiseLevel;

    @Column(name = "kitchen_usage")
    private Integer kitchenUsage;

    // Getter ve Setter Metotları (Sağ tık -> Generate -> Getter and Setter diyerek hepsini seçip ekle)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getBedTime() { return bedTime; }
    public void setBedTime(String bedTime) { this.bedTime = bedTime; }

    public String getWakeTime() { return wakeTime; }
    public void setWakeTime(String wakeTime) { this.wakeTime = wakeTime; }

    public Integer getNoiseLevel() { return noiseLevel; }
    public void setNoiseLevel(Integer noiseLevel) { this.noiseLevel = noiseLevel; }

    public Integer getKitchenUsage() { return kitchenUsage; }
    public void setKitchenUsage(Integer kitchenUsage) { this.kitchenUsage = kitchenUsage; }
}