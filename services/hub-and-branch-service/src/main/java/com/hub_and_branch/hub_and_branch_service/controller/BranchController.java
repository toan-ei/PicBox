package com.hub_and_branch.hub_and_branch_service.controller;

import com.hub_and_branch.hub_and_branch_service.dto.request.CreateBranchRequest;
import com.hub_and_branch.hub_and_branch_service.dto.response.ApiResponse;
import com.hub_and_branch.hub_and_branch_service.dto.response.BranchResponse;
import com.hub_and_branch.hub_and_branch_service.service.BranchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/branches")
@RequiredArgsConstructor
public class BranchController {

    private final BranchService branchService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<BranchResponse> create(@Valid @RequestBody CreateBranchRequest request) {
        return ApiResponse.<BranchResponse>builder()
                .result(branchService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<BranchResponse>> getAll() {
        return ApiResponse.<List<BranchResponse>>builder()
                .result(branchService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<BranchResponse> getById(@PathVariable String id) {
        return ApiResponse.<BranchResponse>builder()
                .result(branchService.getById(id))
                .build();
    }

    @GetMapping("/by-hub/{hubId}")
    public ApiResponse<List<BranchResponse>> getByHub(@PathVariable String hubId) {
        return ApiResponse.<List<BranchResponse>>builder()
                .result(branchService.getByHub(hubId))
                .build();
    }

    @PatchMapping("/{id}/active")
    public ApiResponse<BranchResponse> setActive(@PathVariable String id,
                                                  @RequestParam boolean active) {
        return ApiResponse.<BranchResponse>builder()
                .result(branchService.setActive(id, active))
                .build();
    }
}
