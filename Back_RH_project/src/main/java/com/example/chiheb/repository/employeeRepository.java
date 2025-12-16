package com.example.chiheb.repository;


import com.example.chiheb.entity.employee;
import org.springframework.data.jpa.repository.JpaRepository;
public interface employeeRepository extends JpaRepository<employee, Long> {}
