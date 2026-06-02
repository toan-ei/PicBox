package com.notification.notification_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.notification.notification_service.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final ObjectMapper objectMapper;

    public void processNotification(NotificationEvent event) {
        log.info("Processing notification for order: {}, type: {}", 
            event.getOrderId(), event.getType());

        switch (event.getType()) {
            case "ORDER_CREATED" ->
                log.info("Sending order created notification to user: {}", event.getUserId());
            case "ORDER_DELIVERED" ->
                log.info("Sending order delivered notification to user: {}", event.getUserId());
            case "PAYMENT_SUCCESS" ->
                log.info("Sending payment success notification to user: {}", event.getUserId());
            default ->
                log.warn("Unknown notification type: {}", event.getType());
        }
    }
}