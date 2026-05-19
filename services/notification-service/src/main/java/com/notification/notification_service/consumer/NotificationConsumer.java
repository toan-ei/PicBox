package com.notification.notification_service.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.notification.notification_service.dto.NotificationEvent;
import com.notification.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationConsumer {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "notification.events", groupId = "notification-service")
    public void handleNotification(@Payload String message) {
        log.info("Received notification event: {}", message);
        try {
            NotificationEvent event = objectMapper.readValue(message, NotificationEvent.class);
            notificationService.processNotification(event);
        } catch (Exception e) {
            log.error("Error processing notification event: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "order.created", groupId = "notification-service")
    public void handleOrderCreated(@Payload String message) {
        log.info("Order created, sending notification: {}", message);
        try {
            NotificationEvent event = new NotificationEvent();
            event.setType("ORDER_CREATED");
            event.setMessage(message);
            notificationService.processNotification(event);
        } catch (Exception e) {
            log.error("Error processing order.created event: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "payment.success", groupId = "notification-service")
    public void handlePaymentSuccess(@Payload String message) {
        log.info("Payment success, sending notification: {}", message);
        try {
            NotificationEvent event = new NotificationEvent();
            event.setType("PAYMENT_SUCCESS");
            event.setMessage(message);
            notificationService.processNotification(event);
        } catch (Exception e) {
            log.error("Error processing payment.success event: {}", e.getMessage());
        }
    }
}