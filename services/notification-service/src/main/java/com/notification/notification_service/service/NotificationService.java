package com.notification.notification_service.service;

import com.notification.notification_service.dto.NotificationEvent;
import com.notification.notification_service.dto.event.OrderCreatedEvent;
import com.notification.notification_service.dto.event.OrderStatusChangedEvent;
import com.notification.notification_service.dto.event.PaymentSuccessEvent;
import com.notification.notification_service.dto.response.NotificationResponse;
import com.notification.notification_service.entity.Notification;
import com.notification.notification_service.entity.NotificationStatus;
import com.notification.notification_service.entity.NotificationType;
import com.notification.notification_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    @Transactional
    public void processOrderCreated(OrderCreatedEvent event) {
        String subject = "Đơn hàng #" + event.getTrackingCode() + " đã được tạo";
        String body = String.format(
                "Đơn hàng của bạn đã được tạo thành công.\n" +
                "Mã vận đơn: %s\n" +
                "Người nhận: %s - %s\n" +
                "Phí vận chuyển: %s VNĐ",
                event.getTrackingCode(),
                event.getReceiverName(),
                event.getReceiverPhone(),
                event.getFee()
        );

        Notification notification = save(event.getSenderId(), NotificationType.ORDER_CREATED,
                event.getOrderId(), subject, body, null);
        dispatchEmail(notification, null, subject, body);
    }

    @Transactional
    public void processOrderStatusChanged(OrderStatusChangedEvent event) {
        String subject = "Cập nhật đơn hàng #" + event.getTrackingCode();
        String body = String.format(
                "Đơn hàng %s đã chuyển trạng thái: %s → %s",
                event.getTrackingCode(), event.getOldStatus(), event.getNewStatus()
        );

        Notification notification = save(event.getUserId(), NotificationType.ORDER_STATUS_CHANGED,
                event.getOrderId(), subject, body, null);
        dispatchEmail(notification, null, subject, body);
    }

    @Transactional
    public void processOrderCancelled(OrderStatusChangedEvent event) {
        String subject = "Đơn hàng #" + event.getTrackingCode() + " đã bị huỷ";
        String body = "Đơn hàng " + event.getTrackingCode() + " đã bị huỷ.";
        if (event.getNote() != null) body += "\nLý do: " + event.getNote();

        Notification notification = save(event.getUserId(), NotificationType.ORDER_CANCELLED,
                event.getOrderId(), subject, body, null);
        dispatchEmail(notification, null, subject, body);
    }

    @Transactional
    public void processPaymentSuccess(PaymentSuccessEvent event) {
        String subject = "Thanh toán thành công cho đơn hàng";
        String body = String.format(
                "Thanh toán thành công!\nMã đơn: %s\nSố tiền: %s VNĐ\nPhương thức: %s",
                event.getOrderId(), event.getAmount(), event.getMethod()
        );

        Notification notification = save(event.getPayerId(), NotificationType.PAYMENT_SUCCESS,
                event.getOrderId(), subject, body, null);
        dispatchEmail(notification, null, subject, body);
    }

    @Transactional
    public void processGeneric(NotificationEvent event) {
        Notification notification = save(event.getUserId(), NotificationType.GENERIC,
                event.getOrderId(), event.getType(), event.getMessage(), null);
        dispatchEmail(notification, null, event.getType(), event.getMessage());
    }

    public Page<NotificationResponse> getByUser(String userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toResponse);
    }

    private Notification save(String userId, NotificationType type, String referenceId,
                              String subject, String body, String email) {
        return notificationRepository.save(Notification.builder()
                .userId(userId)
                .type(type)
                .referenceId(referenceId)
                .subject(subject)
                .body(body)
                .recipientEmail(email)
                .status(NotificationStatus.PENDING)
                .build());
    }

    private void dispatchEmail(Notification notification, String to, String subject, String body) {
        if (to == null) {
            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            notificationRepository.save(notification);
            return;
        }
        try {
            emailService.send(to, subject, body);
            notification.setRecipientEmail(to);
            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
        } catch (Exception e) {
            notification.setStatus(NotificationStatus.FAILED);
            notification.setErrorMessage(e.getMessage());
        }
        notificationRepository.save(notification);
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .type(n.getType())
                .referenceId(n.getReferenceId())
                .subject(n.getSubject())
                .body(n.getBody())
                .status(n.getStatus())
                .createdAt(n.getCreatedAt())
                .sentAt(n.getSentAt())
                .build();
    }
}
