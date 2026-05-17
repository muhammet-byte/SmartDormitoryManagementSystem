package com.dorm.backend.controller;

import com.dorm.backend.model.Room;
import com.dorm.backend.model.StudentDetails;
import com.dorm.backend.repository.RoomRepository;
import com.dorm.backend.repository.StudentDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/match")
@CrossOrigin(origins = "http://localhost:5173")
public class MatchController {

    @Autowired
    private StudentDetailsRepository studentDetailsRepository;

    @Autowired
    private RoomRepository roomRepository;

    @PostMapping("/find")
    public ResponseEntity<?> findBestMatches(@RequestBody MatchRequest request) {
        try {
            List<StudentDetails> allStudents = studentDetailsRepository.findAll();
            List<MatchResponse> matchedRooms = new ArrayList<>();

            // 1. ADIM: Odalardaki güncel doluluk oranını hesapla
            Map<Long, Long> roomOccupancy = allStudents.stream()
                    .filter(s -> s.getRoom() != null)
                    .collect(Collectors.groupingBy(s -> s.getRoom().getId(), Collectors.counting()));

            // 2. ADIM: İsteği atan öğrencinin mevcut odasını tespit et (Kendine kendi odasını önerme)
            Long currentRoomId = null;
            if (request.getUserId() != null) {
                currentRoomId = allStudents.stream()
                        .filter(s -> s.getUser() != null && s.getUser().getId().equals(request.getUserId()) && s.getRoom() != null)
                        .map(s -> s.getRoom().getId())
                        .findFirst().orElse(null);
            }

            // 3. ADIM: Oda Arkadaşı Adaylarını Puanla
            for (StudentDetails student : allStudents) {
                // Temel Filtreler: Odası yoksa, istek atan kişinin kendisiyse veya kendi odasıysa atla
                if (student.getRoom() == null) continue;
                if (student.getUser() == null) continue;

                Long roomId = student.getRoom().getId();
                if (roomId.equals(currentRoomId)) continue;
                if (request.getUserId() != null && student.getUser().getId().equals(request.getUserId())) continue;

                // 🛑 KRİTİK KORUMA: Oda zaten 2 kişiyle tam kapasite doluysa asla önerme!
                if (roomOccupancy.getOrDefault(roomId, 0L) >= 2) continue;

                // --- Akıllı Puanlama Algoritması ---
                int score = 0;
                List<String> commonVibes = new ArrayList<>();

                // Uyku Düzeni Kontrolü (+25'er Puan)
                if (student.getSleepSchedule() != null && student.getSleepSchedule().equals(request.getSleepSchedule())) {
                    score += 25;
                }
                if (student.getWakeSchedule() != null && student.getWakeSchedule().equals(request.getWakeSchedule())) {
                    score += 25;
                }

                // Titizlik Derecesi Kontrolü (Maks 20 Puan)
                if (student.getCleanlinessLevel() != null) {
                    int cleanDiff = Math.abs(student.getCleanlinessLevel() - request.getCleanlinessLevel());
                    score += Math.max(0, 20 - (cleanDiff * 5));
                }

                // Ses Toleransı Kontrolü (Maks 20 Puan)
                if (student.getNoiseTolerance() != null) {
                    int noiseDiff = Math.abs(student.getNoiseTolerance() - request.getNoiseTolerance());
                    score += Math.max(0, 20 - (noiseDiff * 5));
                }

                // İlgi Alanları (Vibes) Eşleşmesi (Her ortak hobi için +10 Puan)
                if (student.getVibes() != null && request.getVibes() != null) {
                    String studentVibes = student.getVibes();
                    for (String vibe : request.getVibes()) {
                        if (studentVibes.contains(vibe)) {
                            score += 10;
                            commonVibes.add(vibe);
                        }
                    }
                }

                // Puan Sınırlandırması (%10 ile %98 arası daha gerçekçi bir AI izlenimi verir)
                score = Math.max(10, Math.min(score, 98));

                // Yanıt Objesini Doldur
                MatchResponse res = new MatchResponse();
                res.setRoomId(roomId);
                res.setMatchPercentage(score);

                // Blok ve Oda Numarasını güvenli şekilde birleştir
                String blockNum = (student.getRoom().getBlock() != null) ? String.valueOf(student.getRoom().getBlock().getBlockNumber()) : "?";
                res.setRoomNumber(blockNum + ". Blok - Oda " + student.getRoom().getRoomNumber());

                // İsim Gizleme (Örn: Ali G.)
                String lastName = student.getUser().getLastName() != null ? student.getUser().getLastName() : "";
                String maskedLastName = lastName.isEmpty() ? "" : lastName.substring(0, 1) + ".";
                res.setRoommateName(student.getUser().getFirstName() + " " + maskedLastName);

                res.setCommonVibes(commonVibes);
                matchedRooms.add(res);
            }

            // 4. ADIM: Sadece %50 ve üzeri uyumlu olan en iyi 10 odayı yüksek puandan düşüğe sırala
            List<MatchResponse> topMatched = matchedRooms.stream()
                    .filter(m -> m.getMatchPercentage() >= 50)
                    .sorted((a, b) -> Integer.compare(b.getMatchPercentage(), a.getMatchPercentage()))
                    .limit(10)
                    .collect(Collectors.toList());

            // 5. ADIM: Tamamen Boş Odaları Filtrele
            List<Room> allRooms = roomRepository.findAll();
            List<MatchResponse> emptyRooms = allRooms.stream()
                    .filter(r -> !roomOccupancy.containsKey(r.getId())) // Odada hiç kayıt yoksa tamamen boştur
                    .limit(10)
                    .map(r -> {
                        MatchResponse res = new MatchResponse();
                        res.setRoomId(r.getId());
                        res.setMatchPercentage(100);
                        String blockNum = (r.getBlock() != null) ? String.valueOf(r.getBlock().getBlockNumber()) : "?";
                        res.setRoomNumber(blockNum + ". Blok - Oda " + r.getRoomNumber());
                        res.setRoommateName("Tamamen Boş Oda");
                        res.setCommonVibes(new ArrayList<>());
                        return res;
                    })
                    .collect(Collectors.toList());

            // Sonuçları sarmalla ve Frontend'e fırlat
            MatchResultData result = new MatchResultData();
            result.setMatchedRooms(topMatched);
            result.setEmptyRooms(emptyRooms);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Eşleştirme hesaplanırken hata oluştu: " + e.getMessage());
        }
    }

