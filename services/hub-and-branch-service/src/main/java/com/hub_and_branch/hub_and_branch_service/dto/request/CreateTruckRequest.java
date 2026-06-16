package com.hub_and_branch.hub_and_branch_service.dto.request;

import com.hub_and_branch.hub_and_branch_service.enums.TruckType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateTruckRequest {
    @NotBlank private String licensePlate;
    @NotNull  private TruckType type;
    @NotBlank private String homeBaseId;   // areaId for AREA_TRUCK, hubId for INTER_HUB_TRUCK
    private Double capacityKg;
    private String driverId;
}
