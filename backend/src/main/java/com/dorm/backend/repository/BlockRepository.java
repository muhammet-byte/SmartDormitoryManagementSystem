package com.dorm.backend.repository;

import com.dorm.backend.model.Block;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlockRepository extends JpaRepository<Block, Long> {
    Optional<Block> findByBlockNumber(Integer blockNumber);
}
