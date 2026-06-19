package com.staff.staff_service.dto.request;

import com.staff.staff_service.enums.HomeBaseType;
import com.staff.staff_service.enums.StaffRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateStaffRequest {

    private String userId;

    @NotBlank
    private String fullName;

    private String phone;

    private String email;

    @NotNull
    private StaffRole role;

    @NotBlank
    private String homeBaseId;

    @NotNull
    private HomeBaseType homeBaseType;
}
