package com.order.order_service.repository.httpclient;

import com.order.order_service.dto.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "payment-service", url = "${feign.client.config.payment-service.url}")
public interface PaymentClient {

    @PostMapping("/internal/wallets/debit")
    ApiResponse<DebitWalletResponse> debitWallet(@RequestBody DebitWalletRequest request);

    @PostMapping("/internal/wallets/credit")
    ApiResponse<Void> creditWallet(@RequestBody DebitWalletRequest request);
}
