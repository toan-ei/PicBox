package com.identity.identity_service.controller;

import com.identity.identity_service.dto.request.PermissionRequest;
import com.identity.identity_service.dto.response.ApiResponse;
import com.identity.identity_service.dto.response.PermissionResponse;
import com.identity.identity_service.service.PermissionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/permissions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionController {
    PermissionService permissionService;

    @PostMapping("/createPermission")
    public ApiResponse<PermissionResponse> createPermission(@RequestBody PermissionRequest request){
        PermissionResponse permissionResponse = permissionService.createPermission(request);
        return ApiResponse.<PermissionResponse>builder()
                .result(permissionResponse)
                .build();
    }

    @GetMapping("/getAllPermission")
    public ApiResponse<List<PermissionResponse>> getAllPermission(){
        List<PermissionResponse> permissionResponses = permissionService.getAllPermission();
        return ApiResponse.<List<PermissionResponse>>builder()
                .result(permissionResponses)
                .build();
    }

    @DeleteMapping("/deletePermission/{namePermission}")
    public ApiResponse<String> deletePermission(@PathVariable String namePermission){
        String result = permissionService.deletePermission(namePermission);
        return ApiResponse.<String>builder()
                .result(result)
                .build();
    }
}
