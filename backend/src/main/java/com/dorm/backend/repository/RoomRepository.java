package com.dorm.backend.repository;

import com.dorm.backend.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByBlockId(Long blockId);

    List<Room> findByBlockIdAndFloorNumber(Long blockId, Integer floorNumber);
}
