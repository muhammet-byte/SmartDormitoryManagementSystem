package com.dorm.backend.service;

import com.dorm.backend.model.Payment;
import com.dorm.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Sadece giriş yapan öğrencinin faturalarını getirir
    public List<Payment> getPaymentsByUserId(Long userId) {
        return paymentRepository.findAll().stream()
                .filter(p -> p.getStudent() != null && p.getStudent().getId().equals(userId))
                .collect(Collectors.toList());
    }

    // Fatura durumunu "PAID" (Ödendi) olarak günceller
    // Fatura durumunu "PAID" (Ödendi) olarak günceller
    public void payInvoice(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Fatura bulunamadı!"));

        // 🔥 Hatanın Çözümü: String ("PAID") yerine Enum modelini kullanıyoruz
        payment.setStatus(Payment.PaymentStatus.PAID);

        paymentRepository.save(payment);
    }
}