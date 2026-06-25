package com.order.order_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AssignShipperRequest {
    @NotBlank
    private String shipperId;
}
