package com.notification.notification_service.dto.event;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderCreatedEvent {
    private String orderId;
    private String trackingCode;
    private String senderId;
    private String senderPhone;
    private String receiverName;
    private String receiverPhone;
    private String destBranchId;
    private BigDecimal fee;
    private BigDecimal codAmount;
    private String pickupMethod;
    private LocalDateTime createdAt;
}
