package com.tracking.tracking_service.service;

import com.tracking.tracking_service.dto.LocationRequest;
import com.tracking.tracking_service.dto.OrderCreatedEvent;
import com.tracking.tracking_service.dto.TrackingResponse;
import com.tracking.tracking_service.model.LocationLog;
import com.tracking.tracking_service.model.OrderTracking;
import com.tracking.tracking_service.model.TrackingEvent;
import com.tracking.tracking_service.repository.LocationLogRepository;
import com.tracking.tracking_service.repository.OrderTrackingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrackingService {

    private final OrderTrackingRepository orderTrackingRepository;
    private final LocationLogRepository locationLogRepository;

    public void createTracking(OrderCreatedEvent event) {
        log.info("Creating tracking for order: {}", event.getOrderId());
        OrderTracking tracking = OrderTracking.builder()
                .orderId(event.getOrderId())
                .currentStatus("PENDING")
                .currentLocation(event.getPickupAddress())
                .timeline(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        TrackingEvent firstEvent = TrackingEvent.builder()
                .status("PENDING")
                .location(event.getPickupAddress())
                .description("Đơn hàng đã được tạo")
                .timestamp(LocalDateTime.now())
                .build();

        tracking.getTimeline().add(firstEvent);
        orderTrackingRepository.save(tracking);
        log.info("Tracking created for order: {}", event.getOrderId());
    }

    public void updateLocation(LocationRequest request) {
        log.info("Updating location for shipper: {}", request.getShipperId());
        LocationLog locationLog = LocationLog.builder()
                .shipperId(request.getShipperId())
                .orderId(request.getOrderId())
                .coordinates(new double[]{request.getLongitude(), request.getLatitude()})
                .timestamp(LocalDateTime.now())
                .build();
        locationLogRepository.save(locationLog);

        orderTrackingRepository.findByOrderId(request.getOrderId())
                .ifPresent(tracking -> {
                    tracking.setShipperId(request.getShipperId());
                    tracking.setUpdatedAt(LocalDateTime.now());
                    orderTrackingRepository.save(tracking);
                });
    }

    public TrackingResponse getTracking(String orderId) {
        OrderTracking tracking = orderTrackingRepository
                .findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Tracking not found: " + orderId));

        return TrackingResponse.builder()
                .orderId(tracking.getOrderId())
                .currentStatus(tracking.getCurrentStatus())
                .currentLocation(tracking.getCurrentLocation())
                .shipperId(tracking.getShipperId())
                .timeline(tracking.getTimeline())
                .updatedAt(tracking.getUpdatedAt())
                .build();
    }
}