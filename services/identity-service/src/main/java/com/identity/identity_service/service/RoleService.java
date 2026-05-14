package com.identity.identity_service.service;

import com.identity.identity_service.dto.request.RoleRequest;
import com.identity.identity_service.dto.response.RoleResponse;
import com.identity.identity_service.entity.Role;
import com.identity.identity_service.exception.ApplicationException;
import com.identity.identity_service.exception.ErrorCode;
import com.identity.identity_service.mapper.RoleMapper;
import com.identity.identity_service.repository.PermissionRepository;
import com.identity.identity_service.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    RoleMapper roleMapper;
    PermissionRepository permissionRepository;

    @PreAuthorize("hasAuthority('ADMIN')")
    public RoleResponse createRole(RoleRequest request){
        Role role = roleMapper.toRole(request);
        var permissions = permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));
        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public List<RoleResponse> getAllRole(){
        return roleRepository.findAll().stream().map(roleMapper::toRoleResponse).collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public String deleteRole(String nameRole){
        Role role = roleRepository.findById(nameRole)
                .orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND));
        roleRepository.delete(role);
        return "delete role success";
    }
}
