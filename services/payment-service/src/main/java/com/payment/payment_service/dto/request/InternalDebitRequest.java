package com.payment.payment_service.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class InternalDebitRequest {
    @NotBlank
    private String userId;

    @NotNull
    @DecimalMin("0")
    private BigDecimal amount;

    @NotBlank
    private String referenceId;

    private String description;
}
