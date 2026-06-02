package com.order.order_service.entity;

import com.order.order_service.enums.CustodyStatus;
import com.order.order_service.enums.CustodyType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "package_custody", indexes = {
        @Index(name = "idx_custody_order_status", columnList = "orderId, status")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PackageCustody {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String orderId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CustodyType custodyType;

    @Column(nullable = false)
    private String custodyId;

    private String custodyName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CustodyStatus status;

    @CreationTimestamp
    private LocalDateTime takenAt;

    private LocalDateTime releasedAt;
}
