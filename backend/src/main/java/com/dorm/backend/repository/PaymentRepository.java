package com.dorm.backend.repository;

import com.dorm.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStudentId(Long studentId);

    Optional<Payment> findByInvoiceNo(String invoiceNo);

    List<Payment> findByStatus(Payment.PaymentStatus status);
}
