package com.dormitory.management_system.controller;

import com.dormitory.management_system.entity.Student;
import com.dormitory.management_system.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin // Ön yüz (Frontend) ile haberleşirken hata almamak için şimdiden ekliyoruz

public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    // 1. Yeni Öğrenci Ekleme Yolu (POST)
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        // Gelen öğrenci bilgisini alıp doğrudan veritabanına (repository) kaydeder.
        return studentRepository.save(student);
    }


    // 2. Tüm Öğrencileri Listeleme Yolu (GET)
    @GetMapping
    public List<Student> getAllStudents() {
        // Veritabanındaki tüm öğrencileri bulup liste olarak geri gönderir.
        return studentRepository.findAll();
    }

}