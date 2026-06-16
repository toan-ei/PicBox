package com.hub_and_branch.hub_and_branch_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHENTICATED(1003, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1004, "You do not have permission", HttpStatus.FORBIDDEN),

    REGION_NOT_FOUND(4001, "Region not found", HttpStatus.NOT_FOUND),
    REGION_ALREADY_EXISTS(4002, "Region code already exists", HttpStatus.BAD_REQUEST),

    AREA_NOT_FOUND(4010, "Area not found", HttpStatus.NOT_FOUND),
    AREA_ALREADY_EXISTS(4011, "Area code already exists", HttpStatus.BAD_REQUEST),

    HUB_NOT_FOUND(4020, "Hub not found", HttpStatus.NOT_FOUND),
    HUB_ALREADY_EXISTS(4021, "Hub already exists in this area", HttpStatus.BAD_REQUEST),

    BRANCH_NOT_FOUND(4030, "Branch not found", HttpStatus.NOT_FOUND),

    TRUCK_NOT_FOUND(4040, "Truck not found", HttpStatus.NOT_FOUND),
    TRUCK_NOT_AVAILABLE(4041, "Truck is not available", HttpStatus.BAD_REQUEST),
    TRUCK_LICENSE_EXISTS(4042, "License plate already registered", HttpStatus.BAD_REQUEST),

    ROUTE_NOT_FOUND(4050, "Truck route not found", HttpStatus.NOT_FOUND),

    MANIFEST_NOT_FOUND(4060, "Manifest not found", HttpStatus.NOT_FOUND),
    MANIFEST_DUPLICATE_ORDER(4061, "Order already loaded on this route", HttpStatus.BAD_REQUEST),

    SORTING_NOT_FOUND(4070, "Sorting queue item not found", HttpStatus.NOT_FOUND),

    INVALID_REQUEST(4099, "Invalid request data", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
