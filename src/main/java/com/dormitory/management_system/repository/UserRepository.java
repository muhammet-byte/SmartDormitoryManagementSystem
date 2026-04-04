package com.dormitory.management_system.repository;

import com.dormitory.management_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Veritabanında kullanıcı adına göre arama yapmamızı sağlar
    Optional<User> findByUsername(String username);
}