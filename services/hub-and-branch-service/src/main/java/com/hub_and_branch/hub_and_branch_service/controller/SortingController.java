package com.hub_and_branch.hub_and_branch_service.controller;

import com.hub_and_branch.hub_and_branch_service.dto.request.EnqueueSortingRequest;
import com.hub_and_branch.hub_and_branch_service.dto.response.ApiResponse;
import com.hub_and_branch.hub_and_branch_service.entity.SortingQueue;
import com.hub_and_branch.hub_and_branch_service.service.SortingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sorting")
@RequiredArgsConstructor
public class SortingController {

    private final SortingService sortingService;

    @PostMapping("/enqueue")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<SortingQueue> enqueue(@Valid @RequestBody EnqueueSortingRequest request) {
        return ApiResponse.<SortingQueue>builder()
                .result(sortingService.enqueue(request))
                .build();
    }

    @PostMapping("/{id}/sort")
    public ApiResponse<SortingQueue> sort(@PathVariable String id) {
        return ApiResponse.<SortingQueue>builder()
                .result(sortingService.sort(id))
                .build();
    }

    @GetMapping("/hub/{hubId}/pending")
    public ApiResponse<List<SortingQueue>> getPending(@PathVariable String hubId) {
        return ApiResponse.<List<SortingQueue>>builder()
                .result(sortingService.getPendingByHub(hubId))
                .build();
    }

    @GetMapping("/hub/{hubId}")
    public ApiResponse<List<SortingQueue>> getByHub(@PathVariable String hubId) {
        return ApiResponse.<List<SortingQueue>>builder()
                .result(sortingService.getByHub(hubId))
                .build();
    }
}