    // --- DTO Sınıfları (Veri Transfer Objeleri) ---
    public static class MatchRequest {
        private Long userId;
        private String sleepSchedule;
        private String wakeSchedule;
        private int cleanlinessLevel;
        private int noiseTolerance;
        private List<String> vibes;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getSleepSchedule() { return sleepSchedule; }
        public void setSleepSchedule(String sleepSchedule) { this.sleepSchedule = sleepSchedule; }
        public String getWakeSchedule() { return wakeSchedule; }
        public void setWakeSchedule(String wakeSchedule) { this.wakeSchedule = wakeSchedule; }
        public int getCleanlinessLevel() { return cleanlinessLevel; }
        public void setCleanlinessLevel(int cleanlinessLevel) { this.cleanlinessLevel = cleanlinessLevel; }
        public int getNoiseTolerance() { return noiseTolerance; }
        public void setNoiseTolerance(int noiseTolerance) { this.noiseTolerance = noiseTolerance; }
        public List<String> getVibes() { return vibes; }
        public void setVibes(List<String> vibes) { this.vibes = vibes; }
    }

    public static class MatchResponse {
        private Long roomId;
        private int matchPercentage;
        private String roomNumber;
        private String roommateName;
        private List<String> commonVibes;

        public Long getRoomId() { return roomId; }
        public void setRoomId(Long roomId) { this.roomId = roomId; }
        public int getMatchPercentage() { return matchPercentage; }
        public void setMatchPercentage(int matchPercentage) { this.matchPercentage = matchPercentage; }
        public String getRoomNumber() { return roomNumber; }
        public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
        public String getRoommateName() { return roommateName; }
        public void setRoommateName(String roommateName) { this.roommateName = roommateName; }
        public List<String> getCommonVibes() { return commonVibes; }
        public void setCommonVibes(List<String> commonVibes) { this.commonVibes = commonVibes; }
    }

    public static class MatchResultData {
        private List<MatchResponse> matchedRooms;
        private List<MatchResponse> emptyRooms;

        public List<MatchResponse> getMatchedRooms() { return matchedRooms; }
        public void setMatchedRooms(List<MatchResponse> matchedRooms) { this.matchedRooms = matchedRooms; }
        public List<MatchResponse> getEmptyRooms() { return emptyRooms; }
        public void setEmptyRooms(List<MatchResponse> emptyRooms) { this.emptyRooms = emptyRooms; }
    }
}