package com.order.order_service.constant;

public final class KafkaTopic {
    public static final String ORDER_CREATED = "order.created";
    public static final String ORDER_STATUS_CHANGED = "order.status_changed";
    public static final String ORDER_CANCELLED = "order.cancelled";
    public static final String SHIPPER_ASSIGNED = "shipper.assigned";

    private KafkaTopic() {}
}
