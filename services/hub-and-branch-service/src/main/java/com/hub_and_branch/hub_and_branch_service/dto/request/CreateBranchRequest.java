package com.hub_and_branch.hub_and_branch_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateBranchRequest {
    @NotBlank private String name;
    @NotBlank private String hubId;
    @NotBlank private String address;
    private String district;
    private String ward;
    @NotBlank private String province;
    private Double latitude;
    private Double longitude;
    private String contactPhone;
    private Integer maxCapacity;
}
