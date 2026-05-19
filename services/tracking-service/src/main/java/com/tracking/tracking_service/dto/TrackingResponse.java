package com.tracking.tracking_service.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.tracking.tracking_service.model.TrackingEvent;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackingResponse {
    private String orderId;
    private String currentStatus;
    private String currentLocation;
    private String shipperId;
    private List<TrackingEvent> timeline;
    private LocalDateTime updatedAt;
}