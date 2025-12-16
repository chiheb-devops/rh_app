package com.example.chiheb.controllers;

import com.example.chiheb.entity.employee;
import com.example.chiheb.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
@Autowired
    private final EmployeeService employeeService;


    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // GET all employees
    @GetMapping("/get_emp")
    public List<employee> getAll() {
        return employeeService.getAllEmployees();
    }

    // GET employee by ID
    @GetMapping("/get_emp_byID/{id}")
    public ResponseEntity<employee> getById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST single employee
    @PostMapping("/add")
    public employee add(@RequestBody employee e) {
        return employeeService.addEmployee(e);
    }

    // POST multiple employees (bulk insert)
    @PostMapping("/addMultiple")
    public List<employee> addMultiple(@RequestBody List<employee> employees) {
        return employeeService.addEmployees(employees);
    }

    // PUT update employee
    @PutMapping("/update")
    public employee update(@RequestBody employee e) {
        return employeeService.updateEmployee(e);
    }

    // DELETE employee by ID
    @DeleteMapping("/Delete_emp/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
