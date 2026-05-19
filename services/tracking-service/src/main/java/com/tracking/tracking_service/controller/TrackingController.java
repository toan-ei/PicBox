package com.tracking.tracking_service.controller;

import com.tracking.tracking_service.dto.LocationRequest;
import com.tracking.tracking_service.dto.TrackingResponse;
import com.tracking.tracking_service.service.TrackingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final TrackingService trackingService;

    @GetMapping("/{orderId}")
    public ResponseEntity<TrackingResponse> getTracking(@PathVariable String orderId) {
        log.info("Getting tracking for order: {}", orderId);
        return ResponseEntity.ok(trackingService.getTracking(orderId));
    }

    @PostMapping("/location")
    public ResponseEntity<Void> updateLocation(@RequestBody LocationRequest request) {
        log.info("Updating location for shipper: {}", request.getShipperId());
        trackingService.updateLocation(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("tracking-service is running");
    }
}