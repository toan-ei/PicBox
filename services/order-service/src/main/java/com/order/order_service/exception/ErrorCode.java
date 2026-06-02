package com.order.order_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHENTICATED(1003, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1004, "You do not have permission", HttpStatus.FORBIDDEN),

    ORDER_NOT_FOUND(2001, "Order not found", HttpStatus.NOT_FOUND),
    ORDER_ALREADY_EXISTS(2002, "Order already exists", HttpStatus.BAD_REQUEST),
    ORDER_STATUS_INVALID(2003, "Invalid order status transition", HttpStatus.BAD_REQUEST),
    ORDER_CANCELLED(2004, "Order is already cancelled", HttpStatus.BAD_REQUEST),

    SAGA_FAILED(2010, "Order creation saga failed", HttpStatus.INTERNAL_SERVER_ERROR),
    PAYMENT_DEBIT_FAILED(2011, "Failed to debit payment for order", HttpStatus.PAYMENT_REQUIRED),
    PAYMENT_REFUND_FAILED(2012, "Failed to refund payment", HttpStatus.INTERNAL_SERVER_ERROR),

    CUSTODY_NOT_FOUND(2020, "Package custody record not found", HttpStatus.NOT_FOUND),
    ROUTE_NOT_FOUND(2030, "Shipper route not found", HttpStatus.NOT_FOUND),
    SHIPPER_ASSIGN_FAILED(2031, "Failed to assign shipper", HttpStatus.INTERNAL_SERVER_ERROR),

    INVALID_REQUEST(2099, "Invalid request data", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
