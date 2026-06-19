package com.staff.staff_service.controller;

import com.staff.staff_service.dto.response.ApiResponse;
import com.staff.staff_service.dto.response.StaffResponse;
import com.staff.staff_service.enums.StaffRole;
import com.staff.staff_service.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
public class InternalStaffController {

    private final StaffService staffService;

    @GetMapping("/{id}")
    public ApiResponse<StaffResponse> getById(@PathVariable String id) {
        return ApiResponse.<StaffResponse>builder()
                .code(1000).result(staffService.getById(id)).build();
    }

    @GetMapping("/available")
    public ApiResponse<List<StaffResponse>> getAvailable(
            @RequestParam String homeBaseId,
            @RequestParam StaffRole role) {
        return ApiResponse.<List<StaffResponse>>builder()
                .code(1000).result(staffService.getAvailableByHomeBase(homeBaseId, role)).build();
    }
}
