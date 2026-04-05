package com.dormitory.management_system.controller;

import com.dormitory.management_system.dto.RoomMatchResponse;
import com.dormitory.management_system.entity.Student;
import com.dormitory.management_system.service.RoomMatchingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "http://localhost:5173") // React'ın erişimine izin veriyoruz
public class RoomMatchController {

    private final RoomMatchingService roomMatchingService;

    public RoomMatchController(RoomMatchingService roomMatchingService) {
        this.roomMatchingService = roomMatchingService;
    }

    @PostMapping
    public ResponseEntity<List<RoomMatchResponse>> getBestMatches(@RequestBody Student studentPreferences) {
        // Tercihleri al, yapay zekaya (algoritmaya) gönder ve tüm odaları sıralı şekilde geri dön
        List<RoomMatchResponse> matches = roomMatchingService.findBestMatches(studentPreferences);
        return ResponseEntity.ok(matches);
    }
}