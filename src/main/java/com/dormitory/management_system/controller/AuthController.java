package com.dormitory.management_system.controller;

import com.dormitory.management_system.entity.User;
import com.dormitory.management_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin // React ile sorunsuz konuşmak için
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        // 1. Kullanıcıyı bul
        return userRepository.findByUsername(loginRequest.getUsername())
                .map(user -> {
                    // 2. Şifreyi kontrol et (Şimdilik düz metin olarak)
                    if (user.getPassword().equals(loginRequest.getPassword())) {
                        return ResponseEntity.ok(user); // Başarılı, kullanıcıyı döndür
                    }
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Hatalı şifre!");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Kullanıcı bulunamadı!"));
    }
}