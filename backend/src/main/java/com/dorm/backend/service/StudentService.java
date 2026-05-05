package com.dorm.backend.service;

import com.dorm.backend.model.StudentDetails;
import com.dorm.backend.repository.StudentDetailsRepository;
import com.dorm.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
}