package com.example.chiheb.services;

import com.example.chiheb.entity.employee;
import com.example.chiheb.repository.employeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final employeeRepository empRepo;

    public EmployeeService(employeeRepository empRepo) {
        this.empRepo = empRepo;
    }

    // Get all employees
    public List<employee> getAllEmployees() {
        return empRepo.findAll();
    }

    // Get employee by ID
    public Optional<employee> getEmployeeById(Long id) {
        return empRepo.findById(id);
    }

    // Add single employee
    public employee addEmployee(employee e) {
        return empRepo.save(e);
    }

    // Add multiple employees
    public List<employee> addEmployees(List<employee> employees) {
        return empRepo.saveAll(employees);
    }

    // Update employee
    public employee updateEmployee(employee e) {
        return empRepo.save(e);
    }

    // Delete employee by ID
    public void deleteEmployee(Long id) {
        empRepo.deleteById(id);
    }
}
