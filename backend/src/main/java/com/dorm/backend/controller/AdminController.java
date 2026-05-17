package com.dorm.backend.controller;

import com.dorm.backend.model.StudentDetails;
import com.dorm.backend.repository.RoomRepository;
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
    private StudentDetailsRepository studentDetailsRepository;

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            // 1. Toplam Kayıtlı Öğrenci Sayısı (Anlık Veritabanı Sayımı)
            long registeredStudents = studentDetailsRepository.count();

            // 2. Aktif Doluluk Oranı Hesaplama
            // Odası null olmayan (bir yatağa atanmış) öğrencileri sayıyoruz
            long activeOccupants = studentDetailsRepository.findAll().stream()
                    .filter(s -> s.getRoom() != null)
                    .count();

            // Toplam yatak kapasitesi (Toplam Oda Sayısı * 2)
            long totalCapacity = roomRepository.count() * 2;

            long occupancyRate = 0;
            if (totalCapacity > 0) {
                occupancyRate = Math.round((double) activeOccupants / totalCapacity * 100);
            }

            // Verileri Frontend'in beklediği JSON formatına paketliyoruz
            Map<String, Object> stats = new HashMap<>();
            stats.put("registeredStudents", registeredStudents);
            stats.put("occupancyRate", occupancyRate);
            stats.put("pendingMaintenance", 0); // İleride arıza tablonuza göre dinamik bağlayabilirsiniz
            stats.put("pendingLeaves", 0);       // İleride izin tablonuza göre dinamik bağlayabilirsiniz

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("İstatistikler hesaplanırken hata oluştu: " + e.getMessage());
        }
    }

    // --- Mevcut Diğer Admin Metotların Varsa Aşağıya Eklemeye Devam Edebilirsin ---
}