package com.tracking.tracking_service.dto;

import lombok.Data;

@Data
public class OrderCreatedEvent {
    private String orderId;
    private String senderId;
    private String receiverId;
    private String pickupAddress;
    private String deliveryAddress;
}