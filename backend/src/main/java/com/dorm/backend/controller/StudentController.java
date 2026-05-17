package com.dorm.backend.controller;

import com.dorm.backend.model.Payment;
import com.dorm.backend.model.Role;
import com.dorm.backend.model.StudentDetails;
import com.dorm.backend.model.User;
import com.dorm.backend.repository.PaymentRepository;
import com.dorm.backend.repository.StudentDetailsRepository;
import com.dorm.backend.repository.UserRepository;
import com.dorm.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    @Autowired
    private StudentService service;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentDetailsRepository studentDetailsRepository;

    // 🔥 Fatura kesebilmek için Payment deposunu çağırdık
    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping
    public List<StudentDetails> getAll() {
        return service.getAllStudents();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        service.deleteStudent(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me/{userId}")
    public ResponseEntity<?> getMyInfo(@PathVariable Long userId) {
        StudentDetails student = service.getStudentByUserId(userId);
        if (student == null)
            return ResponseEntity.notFound().build();

        Map<String, Object> data = new HashMap<>();
        data.put("profile", student);

        if (student.getRoom() != null) {
            data.put("roommates", service.getRoommates(student.getRoom().getId(), student.getUserId()));
        }

        return ResponseEntity.ok(data);
    }

    @PostMapping
    public ResponseEntity<?> addStudent(@RequestBody Map<String, Object> payload) {
        try {
            User newUser = new User();
            newUser.setFirstName(payload.get("firstName").toString().trim());
            newUser.setLastName(payload.get("lastName").toString().trim());
            newUser.setPhone(payload.get("phone").toString());
            newUser.setRole(Role.STUDENT);
            newUser.setStatus("ACTIVE");

            newUser.setPassword("1234");
            newUser.setEmail(UUID.randomUUID().toString() + "@temp.com");
            User savedUser = userRepository.save(newUser);

            String finalEmail = "ogrenci" + savedUser.getId() + "@smartdorm.com";
            savedUser.setEmail(finalEmail);
            userRepository.save(savedUser);

            StudentDetails studentDetails = new StudentDetails();
            studentDetails.setUser(savedUser);
            studentDetails.setUniversity(payload.get("university").toString());
            studentDetails.setDepartment(payload.get("department").toString());
            studentDetails.setRoom(null);
            studentDetailsRepository.save(studentDetails);

            // 🔥 OTOMATİK BORÇLANDIRMA (5.500 ₺)
            // 🔥 OTOMATİK BORÇLANDIRMA (5.500 ₺)
            Payment firstPayment = new Payment();
            firstPayment.setStudent(savedUser);
            firstPayment.setInvoiceNo("INV-2026-" + savedUser.getId());

            // 1. Hatanın Çözümü: String yerine PaymentType Enum'u kullanıyoruz
            firstPayment.setPaymentType(Payment.PaymentType.MONTHLY_INSTALLMENT);

            // 2. Hatanın Çözümü: Double yerine BigDecimal kullanıyoruz
            firstPayment.setExpectedAmount(java.math.BigDecimal.valueOf(5500.0));

            // 3. Hatanın Çözümü: String yerine PaymentStatus Enum'u kullanıyoruz
            firstPayment.setStatus(Payment.PaymentStatus.PENDING);

            // 4. Hatanın Çözümü: java.sql.Date yerine doğrudan java.time.LocalDate kullanıyoruz
            firstPayment.setDueDate(java.time.LocalDate.now().plusDays(15));

            paymentRepository.save(firstPayment);

            return ResponseEntity.ok().body(Map.of(
                    "message", "Öğrenci başarıyla eklendi ve ilk faturası kesildi.",
                    "generatedEmail", finalEmail
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Kayıt başarısız: " + e.getMessage()));
        }
    }
}