package com.example.chiheb.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Entity
@Table(name="DEPT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class dept {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "dept_seq")
    @SequenceGenerator(name = "dept_seq", sequenceName = "SEQ_DEPT", allocationSize = 1)
    private Long id;

    @Column(nullable=false)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="REGION_ID")
    @JsonIgnore
    private region region;

    @OneToMany(mappedBy = "dept", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<employee> employees;

    // --- JSON PROPERTIES ---

    @JsonProperty("region_name")
    public String getRegionName() { return (region != null) ? region.getName() : null; }

    @JsonProperty("region_id")
    public Long getRegionId() { return (region != null) ? region.getId() : null; }

    // 👇 THIS WAS MISSING 👇
    @JsonProperty("region_id")
    public void setRegionId(Long regionId) {
        if (regionId != null) {
            region r = new region();
            r.setId(regionId);
            this.region = r;
        }
    }

    @JsonProperty("emp_count")
    public int getEmpCount() {
        return (employees != null) ? employees.size() : 0;
    }

    @JsonProperty("emp_list")
    public List<Map<String, Object>> getEmpList() {
        if (employees != null) {
            return employees.stream()
                    .map(e -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", e.getId());
                        map.put("name", e.getFirstName() + " " + e.getLastName());
                        return map;
                    })
                    .collect(Collectors.toList());
        }
        return new ArrayList<>();
    }
}