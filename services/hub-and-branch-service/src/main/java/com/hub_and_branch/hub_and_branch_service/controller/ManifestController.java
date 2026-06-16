package com.hub_and_branch.hub_and_branch_service.controller;

import com.hub_and_branch.hub_and_branch_service.dto.request.LoadManifestRequest;
import com.hub_and_branch.hub_and_branch_service.dto.response.ApiResponse;
import com.hub_and_branch.hub_and_branch_service.entity.TruckManifest;
import com.hub_and_branch.hub_and_branch_service.service.ManifestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manifests")
@RequiredArgsConstructor
public class ManifestController {

    private final ManifestService manifestService;

    @PostMapping("/load")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<List<TruckManifest>> load(@Valid @RequestBody LoadManifestRequest request) {
        return ApiResponse.<List<TruckManifest>>builder()
                .result(manifestService.load(request))
                .build();
    }

    @PostMapping("/{id}/deliver")
    public ApiResponse<TruckManifest> deliver(@PathVariable String id) {
        return ApiResponse.<TruckManifest>builder()
                .result(manifestService.deliver(id))
                .build();
    }

    @GetMapping("/by-route/{routeId}")
    public ApiResponse<List<TruckManifest>> getByRoute(@PathVariable String routeId) {
        return ApiResponse.<List<TruckManifest>>builder()
                .result(manifestService.getByRoute(routeId))
                .build();
    }

    @GetMapping("/by-order/{orderId}")
    public ApiResponse<List<TruckManifest>> getByOrder(@PathVariable String orderId) {
        return ApiResponse.<List<TruckManifest>>builder()
                .result(manifestService.getByOrder(orderId))
                .build();
    }
}
