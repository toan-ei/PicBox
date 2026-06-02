package com.order.order_service.entity;

import com.order.order_service.enums.ImageType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "order_images")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String orderId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ImageType imageType;

    @Column(nullable = false, length = 1000)
    private String url;

    private String uploadedBy;

    @CreationTimestamp
    private LocalDateTime uploadedAt;
}
