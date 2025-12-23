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
public class employee {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employee_seq")
    @SequenceGenerator(name = "employee_seq", sequenceName = "SEQ_EMPLOYEE", allocationSize = 1)

    private Long id;

    @Column(name = "FIRST_NAME", nullable = false)

    private String FIRST_NAME;

    @Column(name = "LAST_NAME", nullable = false)

    private String LAST_NAME;

    @Column(name = "SALARY")

    private BigDecimal SALARY;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DEPT_ID")
    @JsonIgnore
    private dept dept;

    @JsonProperty("dept_name")
    public String getDeptName() {
        return (dept != null) ? dept.getName() : null;
    }

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

    // --- CUSTOM SETTER ---

    @JsonProperty("dept_id")
    public void setDeptId(Long deptId) {
        if (deptId != null) {
            dept d = new dept();
            d.setId(deptId);
            this.dept = d;
        }
    }

    @JsonProperty("region_id")
    public Long getRegionId() {
        if (dept != null && dept.getRegion() != null) {
            return dept.getRegion().getId();
        }
        return null;
    }
}