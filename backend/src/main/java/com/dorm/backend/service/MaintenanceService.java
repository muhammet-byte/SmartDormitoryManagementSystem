package com.dorm.backend.service;

import com.dorm.backend.model.MaintenanceRequest;
import com.dorm.backend.repository.MaintenanceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRequestRepository repository;

    // Tüm talepleri getir (Önceliğe ve tarihe göre sıralı - Yönetici için)
    public List<MaintenanceRequest> getAllRequests() {
        return repository.OrderByPriorityDescCreatedAtDesc();
    }

    // Belirli bir öğrencinin taleplerini getir
    public List<MaintenanceRequest> getRequestsByStudent(Long studentId) {
        return repository.findByStudentId(studentId);
    }

    // Yeni talep oluştur (Öğrenci veya Yönetici)
    public MaintenanceRequest createRequest(MaintenanceRequest request) {
        return repository.save(request);
    }

    // Talebin durumunu ve detaylarını güncelle (Yönetici atamaları için)
    public MaintenanceRequest updateRequest(Long id, MaintenanceRequest updatedRequest) {
        Optional<MaintenanceRequest> existingRequest = repository.findById(id);
        if (existingRequest.isPresent()) {
            MaintenanceRequest req = existingRequest.get();
            req.setStatus(updatedRequest.getStatus());
            req.setAdminResponse(updatedRequest.getAdminResponse());
            req.setAssignedTo(updatedRequest.getAssignedTo());
            req.setEstimatedTime(updatedRequest.getEstimatedTime());
            return repository.save(req);
        }
        return null;
    }
}