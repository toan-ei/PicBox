package com.identity.identity_service.mapper;

import com.identity.identity_service.dto.request.RoleRequest;
import com.identity.identity_service.dto.response.RoleResponse;
import com.identity.identity_service.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.lang.annotation.Target;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest roleRequest);
    RoleResponse toRoleResponse(Role role);
}
