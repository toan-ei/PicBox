package com.order.order_service.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    private String shipperId;
    private LocalDateTime createdAt;
}
