package com.dorm.backend.controller;

import com.dorm.backend.model.Payment;
import com.dorm.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
}
