package com.dorm.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "block_id", nullable = false)
    private Block block;

    @Column(name = "floor_number", nullable = false)
    private Integer floorNumber;

    @Column(name = "apartment_number", nullable = false)
    private Integer apartmentNumber;

    @Column(name = "room_number", nullable = false)
    private Integer roomNumber;

    @Column(columnDefinition = "integer default 2")
    private Integer capacity;
}