package com.example.chiheb.repository;


import com.example.chiheb.entity.employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface employeeRepository extends JpaRepository<employee, Long> {


    List<employee> findBydept_id(Long dept_id);

    List<employee> findEmployeesByRegionId(Long regionId);
}
