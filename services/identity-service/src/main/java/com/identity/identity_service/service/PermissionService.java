package com.identity.identity_service.service;

import com.identity.identity_service.dto.request.PermissionRequest;
import com.identity.identity_service.dto.response.PermissionResponse;
import com.identity.identity_service.entity.Permission;
import com.identity.identity_service.exception.ApplicationException;
import com.identity.identity_service.exception.ErrorCode;
import com.identity.identity_service.mapper.PermissionMapper;
import com.identity.identity_service.repository.PermissionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    @PreAuthorize("hasAuthority('ADMIN')")
    public PermissionResponse createPermission(PermissionRequest request){
        Permission permission = permissionMapper.toPermission(request);
        return permissionMapper.toPermissionResponse(permissionRepository.save(permission));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public List<PermissionResponse> getAllPermission(){
        return permissionRepository.findAll().stream().map(permissionMapper::toPermissionResponse).collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public String deletePermission(String namePermission){
        Permission permission = permissionRepository.findById(namePermission).orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND));
        permissionRepository.delete(permission);
        return "delete permission success";
    }

}
