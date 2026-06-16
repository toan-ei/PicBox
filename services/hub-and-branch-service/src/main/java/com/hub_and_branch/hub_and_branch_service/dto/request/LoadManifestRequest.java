package com.hub_and_branch.hub_and_branch_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class LoadManifestRequest {
    @NotBlank private String routeId;
    private List<String> orderIds;
}
