package com.tracking.tracking_service.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackingEvent {
    private String status;
    private String location;
    private String description;
    private LocalDateTime timestamp;
}