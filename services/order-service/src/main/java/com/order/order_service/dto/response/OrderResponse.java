package com.order.order_service.dto.response;

import com.order.order_service.enums.OrderStatus;
import com.order.order_service.enums.PickupMethod;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderResponse {
    private String id;
    private String trackingCode;

    private String senderId;
    private String senderName;
    private String senderPhone;

    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;

    private String originBranchId;
    private String originBranchName;
    private String destBranchId;
    private String destBranchName;

    private Double weight;
    private Double width;
    private Double height;
    private Double length;

    private BigDecimal fee;
    private BigDecimal codAmount;

    private PickupMethod pickupMethod;
    private OrderStatus status;
    private String regionCode;
    private String shipperId;
    private String note;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
