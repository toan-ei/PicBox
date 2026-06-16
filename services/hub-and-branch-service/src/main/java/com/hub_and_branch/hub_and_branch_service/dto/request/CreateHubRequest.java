package com.hub_and_branch.hub_and_branch_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateHubRequest {
    @NotBlank private String name;
    @NotBlank private String areaId;
    @NotBlank private String address;
    private String province;
    private Double latitude;
    private Double longitude;
    private String contactPhone;
}
