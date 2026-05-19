package com.tracking.tracking_service.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "location_logs")
public class LocationLog {
    @Id
    private String id;
    @Indexed
    private String shipperId;
    @Indexed
    private String orderId;
    private double[] coordinates;
    private LocalDateTime timestamp;
}