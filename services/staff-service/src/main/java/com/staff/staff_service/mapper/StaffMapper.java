package com.staff.staff_service.mapper;

import com.staff.staff_service.dto.request.CreateStaffRequest;
import com.staff.staff_service.dto.response.StaffResponse;
import com.staff.staff_service.entity.Staff;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StaffMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Staff toEntity(CreateStaffRequest request);

    StaffResponse toResponse(Staff staff);
}
