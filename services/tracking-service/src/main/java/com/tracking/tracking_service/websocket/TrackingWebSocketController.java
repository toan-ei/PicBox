package com.tracking.tracking_service.websocket;

import com.tracking.tracking_service.dto.LocationRequest;
import com.tracking.tracking_service.service.TrackingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class TrackingWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final TrackingService trackingService;

    @MessageMapping("/location")
    public void updateLocation(LocationRequest request) {
        log.info("WebSocket location from shipper: {}", request.getShipperId());
        trackingService.updateLocation(request);
        messagingTemplate.convertAndSend(
                "/topic/tracking/" + request.getOrderId(),
                request
        );
    }
}