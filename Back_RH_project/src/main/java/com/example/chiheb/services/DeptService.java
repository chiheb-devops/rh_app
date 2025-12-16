package com.example.chiheb.services;


import com.example.chiheb.entity.dept;
import com.example.chiheb.repository.deptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeptService {

    @Autowired
    private final deptRepository deptRepo;

    public DeptService(deptRepository deptRepo) {
        this.deptRepo = deptRepo;
    }

    public List<dept> getAllDepartments() {
        return deptRepo.findAll();
    }

    public Optional<dept> getDepartmentById(Long id) {
        return deptRepo.findById(id);
    }

    public dept addDepartment(dept department) {
        return deptRepo.save(department);
    }

    public void deleteDepartment(Long id) {
        deptRepo.deleteById(id);
    }

    public dept updateDepartment(dept d) { return deptRepo.save(d); }
}
