package com.staff.staff_service.dto.response;

import com.staff.staff_service.enums.HomeBaseType;
import com.staff.staff_service.enums.StaffRole;
import com.staff.staff_service.enums.StaffStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StaffResponse {
    private String id;
    private String userId;
    private String fullName;
    private String phone;
    private String email;
    private StaffRole role;
    private String homeBaseId;
    private HomeBaseType homeBaseType;
    private StaffStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
