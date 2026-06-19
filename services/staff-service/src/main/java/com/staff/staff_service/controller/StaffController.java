package com.staff.staff_service.controller;

import com.staff.staff_service.dto.request.CreateStaffRequest;
import com.staff.staff_service.dto.request.UpdateStatusRequest;
import com.staff.staff_service.dto.response.ApiResponse;
import com.staff.staff_service.dto.response.StaffResponse;
import com.staff.staff_service.enums.StaffRole;
import com.staff.staff_service.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<StaffResponse> create(@Valid @RequestBody CreateStaffRequest request) {
        return ApiResponse.<StaffResponse>builder()
                .code(1000).message("Staff created").result(staffService.create(request)).build();
    }

    @GetMapping("/{id}")
    public ApiResponse<StaffResponse> getById(@PathVariable String id) {
        return ApiResponse.<StaffResponse>builder()
                .code(1000).result(staffService.getById(id)).build();
    }

    @GetMapping
    public ApiResponse<List<StaffResponse>> getAll(
            @RequestParam(required = false) String homeBaseId,
            @RequestParam(required = false) StaffRole role) {
        List<StaffResponse> result;
        if (homeBaseId != null && role != null) {
            result = staffService.getAvailableByHomeBase(homeBaseId, role);
        } else if (homeBaseId != null) {
            result = staffService.getByHomeBase(homeBaseId);
        } else if (role != null) {
            result = staffService.getByRole(role);
        } else {
            result = staffService.getAll();
        }
        return ApiResponse.<List<StaffResponse>>builder().code(1000).result(result).build();
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<StaffResponse> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateStatusRequest request) {
        return ApiResponse.<StaffResponse>builder()
                .code(1000).result(staffService.updateStatus(id, request)).build();
    }
}
