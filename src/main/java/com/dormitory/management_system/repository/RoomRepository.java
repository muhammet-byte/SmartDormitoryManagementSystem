package com.dormitory.management_system.repository;

import com.dormitory.management_system.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    // Sadece bu kadar! Spring Boot arka planda kaydetme, silme, bulma kodlarını kendi yazacak.
}