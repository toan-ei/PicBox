package com.hub_and_branch.hub_and_branch_service.dto.response;

import com.hub_and_branch.hub_and_branch_service.enums.RouteStatus;
import com.hub_and_branch.hub_and_branch_service.enums.RouteType;
import com.hub_and_branch.hub_and_branch_service.enums.StopType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RouteResponse {
    private String id;
    private String truckId;
    private String truckLicensePlate;
    private RouteType routeType;
    private String originId;
    private StopType originType;
    private String destId;
    private StopType destType;
    private LocalDateTime scheduledDeparture;
    private LocalDateTime actualDeparture;
    private LocalDateTime actualArrival;
    private RouteStatus status;
}
