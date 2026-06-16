package com.hub_and_branch.hub_and_branch_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "areas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Area {

    @Id
    @UuidGenerator
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "region_id", nullable = false)
    private String regionId;

    @Column(length = 255)
    private String description;
}
