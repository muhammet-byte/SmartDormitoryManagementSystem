package com.dorm.backend.controller;

import com.dorm.backend.model.MaintenanceRequest;
import com.dorm.backend.model.Room;
import com.dorm.backend.model.User;
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

    @GetMapping
    public List<MaintenanceRequest> getAllRequests() {
        return maintenanceRequestRepository.findAll();
    }

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

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody Map<String, Object> payload) {
        System.out.println("GELEN ARIZA TALEBİ VERİLERİ: " + payload); // Ne geldiğini konsola yazdır

        try {
            MaintenanceRequest newRequest = new MaintenanceRequest();

            // 1. Tip Kontrolü (REPAIR veya COMPLAINT)
            if (payload.containsKey("type") && payload.get("type") != null) {
                newRequest.setType(MaintenanceRequest.RequestType.valueOf(payload.get("type").toString()));
            } else {
                throw new IllegalArgumentException("Arıza tipi (type) boş olamaz!");
            }

            // 2. Açıklama Kontrolü
            if (payload.containsKey("description") && payload.get("description") != null) {
                newRequest.setDescription(payload.get("description").toString());
            } else {
                throw new IllegalArgumentException("Açıklama (description) boş olamaz!");
            }

            // 3. Varsayılan Değerler
            newRequest.setStatus(MaintenanceRequest.RequestStatus.PENDING);
            newRequest.setPriority(MaintenanceRequest.Priority.MEDIUM);

            // 4. Kullanıcı (Öğrenci) ID Kontrolü
            if (payload.containsKey("userId") && payload.get("userId") != null) {
                User actualUser = new User();
                actualUser.setId(Long.valueOf(payload.get("userId").toString()));
                newRequest.setStudent(actualUser);
            } else {
                throw new IllegalArgumentException("Öğrenci ID (userId) boş olamaz!");
            }

            // 5. Oda ID Kontrolü (Eğer oda yoksa bile null olarak kaydeder, çökmez)
            if (payload.containsKey("roomId") && payload.get("roomId") != null) {
                Room actualRoom = new Room();
                actualRoom.setId(Long.valueOf(payload.get("roomId").toString()));
                newRequest.setRoom(actualRoom);
            }

            maintenanceRequestRepository.save(newRequest);
            System.out.println("Arıza talebi BAŞARIYLA kaydedildi.");
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            System.err.println("❌ ARIZA KAYIT HATASI: " + e.getMessage());
            e.printStackTrace();
            // Hatayı Frontend'e (React'e) Türkçe olarak gönder
            return ResponseEntity.badRequest().body("Kayıt Başarısız: " + e.getMessage());
        }
    }

    // ÖĞRENCİNİN KENDİ GEÇMİŞ TALEPLERİNİ GETİRİR
    @GetMapping("/student/{userId}")
    public ResponseEntity<?> getStudentRequests(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(maintenanceRequestRepository.findByStudentId(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Veriler çekilemedi: " + e.getMessage());
        }
    }
}