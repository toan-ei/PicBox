package com.hub_and_branch.hub_and_branch_service.controller;

import com.hub_and_branch.hub_and_branch_service.dto.request.CreateRouteRequest;
import com.hub_and_branch.hub_and_branch_service.dto.response.ApiResponse;
import com.hub_and_branch.hub_and_branch_service.dto.response.RouteResponse;
import com.hub_and_branch.hub_and_branch_service.service.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<RouteResponse> create(@Valid @RequestBody CreateRouteRequest request) {
        return ApiResponse.<RouteResponse>builder()
                .result(routeService.create(request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<RouteResponse> getById(@PathVariable String id) {
        return ApiResponse.<RouteResponse>builder()
                .result(routeService.getById(id))
                .build();
    }

    @GetMapping("/by-truck/{truckId}")
    public ApiResponse<List<RouteResponse>> getByTruck(@PathVariable String truckId) {
        return ApiResponse.<List<RouteResponse>>builder()
                .result(routeService.getByTruck(truckId))
                .build();
    }

    @PostMapping("/{id}/depart")
    public ApiResponse<RouteResponse> depart(@PathVariable String id) {
        return ApiResponse.<RouteResponse>builder()
                .result(routeService.depart(id))
                .build();
    }

    @PostMapping("/{id}/arrive")
    public ApiResponse<RouteResponse> arrive(@PathVariable String id) {
        return ApiResponse.<RouteResponse>builder()
                .result(routeService.arrive(id))
                .build();
    }
}
