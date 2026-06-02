package com.payment.payment_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHENTICATED(1003, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1004, "You do not have permission", HttpStatus.FORBIDDEN),

    WALLET_NOT_FOUND(3001, "Wallet not found", HttpStatus.NOT_FOUND),
    WALLET_ALREADY_EXISTS(3002, "Wallet already exists for this user", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_BALANCE(3003, "Insufficient wallet balance", HttpStatus.BAD_REQUEST),
    OPTIMISTIC_LOCK_FAILURE(3004, "Concurrent wallet update conflict, please retry", HttpStatus.CONFLICT),

    PAYMENT_NOT_FOUND(3010, "Payment not found", HttpStatus.NOT_FOUND),
    DUPLICATE_PAYMENT(3011, "Duplicate payment request (idempotency key already used)", HttpStatus.CONFLICT),
    PAYMENT_FAILED(3012, "Payment processing failed", HttpStatus.INTERNAL_SERVER_ERROR),

    COD_NOT_FOUND(3020, "COD settlement not found", HttpStatus.NOT_FOUND),
    COD_ALREADY_COLLECTED(3021, "COD already collected", HttpStatus.BAD_REQUEST),

    INVALID_REQUEST(3099, "Invalid request data", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
