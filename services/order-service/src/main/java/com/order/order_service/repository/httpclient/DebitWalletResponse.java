package com.order.order_service.repository.httpclient;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DebitWalletResponse {
    private String transactionId;
    private BigDecimal balanceAfter;
}
