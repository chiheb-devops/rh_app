package com.example.chiheb.services;

import com.example.chiheb.entity.region;
import com.example.chiheb.repository.RegionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RegionService {

    private final RegionRepository regionRepo;

    public RegionService(RegionRepository regionRepo) {
        this.regionRepo = regionRepo;
    }

    // Get all regions
    public List<region> getAllRegions() {
        return regionRepo.findAll();
    }

    // Get region by ID
    public Optional<region> getRegionById(Long id) {
        return regionRepo.findById(id);
    }

    // Add single region
    public region addRegion(region r) {
        return regionRepo.save(r);
    }

    // Add multiple regions
    public List<region> addRegions(List<region> regions) {
        return regionRepo.saveAll(regions);
    }

    // Update region
    public region updateRegion(region r) {
        return regionRepo.save(r);
    }

    // Delete region by ID
    public void deleteRegion(Long id) {
        regionRepo.deleteById(id);
    }

}
