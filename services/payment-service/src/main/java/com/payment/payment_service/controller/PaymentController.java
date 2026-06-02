package com.payment.payment_service.controller;

import com.payment.payment_service.dto.request.CreatePaymentRequest;
import com.payment.payment_service.dto.response.ApiResponse;
import com.payment.payment_service.dto.response.PaymentResponse;
import com.payment.payment_service.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<PaymentResponse> create(@AuthenticationPrincipal Jwt jwt,
                                               @Valid @RequestBody CreatePaymentRequest request) {
        return ApiResponse.<PaymentResponse>builder()
                .code(0)
                .result(paymentService.createPayment(jwt.getSubject(), request))
                .build();
    }

    @GetMapping("/{paymentId}")
    public ApiResponse<PaymentResponse> getById(@PathVariable String paymentId) {
        return ApiResponse.<PaymentResponse>builder()
                .code(0)
                .result(paymentService.getById(paymentId))
                .build();
    }

    @GetMapping("/order/{orderId}")
    public ApiResponse<List<PaymentResponse>> getByOrder(@PathVariable String orderId) {
        return ApiResponse.<List<PaymentResponse>>builder()
                .code(0)
                .result(paymentService.getByOrderId(orderId))
                .build();
    }

    @PostMapping("/{paymentId}/refund")
    public ApiResponse<PaymentResponse> refund(@PathVariable String paymentId) {
        return ApiResponse.<PaymentResponse>builder()
                .code(0)
                .result(paymentService.refund(paymentId))
                .build();
    }
}
