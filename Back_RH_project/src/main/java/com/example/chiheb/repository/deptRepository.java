package com.example.chiheb.repository;


import com.example.chiheb.entity.dept;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface deptRepository extends JpaRepository<dept, Long> {
}
