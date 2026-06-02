package com.payment.payment_service.dto.request;

import com.payment.payment_service.enums.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePaymentRequest {
    @NotBlank
    private String orderId;

    @NotNull
    @DecimalMin("0")
    private BigDecimal amount;

    @NotNull
    private PaymentMethod method;

    @NotBlank
    private String idempotencyKey;
}
