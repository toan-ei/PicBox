package com.notification.notification_service.dto.response;

import com.notification.notification_service.entity.NotificationStatus;
import com.notification.notification_service.entity.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private String id;
    private String userId;
    private NotificationType type;
    private String referenceId;
    private String subject;
    private String body;
    private NotificationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime sentAt;
}
