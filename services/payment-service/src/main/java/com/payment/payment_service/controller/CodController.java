package com.payment.payment_service.controller;

import com.payment.payment_service.dto.request.CodCollectRequest;
import com.payment.payment_service.dto.response.ApiResponse;
import com.payment.payment_service.entity.CodSettlement;
import com.payment.payment_service.service.CodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cod")
@RequiredArgsConstructor
public class CodController {

    private final CodService codService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CodSettlement> create(@Valid @RequestBody CodCollectRequest request) {
        return ApiResponse.<CodSettlement>builder()
                .code(0)
                .result(codService.createCodSettlement(request))
                .build();
    }

    @GetMapping("/order/{orderId}")
    public ApiResponse<CodSettlement> getByOrder(@PathVariable String orderId) {
        return ApiResponse.<CodSettlement>builder()
                .code(0)
                .result(codService.getByOrderId(orderId))
                .build();
    }

    @PostMapping("/order/{orderId}/collect")
    public ApiResponse<CodSettlement> collect(@PathVariable String orderId) {
        return ApiResponse.<CodSettlement>builder()
                .code(0)
                .result(codService.collect(orderId))
                .build();
    }

    @PostMapping("/order/{orderId}/settle")
    public ApiResponse<CodSettlement> settle(@PathVariable String orderId) {
        return ApiResponse.<CodSettlement>builder()
                .code(0)
                .result(codService.settle(orderId))
                .build();
    }

    @GetMapping("/shipper/{shipperId}")
    public ApiResponse<List<CodSettlement>> getByShipper(@PathVariable String shipperId,
                                                          @RequestParam(defaultValue = "PENDING") String status) {
        return ApiResponse.<List<CodSettlement>>builder()
                .code(0)
                .result(codService.getByShipper(shipperId, status))
                .build();
    }
}
