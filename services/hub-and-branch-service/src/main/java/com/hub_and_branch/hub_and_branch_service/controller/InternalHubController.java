package com.hub_and_branch.hub_and_branch_service.controller;

import com.hub_and_branch.hub_and_branch_service.dto.response.ApiResponse;
import com.hub_and_branch.hub_and_branch_service.dto.response.BranchResponse;
import com.hub_and_branch.hub_and_branch_service.dto.response.HubResponse;
import com.hub_and_branch.hub_and_branch_service.entity.Area;
import com.hub_and_branch.hub_and_branch_service.entity.Region;
import com.hub_and_branch.hub_and_branch_service.service.AreaService;
import com.hub_and_branch.hub_and_branch_service.service.BranchService;
import com.hub_and_branch.hub_and_branch_service.service.HubService;
import com.hub_and_branch.hub_and_branch_service.service.RegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
public class InternalHubController {

    private final RegionService regionService;
    private final AreaService areaService;
    private final HubService hubService;
    private final BranchService branchService;

    @GetMapping("/regions/{id}")
    public ApiResponse<Region> getRegion(@PathVariable String id) {
        return ApiResponse.<Region>builder()
                .result(regionService.getById(id))
                .build();
    }

    @GetMapping("/areas/{id}")
    public ApiResponse<Area> getArea(@PathVariable String id) {
        return ApiResponse.<Area>builder()
                .result(areaService.getById(id))
                .build();
    }

    @GetMapping("/hubs/{id}")
    public ApiResponse<HubResponse> getHub(@PathVariable String id) {
        return ApiResponse.<HubResponse>builder()
                .result(hubService.getById(id))
                .build();
    }

    @GetMapping("/hubs")
    public ApiResponse<List<HubResponse>> getAllHubs() {
        return ApiResponse.<List<HubResponse>>builder()
                .result(hubService.getAll())
                .build();
    }

    @GetMapping("/branches/{id}")
    public ApiResponse<BranchResponse> getBranch(@PathVariable String id) {
        return ApiResponse.<BranchResponse>builder()
                .result(branchService.getById(id))
                .build();
    }

    @GetMapping("/branches/by-hub/{hubId}")
    public ApiResponse<List<BranchResponse>> getBranchesByHub(@PathVariable String hubId) {
        return ApiResponse.<List<BranchResponse>>builder()
                .result(branchService.getByHub(hubId))
                .build();
    }
}
