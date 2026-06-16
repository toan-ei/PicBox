package com.hub_and_branch.hub_and_branch_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "hubs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Hub {

    @Id
    @UuidGenerator
    private String id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "area_id", nullable = false)
    private String areaId;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false, length = 100)
    private String province;

    private Double latitude;

    private Double longitude;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
