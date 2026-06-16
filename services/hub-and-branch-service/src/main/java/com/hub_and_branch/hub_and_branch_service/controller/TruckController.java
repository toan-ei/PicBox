package com.hub_and_branch.hub_and_branch_service.controller;

import com.hub_and_branch.hub_and_branch_service.dto.request.CreateTruckRequest;
import com.hub_and_branch.hub_and_branch_service.dto.response.ApiResponse;
import com.hub_and_branch.hub_and_branch_service.dto.response.TruckResponse;
import com.hub_and_branch.hub_and_branch_service.enums.TruckStatus;
import com.hub_and_branch.hub_and_branch_service.service.TruckService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trucks")
@RequiredArgsConstructor
public class TruckController {

    private final TruckService truckService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<TruckResponse> create(@Valid @RequestBody CreateTruckRequest request) {
        return ApiResponse.<TruckResponse>builder()
                .result(truckService.create(request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<TruckResponse> getById(@PathVariable String id) {
        return ApiResponse.<TruckResponse>builder()
                .result(truckService.getById(id))
                .build();
    }

    @GetMapping("/by-home-base/{homeBaseId}")
    public ApiResponse<List<TruckResponse>> getByHomeBase(@PathVariable String homeBaseId) {
        return ApiResponse.<List<TruckResponse>>builder()
                .result(truckService.getByHomeBase(homeBaseId))
                .build();
    }

    @GetMapping("/by-home-base/{homeBaseId}/available")
    public ApiResponse<List<TruckResponse>> getAvailable(@PathVariable String homeBaseId) {
        return ApiResponse.<List<TruckResponse>>builder()
                .result(truckService.getAvailableByHomeBase(homeBaseId))
                .build();
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<TruckResponse> updateStatus(@PathVariable String id,
                                                    @RequestParam TruckStatus status) {
        return ApiResponse.<TruckResponse>builder()
                .result(truckService.updateStatus(id, status))
                .build();
    }

    @PatchMapping("/{id}/driver")
    public ApiResponse<TruckResponse> assignDriver(@PathVariable String id,
                                                    @RequestParam String driverId) {
        return ApiResponse.<TruckResponse>builder()
                .result(truckService.assignDriver(id, driverId))
                .build();
    }
}
