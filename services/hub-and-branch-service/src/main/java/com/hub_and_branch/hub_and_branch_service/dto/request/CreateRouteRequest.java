package com.hub_and_branch.hub_and_branch_service.dto.request;

import com.hub_and_branch.hub_and_branch_service.enums.RouteType;
import com.hub_and_branch.hub_and_branch_service.enums.StopType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateRouteRequest {
    @NotBlank private String truckId;
    @NotNull  private RouteType routeType;
    @NotBlank private String originId;
    @NotNull  private StopType originType;
    @NotBlank private String destId;
    @NotNull  private StopType destType;
    @NotNull  private LocalDateTime scheduledDeparture;
}
