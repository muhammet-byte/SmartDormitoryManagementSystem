package com.dorm.backend.repository;

import com.dorm.backend.model.StudentDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentDetailsRepository extends JpaRepository<StudentDetails, Long> {
    List<StudentDetails> findByRoomId(Long roomId);
}
