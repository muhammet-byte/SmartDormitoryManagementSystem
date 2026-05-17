package com.dorm.backend.controller;

import com.dorm.backend.model.Payment;
import com.dorm.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {
    @Autowired
    private PaymentService service;

    @GetMapping
    public List<Payment> getAll() {
        return service.getAllPayments();
    }

    // Öğrencinin kendi paneli için ödemelerini çektiği uç
    @GetMapping("/me/{userId}")
    public ResponseEntity<?> getMyPayments(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getPaymentsByUserId(userId));
    }

    // Ödeme yapma (Kredi Kartı) simülasyon ucu
    @PutMapping("/{id}/pay")
    public ResponseEntity<?> payInvoice(@PathVariable Long id) {
        try {
            service.payInvoice(id);
            return ResponseEntity.ok().body(Map.of("message", "Ödeme başarıyla alındı!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ödeme başarısız: " + e.getMessage());
        }
    }
}