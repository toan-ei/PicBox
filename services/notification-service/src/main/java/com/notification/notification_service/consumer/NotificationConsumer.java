package com.notification.notification_service.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.notification.notification_service.dto.NotificationEvent;
import com.notification.notification_service.dto.event.OrderCreatedEvent;
import com.notification.notification_service.dto.event.OrderStatusChangedEvent;
import com.notification.notification_service.dto.event.PaymentSuccessEvent;
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

    @KafkaListener(topics = "order.created", groupId = "notification-service")
    public void onOrderCreated(@Payload String message) {
        log.info("Received order.created: {}", message);
        try {
            OrderCreatedEvent event = objectMapper.readValue(message, OrderCreatedEvent.class);
            notificationService.processOrderCreated(event);
        } catch (Exception e) {
            log.error("Error processing order.created: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "order.status_changed", groupId = "notification-service")
    public void onOrderStatusChanged(@Payload String message) {
        log.info("Received order.status_changed: {}", message);
        try {
            OrderStatusChangedEvent event = objectMapper.readValue(message, OrderStatusChangedEvent.class);
            notificationService.processOrderStatusChanged(event);
        } catch (Exception e) {
            log.error("Error processing order.status_changed: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "order.cancelled", groupId = "notification-service")
    public void onOrderCancelled(@Payload String message) {
        log.info("Received order.cancelled: {}", message);
        try {
            OrderStatusChangedEvent event = objectMapper.readValue(message, OrderStatusChangedEvent.class);
            notificationService.processOrderCancelled(event);
        } catch (Exception e) {
            log.error("Error processing order.cancelled: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "payment.success", groupId = "notification-service")
    public void onPaymentSuccess(@Payload String message) {
        log.info("Received payment.success: {}", message);
        try {
            PaymentSuccessEvent event = objectMapper.readValue(message, PaymentSuccessEvent.class);
            notificationService.processPaymentSuccess(event);
        } catch (Exception e) {
            log.error("Error processing payment.success: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "notification.events", groupId = "notification-service")
    public void onGenericNotification(@Payload String message) {
        log.info("Received notification.events: {}", message);
        try {
            NotificationEvent event = objectMapper.readValue(message, NotificationEvent.class);
            notificationService.processGeneric(event);
        } catch (Exception e) {
            log.error("Error processing notification.events: {}", e.getMessage());
        }
    }
}
