package com.dormitory.management_system.entity; // Paket adın farklıysa seninkini bırak

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String blockName;     // A, B, C, D, E, F, G, H
    private int floorNumber;      // 1 veya 2
    private String roomNumber;    // Örn: "A-101", "B-202"

    private int capacity = 4;     // Yurdunuzdaki sabit kural (4 kişilik)
    private int currentOccupancy = 0; // Oda ilk açıldığında boş (0 kişi)

    // --- Constructor (Kurucu Metot) ---
    public Room() {
    }

    public Room(String blockName, int floorNumber, String roomNumber) {
        this.blockName = blockName;
        this.floorNumber = floorNumber;
        this.roomNumber = roomNumber;
    }

    // --- Getter ve Setter Metotları ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBlockName() { return blockName; }
    public void setBlockName(String blockName) { this.blockName = blockName; }

    public int getFloorNumber() { return floorNumber; }
    public void setFloorNumber(int floorNumber) { this.floorNumber = floorNumber; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public int getCurrentOccupancy() { return currentOccupancy; }
    public void setCurrentOccupancy(int currentOccupancy) { this.currentOccupancy = currentOccupancy; }
}