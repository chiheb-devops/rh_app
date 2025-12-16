package com.example.chiheb.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "EMPLOYEE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class employee { // 1. Renamed to PascalCase

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employee_seq")
    @SequenceGenerator(name = "employee_seq", sequenceName = "SEQ_EMPLOYEE", allocationSize = 1)
    private Long id;

    @Column(name = "FIRST_NAME", nullable = false)
    private String firstName;

    @Column(name = "LAST_NAME", nullable = false)

    private String lastName;

    @Column(name = "SALARY")

    private BigDecimal salary; // 3. Changed Double to BigDecimal

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DEPT_ID")
    @JsonIgnore
    private dept dept;

    // 2. This creates "dept_name": "IT" in the JSON response
    @JsonProperty("dept_name")
    public String getDeptName() {
        return (dept != null) ? dept.getName() : null;
    }

    // 2. For the Form (Edit/Update) - CRITICAL
    @JsonProperty("dept_id")
    public Long getDeptId() {
        return (dept != null) ? dept.getId() : null;
    }
    @JsonProperty("region_name")
    public String getRegionName() {
        if (dept != null && dept.getRegion() != null) {
            return dept.getRegion().getName();
        }
        return null;
    }
    // --- CUSTOM JSON INPUT (POST) ---

    // 3. This allows you to send "dept_id": 1 in Postman to save it
    @JsonProperty("dept_id")
    public void setDeptId(Long deptId) {
        if (deptId != null) {
            dept d = new dept();
            d.setId(deptId);
            this.dept = d;
        }
    }
}
