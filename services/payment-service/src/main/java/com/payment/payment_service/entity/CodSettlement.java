package com.payment.payment_service.entity;

import com.payment.payment_service.enums.SettlementStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cod_settlements")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodSettlement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String orderId;

    @Column(nullable = false)
    private String shipperId;

    @Column(nullable = false)
    private String senderId;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SettlementStatus status;

    private LocalDateTime collectedAt;
    private LocalDateTime settledAt;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
