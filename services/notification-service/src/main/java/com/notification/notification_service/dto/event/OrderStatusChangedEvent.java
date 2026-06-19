package com.notification.notification_service.dto.event;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderStatusChangedEvent {
    private String orderId;
    private String trackingCode;
    private String userId;
    private String oldStatus;
    private String newStatus;
    private String note;
    private LocalDateTime changedAt;
}
