package com.dormitory.management_system.repository;

import com.dormitory.management_system.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    // Spring Boot'un sihri burada!
    // JpaRepository sayesinde kaydetme, silme, bulma gibi tüm işlemler otomatik olarak buraya yüklendi.
}