package com.payment.payment_service.controller.internal;

import com.payment.payment_service.dto.request.InternalDebitRequest;
import com.payment.payment_service.dto.response.ApiResponse;
import com.payment.payment_service.dto.response.InternalDebitResponse;
import com.payment.payment_service.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/wallets")
@RequiredArgsConstructor
public class InternalPaymentController {

    private final WalletService walletService;

    @PostMapping("/debit")
    public ApiResponse<InternalDebitResponse> debit(@Valid @RequestBody InternalDebitRequest request) {
        return ApiResponse.<InternalDebitResponse>builder()
                .code(0)
                .result(walletService.debit(request))
                .build();
    }

    @PostMapping("/credit")
    public ApiResponse<Void> credit(@Valid @RequestBody InternalDebitRequest request) {
        walletService.credit(request);
        return ApiResponse.<Void>builder()
                .code(0)
                .message("Wallet credited successfully")
                .build();
    }
}
