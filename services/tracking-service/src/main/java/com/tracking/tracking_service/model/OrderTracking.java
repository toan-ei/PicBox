package com.tracking.tracking_service.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "order_tracking")
public class OrderTracking {

    @Id
    private String id;

    @Indexed(unique = true)
    private String orderId;

    private String currentStatus;
    private String currentLocation;
    private String shipperId;

    private List<TrackingEvent> timeline;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}