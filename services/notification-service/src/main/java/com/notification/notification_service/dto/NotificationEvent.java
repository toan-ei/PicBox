package com.notification.notification_service.dto;

import lombok.Data;

@Data
public class NotificationEvent {
    private String orderId;
    private String userId;
    private String type;
    private String message;
}