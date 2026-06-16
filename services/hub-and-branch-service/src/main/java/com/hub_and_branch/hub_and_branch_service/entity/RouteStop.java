package com.hub_and_branch.hub_and_branch_service.entity;

import com.hub_and_branch.hub_and_branch_service.enums.StopType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "route_stops")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RouteStop {

    @Id
    @UuidGenerator
    private String id;

    @Column(name = "route_id", nullable = false)
    private String routeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "stop_type", nullable = false, length = 20)
    private StopType stopType;

    @Column(name = "stop_id", nullable = false)
    private String stopId;

    @Column(nullable = false)
    private int sequence;

    @Column(name = "arrival_time")
    private LocalDateTime arrivalTime;

    @Column(name = "departure_time")
    private LocalDateTime departureTime;
}
