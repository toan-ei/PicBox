package com.order.order_service.dto.request;

import com.order.order_service.enums.PickupMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateOrderRequest {

    @NotBlank
    private String senderName;
    @NotBlank
    private String senderPhone;

    @NotBlank
    private String receiverName;
    @NotBlank
    private String receiverPhone;
    @NotBlank
    private String receiverAddress;

    @NotBlank
    private String originBranchId;
    @NotBlank
    private String originBranchName;
    @NotBlank
    private String destBranchId;
    @NotBlank
    private String destBranchName;

    private String regionCode;

    @NotNull
    @Positive
    private Double weight;

    private Double width;
    private Double height;
    private Double length;

    @NotNull
    @DecimalMin("0")
    private BigDecimal fee;

    @DecimalMin("0")
    private BigDecimal codAmount;

    @NotNull
    private PickupMethod pickupMethod;

    private String note;
}
