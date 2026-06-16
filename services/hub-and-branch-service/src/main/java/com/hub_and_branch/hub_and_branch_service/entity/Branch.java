package com.hub_and_branch.hub_and_branch_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "branches")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Branch {

    @Id
    @UuidGenerator
    private String id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "hub_id", nullable = false)
    private String hubId;

    @Column(name = "area_id", nullable = false)
    private String areaId;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(length = 100)
    private String district;

    @Column(length = 100)
    private String ward;

    @Column(nullable = false, length = 100)
    private String province;

    private Double latitude;

    private Double longitude;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(name = "max_capacity")
    private Integer maxCapacity;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
