package com.dorm.backend.controller;

import com.dorm.backend.model.Room;
import com.dorm.backend.model.StudentDetails;
import com.dorm.backend.repository.RoomRepository;
import com.dorm.backend.repository.StudentDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
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
    public MatchResultData findBestMatches(@RequestBody MatchRequest request) {
        List<StudentDetails> allStudents = studentDetailsRepository.findAll();
        List<MatchResponse> matchedRooms = new ArrayList<>();

        // --- 1. DOLU ODALAR İÇİN EŞLEŞTİRME VE PUANLAMA ---
        for (StudentDetails student : allStudents) {
            if (student.getRoom() == null)
                continue;

            int score = 0;
            List<String> commonVibes = new ArrayList<>();

            if (student.getSleepSchedule() != null && student.getSleepSchedule().equals(request.getSleepSchedule()))
                score += 20;
            if (student.getWakeSchedule() != null && student.getWakeSchedule().equals(request.getWakeSchedule()))
                score += 20;

            if (student.getCleanlinessLevel() != null) {
                int cleanDiff = Math.abs(student.getCleanlinessLevel() - request.getCleanlinessLevel());
                score += Math.max(0, 20 - (cleanDiff * 5));
            }
            if (student.getNoiseTolerance() != null) {
                int noiseDiff = Math.abs(student.getNoiseTolerance() - request.getNoiseTolerance());
                score += Math.max(0, 20 - (noiseDiff * 5));
            }

            if (student.getVibes() != null && request.getVibes() != null) {
                String studentVibes = student.getVibes();
                for (String vibe : request.getVibes()) {
                    if (studentVibes.contains(vibe)) {
                        score += 10;
                        commonVibes.add(vibe);
                    }
                }
            }

            score = Math.max(30, Math.min(score, 98));

            MatchResponse res = new MatchResponse();
            res.setRoomId(student.getRoom().getId()); // 🌟 İŞTE EKSİK OLAN HAYATİ KISIM BURASIYDI 🌟
            res.setMatchPercentage(score);
            res.setRoomNumber(student.getRoom().getBlock().getBlockNumber() + ". Blok - Oda "
                    + student.getRoom().getRoomNumber());
            res.setRoommateName(
                    student.getUser().getFirstName() + " " + student.getUser().getLastName().substring(0, 1) + ".");
            res.setCommonVibes(commonVibes);
            matchedRooms.add(res);
        }

        List<MatchResponse> topMatched = matchedRooms.stream()
                .sorted((a, b) -> Integer.compare(b.getMatchPercentage(), a.getMatchPercentage()))
                .limit(20)
                .collect(Collectors.toList());

        // --- 2. TAMAMEN BOŞ ODALARI BULMA (%100 UYUMLU) ---
        Set<Long> occupiedRoomIds = allStudents.stream()
                .filter(s -> s.getRoom() != null)
                .map(s -> s.getRoom().getId())
                .collect(Collectors.toSet());

        List<Room> allRooms = roomRepository.findAll();

        List<MatchResponse> emptyRooms = allRooms.stream()
                .filter(r -> !occupiedRoomIds.contains(r.getId()))
                .limit(20)
                .map(r -> {
                    MatchResponse res = new MatchResponse();
                    res.setRoomId(r.getId()); // 🌟 İŞTE EKSİK OLAN HAYATİ KISIM BURASIYDI 🌟
                    res.setMatchPercentage(100);
                    res.setRoomNumber(r.getBlock().getBlockNumber() + ". Blok - Oda " + r.getRoomNumber());
                    res.setRoommateName("Tamamen Boş Oda");
                    res.setCommonVibes(new ArrayList<>());
                    return res;
                })
                .collect(Collectors.toList());

        // --- 3. SONUÇLARI BİRLEŞTİRİP DÖNDÜRME ---
        MatchResultData result = new MatchResultData();
        result.setMatchedRooms(topMatched);
        result.setEmptyRooms(emptyRooms);
        return result;
    }

    // --- DTO Sınıfları ---
    public static class MatchRequest {
        private String sleepSchedule;
        private String wakeSchedule;
        private int cleanlinessLevel;
        private int noiseTolerance;
        private List<String> vibes;

        public String getSleepSchedule() {
            return sleepSchedule;
        }

        public String getWakeSchedule() {
            return wakeSchedule;
        }

        public int getCleanlinessLevel() {
            return cleanlinessLevel;
        }

        public int getNoiseTolerance() {
            return noiseTolerance;
        }

        public List<String> getVibes() {
            return vibes;
        }
    }

    public static class MatchResponse {
        private Long roomId; // 🌟 REACT'İN BEKLEDİĞİ YENİ VERİ ALANI 🌟
        private int matchPercentage;
        private String roomNumber;
        private String roommateName;
        private List<String> commonVibes;

        public Long getRoomId() {
            return roomId;
        }

        public void setRoomId(Long roomId) {
            this.roomId = roomId;
        }

        public int getMatchPercentage() {
            return matchPercentage;
        }

        public void setMatchPercentage(int matchPercentage) {
            this.matchPercentage = matchPercentage;
        }

        public String getRoomNumber() {
            return roomNumber;
        }

        public void setRoomNumber(String roomNumber) {
            this.roomNumber = roomNumber;
        }

        public String getRoommateName() {
            return roommateName;
        }

        public void setRoommateName(String roommateName) {
            this.roommateName = roommateName;
        }

        public List<String> getCommonVibes() {
            return commonVibes;
        }

        public void setCommonVibes(List<String> commonVibes) {
            this.commonVibes = commonVibes;
        }
    }

    public static class MatchResultData {
        private List<MatchResponse> matchedRooms;
        private List<MatchResponse> emptyRooms;

        public List<MatchResponse> getMatchedRooms() {
            return matchedRooms;
        }

        public void setMatchedRooms(List<MatchResponse> matchedRooms) {
            this.matchedRooms = matchedRooms;
        }

        public List<MatchResponse> getEmptyRooms() {
            return emptyRooms;
        }

        public void setEmptyRooms(List<MatchResponse> emptyRooms) {
            this.emptyRooms = emptyRooms;
        }
    }
}