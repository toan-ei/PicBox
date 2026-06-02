package com.payment.payment_service.controller;

import com.payment.payment_service.dto.request.TopUpRequest;
import com.payment.payment_service.dto.response.ApiResponse;
import com.payment.payment_service.dto.response.WalletResponse;
import com.payment.payment_service.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wallets")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/my")
    public ApiResponse<WalletResponse> getMyWallet(@AuthenticationPrincipal Jwt jwt) {
        return ApiResponse.<WalletResponse>builder()
                .code(0)
                .result(walletService.getByUserId(jwt.getSubject()))
                .build();
    }

    @PostMapping("/top-up")
    public ApiResponse<WalletResponse> topUp(@AuthenticationPrincipal Jwt jwt,
                                             @Valid @RequestBody TopUpRequest request) {
        return ApiResponse.<WalletResponse>builder()
                .code(0)
                .result(walletService.topUp(jwt.getSubject(), request))
                .build();
    }
}
