package com.tracking.tracking_service.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tracking.tracking_service.dto.OrderCreatedEvent;
import com.tracking.tracking_service.service.TrackingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final TrackingService trackingService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "order.created", groupId = "tracking-service")
    public void handleOrderCreated(
            @Payload String message,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic
    ) {
        log.info("Received message from topic: {}", topic);
        try {
            OrderCreatedEvent event = objectMapper.readValue(message, OrderCreatedEvent.class);
            trackingService.createTracking(event);
        } catch (Exception e) {
            log.error("Error processing order.created: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "order.status_changed", groupId = "tracking-service")
    public void handleOrderStatusChanged(@Payload String message) {
        log.info("Order status changed: {}", message);
    }
}