package com.dorm.backend.repository;

import com.dorm.backend.model.RoomChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomChangeRequestRepository extends JpaRepository<RoomChangeRequest, Long> {
}