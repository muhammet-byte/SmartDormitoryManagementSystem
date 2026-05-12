package com.dorm.backend.controller;

import com.dorm.backend.model.LeaveRequest;
import com.dorm.backend.model.MaintenanceRequest;
import com.dorm.backend.repository.LeaveRequestRepository;
import com.dorm.backend.repository.MaintenanceRequestRepository;
import com.dorm.backend.repository.StudentDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;
    @Autowired
    private MaintenanceRequestRepository maintenanceRequestRepository;
    @Autowired
    private StudentDetailsRepository studentDetailsRepository;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Bekleyen izinleri sayıyoruz
        long pendingLeaves = leaveRequestRepository.findAll().stream()
                .filter(l -> l.getStatus() == LeaveRequest.LeaveStatus.PENDING).count();

        // Bekleyen arıza ve şikayetleri sayıyoruz
        long pendingMaintenance = maintenanceRequestRepository.findAll().stream()
                .filter(m -> m.getStatus() == MaintenanceRequest.RequestStatus.PENDING).count();

        // Toplam yerleşmiş öğrenci sayısını alıyoruz
        long totalStudents = studentDetailsRepository.count();

        // Şimdilik toplam kapasiteyi (128 Oda * 2 = 256) statik verebiliriz,
        // ileride RoomRepository üzerinden dinamik çekilebilir.
        long totalCapacity = 256;

        stats.put("pendingLeaves", pendingLeaves);
        stats.put("pendingMaintenance", pendingMaintenance);
        stats.put("totalStudents", totalStudents);
        stats.put("occupancyRate", (int) ((totalStudents * 100.0) / totalCapacity));

        return ResponseEntity.ok(stats);
    }
}
