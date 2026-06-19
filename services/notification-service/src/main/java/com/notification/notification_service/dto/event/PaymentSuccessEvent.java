package com.notification.notification_service.dto.event;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentSuccessEvent {
    private String paymentId;
    private String orderId;
    private String payerId;
    private BigDecimal amount;
    private String method;
    private LocalDateTime paidAt;
}
