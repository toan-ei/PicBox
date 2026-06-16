package com.hub_and_branch.hub_and_branch_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateAreaRequest {
    @NotBlank private String name;
    @NotBlank private String code;
    @NotBlank private String regionId;
    private String description;
}
