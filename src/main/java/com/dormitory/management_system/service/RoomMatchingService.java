package com.dormitory.management_system.service;

import com.dormitory.management_system.dto.RoomMatchResponse;
import com.dormitory.management_system.entity.Room;
import com.dormitory.management_system.entity.Student;
import com.dormitory.management_system.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomMatchingService {

    private final RoomRepository roomRepository;

    public RoomMatchingService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<RoomMatchResponse> findBestMatches(Student newStudent) {
        List<Room> allRooms = roomRepository.findAll();
        List<RoomMatchResponse> matchedRooms = new ArrayList<>();

        for (Room room : allRooms) {
            if (room.getCurrentOccupancy() >= room.getCapacity()) {
                continue;
            }

            int matchScore = 0;
            int availableBeds = room.getCapacity() - room.getCurrentOccupancy();

            if (room.getCurrentOccupancy() == 0) {
                matchScore = 100;
            } else {
                matchScore = calculateAlgorithmScore(newStudent, room);
            }

            matchedRooms.add(new RoomMatchResponse(
                    room.getId(),
                    room.getRoomNumber(),
                    matchScore,
                    availableBeds
            ));
        }

        return matchedRooms.stream()
                .sorted(Comparator.comparingInt(RoomMatchResponse::getMatchScore).reversed())
                .collect(Collectors.toList());
    }

    private int calculateAlgorithmScore(Student newStudent, Room room) {
        // RoomMatchingService.java içinde metodun en başına ekle:
        if (newStudent.getNoiseLevel() == null) {
            // Eğer veritabanında boşsa varsayılan olarak 3 (orta) kabul et
            newStudent.setNoiseLevel(3);
        }
// Aynı şeyi diğer alanlar için de yapabilirsin
        if (newStudent.getBedTime() == null) newStudent.setBedTime("12 AM");
        int totalScore = 0;

        // 1. Bölüm Puanı (Sabit simülasyon)
        totalScore += 10;

        // --- DİKKAT: Metin olan saatleri sayıya çeviriyoruz ---
        int studentBedTime = parseTimeToInteger(newStudent.getBedTime());
        int studentWakeTime = parseTimeToInteger(newStudent.getWakeTime());

        // 2. Uyku Saati Farkı [Maks 30 Puan]
        int existingRoomBedTime = 24; // Örnek: 12 AM
        int sleepDiff = Math.abs(studentBedTime - existingRoomBedTime);
        if (sleepDiff == 0) totalScore += 30;
        else if (sleepDiff <= 2) totalScore += 15;

        // 3. Uyanma Saati Farkı [Maks 30 Puan]
        int existingRoomWakeTime = 8; // Örnek: 8 AM
        int wakeDiff = Math.abs(studentWakeTime - existingRoomWakeTime);
        if (wakeDiff == 0) totalScore += 30;
        else if (wakeDiff <= 2) totalScore += 15;

        // 4. Gürültü Toleransı [Maks 10 Puan] (İsim: noiseLevel olarak güncellendi)
        int existingNoise = 3;
        int noiseDiff = Math.abs(newStudent.getNoiseLevel() - existingNoise);
        totalScore += (10 - (noiseDiff * 2));

        // 5. Mutfak Kullanımı [Maks 10 Puan]
        int existingKitchen = 2;
        int newKitchen = newStudent.getKitchenUsage();

        if (existingKitchen == 3 && newKitchen == 3) {
            totalScore += 0;
        } else if (existingKitchen == 1 && newKitchen == 1) {
            totalScore += 10;
        } else if (Math.abs(existingKitchen - newKitchen) == 2) {
            totalScore += 10;
        } else {
            totalScore += 5;
        }

        if (totalScore > 100) return 100;
        if (totalScore < 0) return 0;

        return totalScore;
    }

    /**
     * Yardımcı Metot: "10 PM" veya "2 AM" gibi String değerleri
     * matematiksel işlem için 1-24 arası tam sayıya çevirir.
     */
    private int parseTimeToInteger(String timeStr) {
        if (timeStr == null || timeStr.isEmpty()) return 24;
        try {
            String cleanTime = timeStr.toUpperCase().trim().replace(" ", "");
            if (cleanTime.contains("AM")) {
                int val = Integer.parseInt(cleanTime.replace("AM", ""));
                return (val == 12) ? 24 : val;
            } else if (cleanTime.contains("PM")) {
                int val = Integer.parseInt(cleanTime.replace("PM", ""));
                return (val == 12) ? 12 : val + 12;
            }
            return Integer.parseInt(cleanTime.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return 24; // Hata durumunda varsayılan gece yarısı
        }
    }
}