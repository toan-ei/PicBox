package com.hub_and_branch.hub_and_branch_service.dto.response;

import com.hub_and_branch.hub_and_branch_service.enums.TruckStatus;
import com.hub_and_branch.hub_and_branch_service.enums.TruckType;
import lombok.Data;

@Data
public class TruckResponse {
    private String id;
    private String licensePlate;
    private TruckType type;
    private String homeBaseId;
    private Double capacityKg;
    private TruckStatus status;
    private String driverId;
}
