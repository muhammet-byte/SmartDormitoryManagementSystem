package com.dorm.backend.controller;

import com.dorm.backend.model.StudentDetails;
import com.dorm.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    @Autowired
    private StudentService service;

    @GetMapping
    public List<StudentDetails> getAll() {
        return service.getAllStudents();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        service.deleteStudent(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me/{userId}")
    public ResponseEntity<?> getMyInfo(@PathVariable Long userId) {
        StudentDetails student = service.getStudentByUserId(userId);
        if (student == null)
            return ResponseEntity.notFound().build();

        Map<String, Object> data = new HashMap<>();
        data.put("profile", student);

        if (student.getRoom() != null) {
            // Oda arkadaşını bul
            data.put("roommates", service.getRoommates(student.getRoom().getId(), student.getUserId()));
        }

        return ResponseEntity.ok(data);
    }
}