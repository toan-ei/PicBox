package com.order.order_service.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusChangedEvent {
    private String orderId;
    private String trackingCode;
    private String userId;
    private String oldStatus;
    private String newStatus;
    private String note;
    private LocalDateTime changedAt;
}
