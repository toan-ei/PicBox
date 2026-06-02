package com.order.order_service.entity;

import com.order.order_service.enums.RouteStatus;
import com.order.order_service.enums.RouteType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipper_routes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipperRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String shipperId;

    @Column(nullable = false)
    private String branchId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RouteType routeType;

    @Column(nullable = false)
    private LocalDate routeDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RouteStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
