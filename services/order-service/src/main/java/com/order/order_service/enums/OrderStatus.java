package com.order.order_service.enums;

public enum OrderStatus {
    PENDING,
    CONFIRMED,
    PICKED_UP,
    AT_ORIGIN_BRANCH,
    IN_TRANSIT_TO_HUB,
    AT_HUB,
    IN_TRANSIT_TO_DEST_HUB,
    AT_DEST_HUB,
    IN_TRANSIT_TO_DEST_BRANCH,
    AT_DEST_BRANCH,
    OUT_FOR_DELIVERY,
    DELIVERED,
    DELIVERY_FAILED,
    RETURNED,
    CANCELLED
}
