package com.staff.staff_service.kafka.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.staff.staff_service.kafka.event.ShipperAssignedEvent;
import com.staff.staff_service.service.StaffService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ShipperAssignedConsumer {

    private final ObjectMapper objectMapper;
    private final StaffService staffService;

    @KafkaListener(topics = "shipper.assigned", groupId = "staff-service")
    public void consume(String message) {
        try {
            ShipperAssignedEvent event = objectMapper.readValue(message, ShipperAssignedEvent.class);
            log.info("Shipper {} assigned route {} with {} orders",
                    event.getShipperId(), event.getRouteId(), event.getTotalOrders());
            staffService.evictCache(event.getShipperId());
        } catch (Exception e) {
            log.error("Failed to process shipper.assigned event: {}", e.getMessage());
        }
    }
}
