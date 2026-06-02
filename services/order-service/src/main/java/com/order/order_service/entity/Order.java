package com.order.order_service.entity;

import com.order.order_service.enums.OrderStatus;
import com.order.order_service.enums.PickupMethod;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String trackingCode;

    private String senderId;
    private String senderName;
    private String senderPhone;

    private String receiverName;
    private String receiverPhone;

    @Column(length = 500)
    private String receiverAddress;

    private String originBranchId;
    private String originBranchName;
    private String destBranchId;
    private String destBranchName;

    private Double weight;
    private Double width;
    private Double height;
    private Double length;

    @Column(precision = 15, scale = 2)
    private BigDecimal fee;

    @Column(precision = 15, scale = 2)
    private BigDecimal codAmount;

    @Enumerated(EnumType.STRING)
    private PickupMethod pickupMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(name = "region_code", length = 20)
    private String regionCode;

    private String shipperId;

    @Column(length = 500)
    private String note;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
