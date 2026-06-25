package com.order.order_service.controller;

import com.order.order_service.dto.request.AssignShipperRequest;
import com.order.order_service.dto.request.CreateOrderRequest;
import com.order.order_service.dto.request.UpdateOrderStatusRequest;
import com.order.order_service.dto.response.ApiResponse;
import com.order.order_service.dto.response.OrderResponse;
import com.order.order_service.dto.response.PageResponse;
import com.order.order_service.entity.OrderStatusHistory;
import com.order.order_service.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<OrderResponse> create(@AuthenticationPrincipal Jwt jwt,
                                             @Valid @RequestBody CreateOrderRequest request) {
        String senderId = jwt.getSubject();
        return ApiResponse.<OrderResponse>builder()
                .code(0)
                .result(orderService.createOrder(senderId, request))
                .build();
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getById(@PathVariable String orderId) {
        return ApiResponse.<OrderResponse>builder()
                .code(0)
                .result(orderService.getById(orderId))
                .build();
    }

    @GetMapping("/tracking/{trackingCode}")
    public ApiResponse<OrderResponse> getByTracking(@PathVariable String trackingCode) {
        return ApiResponse.<OrderResponse>builder()
                .code(0)
                .result(orderService.getByTrackingCode(trackingCode))
                .build();
    }

    @GetMapping("/my")
    public ApiResponse<PageResponse<OrderResponse>> getMyOrders(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .code(0)
                .result(orderService.getMyOrders(jwt.getSubject(), page, size))
                .build();
    }

    @GetMapping("/status/{status}")
    public ApiResponse<PageResponse<OrderResponse>> getByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .code(0)
                .result(orderService.getByStatus(status, page, size))
                .build();
    }

    @PutMapping("/{orderId}/status")
    public ApiResponse<OrderResponse> updateStatus(@AuthenticationPrincipal Jwt jwt,
                                                   @PathVariable String orderId,
                                                   @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .code(0)
                .result(orderService.updateStatus(orderId, jwt.getSubject(), request))
                .build();
    }

    @GetMapping("/assigned")
    public ApiResponse<PageResponse<OrderResponse>> getAssignedOrders(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .code(0)
                .result(orderService.getAssignedOrders(jwt.getSubject(), page, size))
                .build();
    }

    @PutMapping("/{orderId}/assign")
    public ApiResponse<OrderResponse> assignShipper(@PathVariable String orderId,
                                                    @Valid @RequestBody AssignShipperRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .code(0)
                .result(orderService.assignShipper(orderId, request.getShipperId()))
                .build();
    }

    @DeleteMapping("/{orderId}")
    public ApiResponse<Void> cancel(@AuthenticationPrincipal Jwt jwt,
                                    @PathVariable String orderId) {
        orderService.cancelOrder(orderId, jwt.getSubject());
        return ApiResponse.<Void>builder()
                .code(0)
                .message("Order cancelled")
                .build();
    }

    @GetMapping("/{orderId}/history")
    public ApiResponse<List<OrderStatusHistory>> getHistory(@PathVariable String orderId) {
        return ApiResponse.<List<OrderStatusHistory>>builder()
                .code(0)
                .result(orderService.getStatusHistory(orderId))
                .build();
    }
}
