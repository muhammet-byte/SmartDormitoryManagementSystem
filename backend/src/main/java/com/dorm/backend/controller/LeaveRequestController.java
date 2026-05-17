package com.dorm.backend.controller;

import com.dorm.backend.model.LeaveRequest;
import com.dorm.backend.model.User;
import com.dorm.backend.model.Address;
import com.dorm.backend.repository.LeaveRequestRepository;
import com.dorm.backend.repository.AddressRepository;
import com.dorm.backend.repository.UserRepository; // 🔥 1. ADIM: KULLANICI REPOSU EKLENDİ
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private UserRepository userRepository; // 🔥 2. ADIM: KULLANICI REPOSU ENJEKTE EDİLDİ

    @PostMapping
    public ResponseEntity<?> createLeaveRequest(@RequestBody Map<String, Object> payload) {
        try {
            LeaveRequest newLeave = new LeaveRequest();

            newLeave.setStartDate(LocalDate.parse(payload.get("startDate").toString()));
            newLeave.setEndDate(LocalDate.parse(payload.get("endDate").toString()));
            newLeave.setDescription(payload.get("description").toString());
            newLeave.setStatus(LeaveRequest.LeaveStatus.PENDING);

            User student = new User();
            if (payload.get("userId") != null) {
                student.setId(Long.valueOf(payload.get("userId").toString()));
                newLeave.setStudent(student);
            }

            Long addressId = payload.get("addressId") != null ? Long.valueOf(payload.get("addressId").toString()) : 1L;

            Address address = addressRepository.findById(addressId).orElseGet(() -> {
                Address dummyAddress = new Address();
                dummyAddress.setStudent(student);
                dummyAddress.setCity("Belirtilmedi");
                dummyAddress.setFullAddress("Öğrenci adres profili oluşturmadan izin talep etti.");
                return addressRepository.save(dummyAddress);
            });

            newLeave.setAddress(address);

            leaveRequestRepository.save(newLeave);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("İzin kaydı başarısız: " + e.getMessage());
        }
    }

    @GetMapping("/student/{userId}")
    public ResponseEntity<?> getStudentLeaves(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(leaveRequestRepository.findByStudentId(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Veriler çekilemedi: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllLeaves() {
        return ResponseEntity.ok(leaveRequestRepository.findAll());
    }

    // 🔥 3. ADIM: ÖĞRENCİ STATÜSÜNÜ DE DEĞİŞTİREN GÜNCEL METOT
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateLeaveStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            LeaveRequest leave = leaveRequestRepository.findById(id).orElseThrow();
            LeaveRequest.LeaveStatus targetStatus = LeaveRequest.LeaveStatus.valueOf(payload.get("status"));

            // İzin isteğinin durumunu (APPROVED / REJECTED) güncelle ve kaydet
            leave.setStatus(targetStatus);
            leaveRequestRepository.save(leave);

            // Zincirleme Reaksiyon: İzin durumu değiştikçe kullanıcının aktifliğini güncelle
            if (leave.getStudent() != null) {
                User studentUser = leave.getStudent();

                if (targetStatus == LeaveRequest.LeaveStatus.APPROVED) {
                    // İzin onaylandıysa, users tablosundaki statüyü "ON_LEAVE" (İzinde) yap
                    studentUser.setStatus("ON_LEAVE");
                } else if (targetStatus == LeaveRequest.LeaveStatus.REJECTED) {
                    // İzin reddedildiyse, öğrenciyi tekrar "ACTIVE" (Aktif) moduna çek
                    studentUser.setStatus("ACTIVE");
                }

                // Değişikliği users tablosuna yaz
                userRepository.save(studentUser);
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}