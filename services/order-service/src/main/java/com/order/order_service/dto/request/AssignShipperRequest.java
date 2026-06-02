package com.order.order_service.dto.request;

import com.order.order_service.enums.RouteType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AssignShipperRequest {
    @NotBlank
    private String shipperId;
    @NotNull
    private RouteType routeType;
    @NotNull
    private LocalDate routeDate;
}
