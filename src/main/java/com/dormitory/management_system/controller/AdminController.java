package com.dormitory.management_system.controller;

import com.dormitory.management_system.dto.AdminStatsResponse;
import com.dormitory.management_system.entity.Room;
import com.dormitory.management_system.repository.RoomRepository;
import com.dormitory.management_system.repository.RoomRequestRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final RoomRepository roomRepository;
    private final RoomRequestRepository requestRepository;

    public AdminController(RoomRepository roomRepository, RoomRequestRepository requestRepository) {
        this.roomRepository = roomRepository;
        this.requestRepository = requestRepository;
    }

    @GetMapping("/stats")
    public AdminStatsResponse getStats() {
        List<Room> allRooms = roomRepository.findAll();

        long totalRooms = allRooms.size();
        int totalCapacity = allRooms.stream().mapToInt(Room::getCapacity).sum();
        int occupiedBeds = allRooms.stream().mapToInt(Room::getCurrentOccupancy).sum();
        int emptyBeds = totalCapacity - occupiedBeds;

        // PENDING durumundaki isteklerin sayısını çek
        long pendingRequests = requestRepository.findAll().stream()
                .filter(r -> "PENDING".equals(r.getStatus())).count();

        return new AdminStatsResponse(occupiedBeds, totalRooms, totalCapacity, emptyBeds, pendingRequests);
    }
}