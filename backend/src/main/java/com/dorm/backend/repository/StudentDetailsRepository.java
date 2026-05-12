package com.dorm.backend.repository;

import com.dorm.backend.model.StudentDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentDetailsRepository extends JpaRepository<StudentDetails, Long> {
    // Kullanıcı ID'sine göre öğrenciyi ve oda bilgilerini getirir
    Optional<StudentDetails> findByUserId(Long userId);

    // Oda ID'sine göre o odadaki tüm öğrencileri getirir (Arkadaşları bulmak için)
    List<StudentDetails> findByRoomId(Long roomId);
}
