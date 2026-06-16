package com.hub_and_branch.hub_and_branch_service.controller;

import com.hub_and_branch.hub_and_branch_service.dto.request.CreateHubRequest;
import com.hub_and_branch.hub_and_branch_service.dto.response.ApiResponse;
import com.hub_and_branch.hub_and_branch_service.dto.response.HubResponse;
import com.hub_and_branch.hub_and_branch_service.service.HubService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hubs")
@RequiredArgsConstructor
public class HubController {

    private final HubService hubService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<HubResponse> create(@Valid @RequestBody CreateHubRequest request) {
        return ApiResponse.<HubResponse>builder()
                .result(hubService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<HubResponse>> getAll() {
        return ApiResponse.<List<HubResponse>>builder()
                .result(hubService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<HubResponse> getById(@PathVariable String id) {
        return ApiResponse.<HubResponse>builder()
                .result(hubService.getById(id))
                .build();
    }

    @GetMapping("/by-area/{areaId}")
    public ApiResponse<List<HubResponse>> getByArea(@PathVariable String areaId) {
        return ApiResponse.<List<HubResponse>>builder()
                .result(hubService.getByArea(areaId))
                .build();
    }

    @PatchMapping("/{id}/active")
    public ApiResponse<HubResponse> setActive(@PathVariable String id,
                                               @RequestParam boolean active) {
        return ApiResponse.<HubResponse>builder()
                .result(hubService.setActive(id, active))
                .build();
    }
}
