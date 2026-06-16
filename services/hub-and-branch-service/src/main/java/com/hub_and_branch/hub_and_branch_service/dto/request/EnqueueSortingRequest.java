package com.hub_and_branch.hub_and_branch_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EnqueueSortingRequest {
    @NotBlank private String hubId;
    @NotBlank private String orderId;
    @NotBlank private String destBranchId;
    private int priority;
}
