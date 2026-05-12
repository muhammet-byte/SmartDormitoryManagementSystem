package com.dorm.backend.service;

import com.dorm.backend.model.StudentDetails;
import com.dorm.backend.repository.StudentDetailsRepository;
import com.dorm.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentDetailsRepository studentDetailsRepository;

    @Autowired
    private UserRepository userRepository;

    // Tüm öğrencileri ve bağlı oldukları oda/kullanıcı bilgilerini getirir
    public List<StudentDetails> getAllStudents() {
        return studentDetailsRepository.findAll();
    }

    // Öğrenciyi sistemden siler (Kullanıcı silindiğinde veritabanındaki cascade
    // ayarı sayesinde tüm detayları da silinir)
    public void deleteStudent(Long id) {
        userRepository.deleteById(id);
    }

    public StudentDetails getStudentByUserId(Long userId) {
        return studentDetailsRepository.findByUserId(userId).orElse(null);
    }

    public List<StudentDetails> getRoommates(Long roomId, Long currentStudentId) {
        return studentDetailsRepository.findByRoomId(roomId)
                .stream()
                .filter(s -> !s.getUserId().equals(currentStudentId))
                .collect(Collectors.toList());
    }
}