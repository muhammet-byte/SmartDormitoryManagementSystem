package com.dorm.backend.controller;

import com.dorm.backend.model.MaintenanceRequest;
import com.dorm.backend.repository.MaintenanceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "http://localhost:5173")
public class MaintenanceController {

    @Autowired
    private MaintenanceRequestRepository maintenanceRequestRepository;

    // Tüm bakım taleplerini getir (GET)
    @GetMapping
    public List<MaintenanceRequest> getAll() {
        return maintenanceRequestRepository.findAll();
    }

    // Durumu güncelle (PUT)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<MaintenanceRequest> requestOpt = maintenanceRequestRepository.findById(id);
        if (requestOpt.isPresent()) {
            MaintenanceRequest req = requestOpt.get();
            req.setStatus(MaintenanceRequest.RequestStatus.valueOf(payload.get("status")));
            maintenanceRequestRepository.save(req);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Yeni bakım talebi oluştur (POST)
    @PostMapping
    public ResponseEntity<MaintenanceRequest> createRequest(@RequestBody MaintenanceRequest newRequest) {
        // Admin tarafından oluşturulduğu için varsayılan değerleri atıyoruz
        newRequest.setStatus(MaintenanceRequest.RequestStatus.PENDING);
        newRequest.setType(MaintenanceRequest.RequestType.REPAIR); // Yönetici genellikle arıza kaydı açar

        // Şimdilik test amaçlı admin hesabı (ID: 77) veya sistem olarak bağlıyoruz.
        // İleride Login/Auth yapıldığında burası dinamikleşecek.
        com.dorm.backend.model.User systemUser = new com.dorm.backend.model.User();
        systemUser.setId(77L); // init.sql'de Admin'i 77 ID ile kurmuştuk
        newRequest.setStudent(systemUser);

        MaintenanceRequest savedRequest = maintenanceRequestRepository.save(newRequest);
        return ResponseEntity.ok(savedRequest);
    }
}