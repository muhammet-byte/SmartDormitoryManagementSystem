package com.dormitory.management_system.controller;

import com.dormitory.management_system.entity.Room;
import com.dormitory.management_system.entity.RoomRequest;
import com.dormitory.management_system.repository.RoomRepository;
import com.dormitory.management_system.repository.RoomRequestRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomRequestController {

    private final RoomRequestRepository requestRepository;
    private final RoomRepository roomRepository;

    public RoomRequestController(RoomRequestRepository requestRepository, RoomRepository roomRepository) {
        this.requestRepository = requestRepository;
        this.roomRepository = roomRepository;
    }

    // 1. CREATE NEW REQUEST
    @PostMapping
    public ResponseEntity<RoomRequest> createRequest(@RequestBody RoomRequest request) {
        if (request.getStatus() == null) {
            request.setStatus("PENDING");
        }
        RoomRequest savedRequest = requestRepository.save(request);
        return ResponseEntity.ok(savedRequest);
    }

    // 2. GET STUDENT'S OWN REQUEST STATUS
    @GetMapping("/my_status/{username}")
    public ResponseEntity<RoomRequest> getMyRequestStatus(@PathVariable String username) {
        return requestRepository.findAll().stream()
                .filter(r -> r.getStudentUsername() != null && r.getStudentUsername().equals(username))
                .reduce((first, second) -> second) // Get the most recent request
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(null));
    }

    // 3. LIST ALL PENDING REQUESTS (For Admin Panel)
    @GetMapping("/pending")
    public List<RoomRequest> getPendingRequests() {
        return requestRepository.findAll().stream()
                .filter(r -> "PENDING".equals(r.getStatus()))
                .collect(Collectors.toList());
    }

    // 4. APPROVE REQUEST
    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveRequest(@PathVariable Long id) {
        RoomRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        Room room = roomRepository.findById(request.getTargetRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (room.getCurrentOccupancy() < room.getCapacity()) {
            room.setCurrentOccupancy(room.getCurrentOccupancy() + 1);
            roomRepository.save(room);

            request.setStatus("APPROVED");
            requestRepository.save(request);
            return ResponseEntity.ok("Student has been successfully placed in the room.");
        } else {
            return ResponseEntity.badRequest().body("Error: The selected room is already at full capacity!");
        }
    }

    // 5. REJECT REQUEST
    @PutMapping("/{id}/reject")
    public ResponseEntity<String> rejectRequest(@PathVariable Long id) {
        RoomRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus("REJECTED");
        requestRepository.save(request);
        return ResponseEntity.ok("The request has been rejected.");
    }
}