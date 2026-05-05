package com.dorm.backend.repository;

import com.dorm.backend.model.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByStudentId(Long studentId);

    List<MaintenanceRequest> findByStatus(MaintenanceRequest.RequestStatus status);

    List<MaintenanceRequest> OrderByPriorityDescCreatedAtDesc();
}
