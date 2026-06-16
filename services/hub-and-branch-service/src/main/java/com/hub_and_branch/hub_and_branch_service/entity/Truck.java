package com.hub_and_branch.hub_and_branch_service.entity;

import com.hub_and_branch.hub_and_branch_service.enums.TruckStatus;
import com.hub_and_branch.hub_and_branch_service.enums.TruckType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "trucks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Truck {

    @Id
    @UuidGenerator
    private String id;

    @Column(name = "license_plate", nullable = false, unique = true, length = 20)
    private String licensePlate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TruckType type;

    @Column(name = "home_base_id", nullable = false)
    private String homeBaseId;

    @Column(name = "capacity_kg")
    private Double capacityKg;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private TruckStatus status = TruckStatus.AVAILABLE;

    @Column(name = "driver_id")
    private String driverId;
}
