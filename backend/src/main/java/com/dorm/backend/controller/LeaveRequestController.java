package com.dorm.backend.controller;

import com.dorm.backend.model.LeaveRequest;
import com.dorm.backend.repository.LeaveRequestRepository;
import com.dorm.backend.service.LeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestService service;

    // Eklediğimiz Repository bağımlılığı
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @GetMapping
    public List<LeaveRequest> getAll() {
        return service.getAllLeaveRequests();
    }

    // İzin durumunu güncellemek için eklenen PUT metodu
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        Optional<LeaveRequest> requestOpt = leaveRequestRepository.findById(id);

        if (requestOpt.isPresent()) {
            LeaveRequest req = requestOpt.get();
            // String olarak gelen durumu Enum'a çevirip kaydediyoruz
            req.setStatus(LeaveRequest.LeaveStatus.valueOf(status));
            leaveRequestRepository.save(req);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> deleteLeave(@PathVariable Long id) {
        leaveRequestRepository.deleteById(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }
}