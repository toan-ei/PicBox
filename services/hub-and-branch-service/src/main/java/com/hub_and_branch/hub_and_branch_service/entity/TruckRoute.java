package com.hub_and_branch.hub_and_branch_service.entity;

import com.hub_and_branch.hub_and_branch_service.enums.RouteStatus;
import com.hub_and_branch.hub_and_branch_service.enums.RouteType;
import com.hub_and_branch.hub_and_branch_service.enums.StopType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "truck_routes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TruckRoute {

    @Id
    @UuidGenerator
    private String id;

    @Column(name = "truck_id", nullable = false)
    private String truckId;

    @Enumerated(EnumType.STRING)
    @Column(name = "route_type", nullable = false, length = 30)
    private RouteType routeType;

    @Column(name = "origin_id", nullable = false)
    private String originId;

    @Enumerated(EnumType.STRING)
    @Column(name = "origin_type", nullable = false, length = 20)
    private StopType originType;

    @Column(name = "dest_id", nullable = false)
    private String destId;

    @Enumerated(EnumType.STRING)
    @Column(name = "dest_type", nullable = false, length = 20)
    private StopType destType;

    @Column(name = "scheduled_departure")
    private LocalDateTime scheduledDeparture;

    @Column(name = "actual_departure")
    private LocalDateTime actualDeparture;

    @Column(name = "actual_arrival")
    private LocalDateTime actualArrival;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private RouteStatus status = RouteStatus.SCHEDULED;
}
