package com.dormitory.management_system.repository;

import com.dormitory.management_system.entity.RoomRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRequestRepository extends JpaRepository<RoomRequest, Long> {
}