package com.hub_and_branch.hub_and_branch_service.controller;

import com.hub_and_branch.hub_and_branch_service.dto.request.CreateRegionRequest;
import com.hub_and_branch.hub_and_branch_service.dto.response.ApiResponse;
import com.hub_and_branch.hub_and_branch_service.entity.Region;
import com.hub_and_branch.hub_and_branch_service.service.RegionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/regions")
@RequiredArgsConstructor
public class RegionController {

    private final RegionService regionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Region> create(@Valid @RequestBody CreateRegionRequest request) {
        return ApiResponse.<Region>builder()
                .result(regionService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<Region>> getAll() {
        return ApiResponse.<List<Region>>builder()
                .result(regionService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<Region> getById(@PathVariable String id) {
        return ApiResponse.<Region>builder()
                .result(regionService.getById(id))
                .build();
    }
}
