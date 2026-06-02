package com.order.order_service.entity;

import com.order.order_service.enums.SagaStatus;
import com.order.order_service.enums.SagaStep;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "order_sagas")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderSaga {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String orderId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SagaStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SagaStep currentStep;

    @Column(columnDefinition = "TEXT")
    private String requestPayload;

    @Column(columnDefinition = "TEXT")
    private String failureReason;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
