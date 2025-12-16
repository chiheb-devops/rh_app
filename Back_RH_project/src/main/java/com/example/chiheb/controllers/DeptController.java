package com.example.chiheb.controllers;

import com.example.chiheb.entity.dept;
import com.example.chiheb.services.DeptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments") // Base URL
@CrossOrigin(originPatterns = "*", allowCredentials = "true")

@RequiredArgsConstructor
public class DeptController {

    private final DeptService deptService;

    // 1. GET ALL - URL: GET /api/departments
    @GetMapping
    public ResponseEntity<List<dept>> getAll() {
        List<dept> departments = deptService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    // 2. GET BY ID - URL: GET /api/departments/5
    @GetMapping("/{id}")
    public ResponseEntity<dept> getById(@PathVariable Long id) {
        return deptService.getDepartmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. CREATE - URL: POST /api/departments
    @PostMapping
    public ResponseEntity<dept> create(@RequestBody dept dept) {
        dept savedDept = deptService.addDepartment(dept);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedDept);
    }

    // 4. UPDATE - URL: PUT /api/departments/5
    @PutMapping("/{id}")
    public ResponseEntity<dept> update(@PathVariable Long id, @RequestBody dept deptDetails) {

        try {

            deptDetails.setId(id);
            dept updatedDept = deptService.updateDepartment(deptDetails);
            return ResponseEntity.ok(updatedDept);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. DELETE - URL: DELETE /api/departments/5
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deptService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }
}