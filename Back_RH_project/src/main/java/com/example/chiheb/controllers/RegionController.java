package com.example.chiheb.controllers;

import com.example.chiheb.entity.region;
import com.example.chiheb.services.RegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regions")
public class RegionController {
@Autowired
    private final RegionService regionService;

    public RegionController(RegionService regionService) {
        this.regionService = regionService;
    }

    // GET all regions
    @GetMapping("/get_reg")
    public List<region> getAll() {
        return regionService.getAllRegions();
    }

    // GET region by ID
    @GetMapping("/get_reg_byID/{id}")
    public ResponseEntity<region> getById(@PathVariable Long id) {
        return regionService.getRegionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST single region
    @PostMapping("/add")
    public region add(@RequestBody region r) {
        return regionService.addRegion(r);
    }

    // POST multiple regions
    @PostMapping("/addMultiple")
    public List<region> addMultiple(@RequestBody List<region> regions) {
        return regionService.addRegions(regions);
    }

    // PUT update region
    @PutMapping("/{id}")
    public ResponseEntity<region> updateRegion(@PathVariable Long id, @RequestBody region regionDetails) {
        return regionService.getRegionById(id)
                .map(existingRegion -> {
                    // Update the name
                    existingRegion.setName(regionDetails.getName());

                    // Save using the service
                    region updatedRegion = regionService.updateRegion(existingRegion);
                    return ResponseEntity.ok(updatedRegion);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE region by ID
    @DeleteMapping("/Delete_rerg/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        regionService.deleteRegion(id);
        return ResponseEntity.noContent().build();
    }
}
