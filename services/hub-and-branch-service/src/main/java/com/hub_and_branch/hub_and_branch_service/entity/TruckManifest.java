package com.hub_and_branch.hub_and_branch_service.entity;

import com.hub_and_branch.hub_and_branch_service.enums.ManifestStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "truck_manifests", uniqueConstraints = @UniqueConstraint(columnNames = {"route_id", "order_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TruckManifest {

    @Id
    @UuidGenerator
    private String id;

    @Column(name = "route_id", nullable = false)
    private String routeId;

    @Column(name = "order_id", nullable = false)
    private String orderId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ManifestStatus status = ManifestStatus.LOADED;

    @Column(name = "loaded_at")
    private LocalDateTime loadedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;
}
