package com.order.order_service.entity;

import com.order.order_service.enums.CustodyType;
import com.order.order_service.enums.MovementType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "order_movements")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String orderId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovementType movementType;

    @Enumerated(EnumType.STRING)
    private CustodyType fromCustodyType;
    private String fromCustodyId;

    @Enumerated(EnumType.STRING)
    private CustodyType toCustodyType;
    private String toCustodyId;

    private String truckId;
    private String recordedBy;

    @Column(length = 500)
    private String note;

    @CreationTimestamp
    private LocalDateTime happenedAt;
}
