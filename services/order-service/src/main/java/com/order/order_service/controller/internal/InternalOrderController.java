package com.order.order_service.controller.internal;

import com.order.order_service.dto.response.ApiResponse;
import com.order.order_service.dto.response.OrderResponse;
import com.order.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/orders")
@RequiredArgsConstructor
public class InternalOrderController {

    private final OrderService orderService;

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
}
