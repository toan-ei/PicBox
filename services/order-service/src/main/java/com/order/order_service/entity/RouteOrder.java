package com.order.order_service.entity;

import com.order.order_service.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "route_orders", indexes = {
        @Index(name = "idx_route_order", columnList = "routeId, orderId")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String routeId;

    @Column(nullable = false)
    private String orderId;

    private int sequence;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;
}
