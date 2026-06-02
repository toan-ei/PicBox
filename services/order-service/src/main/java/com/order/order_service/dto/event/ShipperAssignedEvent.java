package com.order.order_service.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
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
