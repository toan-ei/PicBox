package com.hub_and_branch.hub_and_branch_service.service;

import com.hub_and_branch.hub_and_branch_service.dto.request.CreateRegionRequest;
import com.hub_and_branch.hub_and_branch_service.entity.Region;
import com.hub_and_branch.hub_and_branch_service.exception.ApplicationException;
import com.hub_and_branch.hub_and_branch_service.exception.ErrorCode;
import com.hub_and_branch.hub_and_branch_service.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegionService {

    private final RegionRepository regionRepository;

    public Region create(CreateRegionRequest request) {
        if (regionRepository.existsByCode(request.getCode())) {
            throw new ApplicationException(ErrorCode.REGION_ALREADY_EXISTS);
        }
        Region region = Region.builder()
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .build();
        return regionRepository.save(region);
    }

    public List<Region> getAll() {
        return regionRepository.findAll();
    }

    public Region getById(String id) {
        return regionRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.REGION_NOT_FOUND));
    }

    public Region getByCode(String code) {
        return regionRepository.findByCode(code)
                .orElseThrow(() -> new ApplicationException(ErrorCode.REGION_NOT_FOUND));
    }
}
