package com.hub_and_branch.hub_and_branch_service.controller;

import com.hub_and_branch.hub_and_branch_service.dto.request.CreateAreaRequest;
import com.hub_and_branch.hub_and_branch_service.dto.response.ApiResponse;
import com.hub_and_branch.hub_and_branch_service.entity.Area;
import com.hub_and_branch.hub_and_branch_service.service.AreaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/areas")
@RequiredArgsConstructor
public class AreaController {

    private final AreaService areaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Area> create(@Valid @RequestBody CreateAreaRequest request) {
        return ApiResponse.<Area>builder()
                .result(areaService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<Area>> getAll() {
        return ApiResponse.<List<Area>>builder()
                .result(areaService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<Area> getById(@PathVariable String id) {
        return ApiResponse.<Area>builder()
                .result(areaService.getById(id))
                .build();
    }

    @GetMapping("/by-region/{regionId}")
    public ApiResponse<List<Area>> getByRegion(@PathVariable String regionId) {
        return ApiResponse.<List<Area>>builder()
                .result(areaService.getByRegion(regionId))
                .build();
    }
}
