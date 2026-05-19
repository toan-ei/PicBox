package com.tracking.tracking_service.dto;

import lombok.Data;

@Data
public class LocationRequest {
    private String shipperId;
    private String orderId;
    private double longitude;
    private double latitude;
}