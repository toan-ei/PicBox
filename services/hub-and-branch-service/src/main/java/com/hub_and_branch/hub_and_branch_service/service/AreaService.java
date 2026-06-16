package com.hub_and_branch.hub_and_branch_service.service;

import com.hub_and_branch.hub_and_branch_service.dto.request.CreateAreaRequest;
import com.hub_and_branch.hub_and_branch_service.entity.Area;
import com.hub_and_branch.hub_and_branch_service.exception.ApplicationException;
import com.hub_and_branch.hub_and_branch_service.exception.ErrorCode;
import com.hub_and_branch.hub_and_branch_service.repository.AreaRepository;
import com.hub_and_branch.hub_and_branch_service.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AreaService {

    private final AreaRepository areaRepository;
    private final RegionRepository regionRepository;

    public Area create(CreateAreaRequest request) {
        if (!regionRepository.existsById(request.getRegionId())) {
            throw new ApplicationException(ErrorCode.REGION_NOT_FOUND);
        }
        if (areaRepository.existsByCode(request.getCode())) {
            throw new ApplicationException(ErrorCode.AREA_ALREADY_EXISTS);
        }
        Area area = Area.builder()
                .name(request.getName())
                .code(request.getCode())
                .regionId(request.getRegionId())
                .description(request.getDescription())
                .build();
        return areaRepository.save(area);
    }

    public List<Area> getAll() {
        return areaRepository.findAll();
    }

    public List<Area> getByRegion(String regionId) {
        return areaRepository.findByRegionId(regionId);
    }

    public Area getById(String id) {
        return areaRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.AREA_NOT_FOUND));
    }
}
