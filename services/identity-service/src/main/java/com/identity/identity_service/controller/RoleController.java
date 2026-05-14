package com.identity.identity_service.controller;

import com.identity.identity_service.dto.request.RoleRequest;
import com.identity.identity_service.dto.response.ApiResponse;
import com.identity.identity_service.dto.response.RoleResponse;
import com.identity.identity_service.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {
    RoleService roleService;

    @PostMapping("/createRole")
    public ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest request){
        RoleResponse response = roleService.createRole(request);
        return ApiResponse.<RoleResponse>builder()
                .result(response)
                .build();
    }

    @GetMapping("/getAllRole")
    public ApiResponse<List<RoleResponse>> getAllRole(){
        List<RoleResponse> roleResponses = roleService.getAllRole();
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleResponses)
                .build();
    }

    @DeleteMapping("/deleteRole/{nameRole}")
    public ApiResponse<String> deleteRole(@PathVariable String nameRole){
        String result = roleService.deleteRole(nameRole);
        return ApiResponse.<String>builder()
                .result(result)
                .build();
    }
}
