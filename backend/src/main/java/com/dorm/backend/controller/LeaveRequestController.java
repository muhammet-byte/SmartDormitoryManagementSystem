package com.dorm.backend.controller;

import com.dorm.backend.model.LeaveRequest;
import com.dorm.backend.model.User;
import com.dorm.backend.model.Address;
import com.dorm.backend.repository.LeaveRequestRepository;
import com.dorm.backend.repository.AddressRepository; // ADRES REPOSU EKLENDİ
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
    private AddressRepository addressRepository; // ADRES REPOSU EKLENDİ

    @PostMapping
    public ResponseEntity<?> createLeaveRequest(@RequestBody Map<String, Object> payload) {
        try {
            LeaveRequest newLeave = new LeaveRequest();

            newLeave.setStartDate(LocalDate.parse(payload.get("startDate").toString()));
            newLeave.setEndDate(LocalDate.parse(payload.get("endDate").toString()));
            newLeave.setDescription(payload.get("description").toString());
            newLeave.setStatus(LeaveRequest.LeaveStatus.PENDING);

            // Kullanıcıyı bağla
            User student = new User();
            if (payload.get("userId") != null) {
                student.setId(Long.valueOf(payload.get("userId").toString()));
                newLeave.setStudent(student);
            }

            // 🌟 SİHİRLİ KISIM: Adres yoksa sistemi çökertmek yerine geçici adres oluştur
            Long addressId = payload.get("addressId") != null ? Long.valueOf(payload.get("addressId").toString()) : 1L;

            Address address = addressRepository.findById(addressId).orElseGet(() -> {
                Address dummyAddress = new Address();
                dummyAddress.setStudent(student);
                dummyAddress.setCity("Belirtilmedi");
                dummyAddress.setFullAddress("Öğrenci adres profili oluşturmadan izin talep etti.");
                return addressRepository.save(dummyAddress); // Veritabanına anında kaydet
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

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateLeaveStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            LeaveRequest leave = leaveRequestRepository.findById(id).orElseThrow();
            leave.setStatus(LeaveRequest.LeaveStatus.valueOf(payload.get("status")));
            leaveRequestRepository.save(leave);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}