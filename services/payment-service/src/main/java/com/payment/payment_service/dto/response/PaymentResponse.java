package com.payment.payment_service.dto.response;

import com.payment.payment_service.enums.PaymentMethod;
import com.payment.payment_service.enums.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentResponse {
    private String id;
    private String orderId;
    private String payerId;
    private BigDecimal amount;
    private PaymentMethod method;
    private PaymentStatus status;
    private String idempotencyKey;
    private LocalDateTime createdAt;
}
