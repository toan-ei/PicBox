package com.staff.staff_service.dto.request;

import com.staff.staff_service.enums.StaffStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateStatusRequest {

    @NotNull
    private StaffStatus status;
}
