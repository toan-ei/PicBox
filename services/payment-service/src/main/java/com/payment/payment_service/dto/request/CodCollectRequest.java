package com.payment.payment_service.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CodCollectRequest {
    @NotBlank
    private String orderId;

    @NotBlank
    private String shipperId;

    @NotBlank
    private String senderId;

    @NotNull
    @DecimalMin("0")
    private BigDecimal amount;
}
