package com.staff.staff_service.kafka.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipperAssignedEvent {
    private String routeId;
    private String shipperId;
    private String branchId;
    private String routeType;
    private LocalDate routeDate;
    private int totalOrders;
}
