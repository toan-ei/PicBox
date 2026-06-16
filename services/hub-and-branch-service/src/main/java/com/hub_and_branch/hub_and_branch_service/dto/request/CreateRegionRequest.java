package com.hub_and_branch.hub_and_branch_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateRegionRequest {
    @NotBlank private String name;
    @NotBlank private String code;
    private String description;
}
