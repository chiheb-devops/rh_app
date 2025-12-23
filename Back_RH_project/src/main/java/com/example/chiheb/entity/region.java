package com.example.chiheb.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name="REGION")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class region {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "region_seq")
    @SequenceGenerator(name = "region_seq", sequenceName = "SEQ_REGION", allocationSize = 1)
    private Long id;

    @Column(nullable=false)
    private String name;

    // 1. The Relationship
    @OneToMany(mappedBy = "region", fetch = FetchType.EAGER, orphanRemoval = true)

    @JsonIgnore // Stop infinite recursion
    private List<dept> departments;

    // 2. Send the COUNT to Angular
    @JsonProperty("dept_count")
    public int getDeptCount() {
        return (departments != null) ? departments.size() : 0;
    }

    // 3. Send the LIST OF NAMES to Angular
    @JsonProperty("dept_names")
    public List<String> getDeptNames() {
        if (departments != null) {
            return departments.stream()
                    .map(dept::getName)
                    .collect(Collectors.toList());
        }
        return new ArrayList<>();
    }
}