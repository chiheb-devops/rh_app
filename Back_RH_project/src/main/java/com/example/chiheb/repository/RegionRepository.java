package com.example.chiheb.repository;

import com.example.chiheb.entity.region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegionRepository extends JpaRepository<region, Long> {
}
