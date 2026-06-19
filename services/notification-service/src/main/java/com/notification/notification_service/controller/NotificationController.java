package com.notification.notification_service.controller;

import com.notification.notification_service.dto.response.ApiResponse;
import com.notification.notification_service.dto.response.NotificationResponse;
import com.notification.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ApiResponse<Page<NotificationResponse>> getByUser(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.<Page<NotificationResponse>>builder()
                .result(notificationService.getByUser(userId, PageRequest.of(page, size)))
                .build();
    }
}
