package com.hub_and_branch.hub_and_branch_service.entity;

import com.hub_and_branch.hub_and_branch_service.enums.SortingStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "sorting_queues")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SortingQueue {

    @Id
    @UuidGenerator
    private String id;

    @Column(name = "hub_id", nullable = false)
    private String hubId;

    @Column(name = "order_id", nullable = false)
    private String orderId;

    @Column(nullable = false)
    @Builder.Default
    private int priority = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private SortingStatus status = SortingStatus.PENDING;

    @Column(name = "dest_branch_id")
    private String destBranchId;

    @Column(name = "sorted_at")
    private LocalDateTime sortedAt;
}
