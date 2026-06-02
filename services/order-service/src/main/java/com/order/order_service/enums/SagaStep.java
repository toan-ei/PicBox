package com.order.order_service.enums;

public enum SagaStep {
    INIT,
    PAYMENT_DEBITED,
    ORDER_CREATED,
    CUSTODY_INITIALIZED,
    SHIPPER_ASSIGNED,
    COMPLETED
}
