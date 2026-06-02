package com.payment.payment_service.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class WalletResponse {
    private String id;
    private String userId;
    private BigDecimal balance;
    private Long version;
    private LocalDateTime updatedAt;
}
