package com.dorm.backend.controller;

import com.dorm.backend.model.*;
import com.dorm.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/room-change")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomChangeController {

    @Autowired
    private RoomChangeRequestRepository requestRepository;
    @Autowired
    private StudentDetailsRepository studentDetailsRepository;

    @PostMapping("/request")
    public ResponseEntity<?> createRequest(@RequestBody Map<String, Object> payload) {
        try {
            RoomChangeRequest request = new RoomChangeRequest();

            User student = new User();
            student.setId(Long.valueOf(payload.get("userId").toString()));
            request.setStudent(student);

            Room room = new Room();
            room.setId(Long.valueOf(payload.get("roomId").toString()));
            request.setRequestedRoom(room);

            requestRepository.save(request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Talep oluşturulamadı: " + e.getMessage());
        }
    }

    // 🌟 SİHİRLİ KISIM: JSON Kısır Döngüsünü engellemek için veriyi Frontend'in
    // istediği gibi nokta atışı hazırlıyoruz
    @GetMapping("/all")
    public ResponseEntity<?> getAllRequests() {
        List<Map<String, Object>> result = requestRepository.findAll().stream().map(req -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", req.getId());
            map.put("status", req.getStatus().name());
            map.put("createdAt", req.getCreatedAt().toString());

            Map<String, Object> studentMap = new HashMap<>();
            if (req.getStudent() != null) {
                studentMap.put("firstName", req.getStudent().getFirstName());
                studentMap.put("lastName", req.getStudent().getLastName());
            }
            map.put("student", studentMap);

            Map<String, Object> roomMap = new HashMap<>();
            if (req.getRequestedRoom() != null) {
                roomMap.put("roomNumber", req.getRequestedRoom().getRoomNumber());
                Map<String, Object> blockMap = new HashMap<>();
                if (req.getRequestedRoom().getBlock() != null) {
                    blockMap.put("blockNumber", req.getRequestedRoom().getBlock().getBlockNumber());
                }
                roomMap.put("block", blockMap);
            }
            map.put("requestedRoom", roomMap);

            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable Long id) {
        try {
            RoomChangeRequest request = requestRepository.findById(id).orElseThrow();
            Room newRoom = request.getRequestedRoom();

            StudentDetails details = studentDetailsRepository.findById(request.getStudent().getId()).orElseThrow();

            List<StudentDetails> roomOccupants = studentDetailsRepository.findAll().stream()
                    .filter(s -> s.getRoom() != null && s.getRoom().getId().equals(newRoom.getId()))
                    .collect(Collectors.toList());

            int assignedBed = 1;
            if (roomOccupants.size() == 1) {
                assignedBed = roomOccupants.get(0).getBedNumber() == 1 ? 2 : 1;
            } else if (roomOccupants.size() >= 2) {
                return ResponseEntity.badRequest().body("Bu oda tam kapasite dolu!");
            }

            details.setRoom(newRoom);
            details.setBedNumber(assignedBed);
            studentDetailsRepository.save(details);

            request.setStatus(RoomChangeRequest.RequestStatus.APPROVED);
            requestRepository.save(request);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Onaylama başarısız: " + e.getMessage());
        }
    }
}