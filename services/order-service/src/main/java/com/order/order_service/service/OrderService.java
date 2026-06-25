package com.order.order_service.service;

import com.order.order_service.constant.KafkaTopic;
import com.order.order_service.dto.event.OrderStatusChangedEvent;
import com.order.order_service.dto.request.CreateOrderRequest;
import com.order.order_service.dto.request.UpdateOrderStatusRequest;
import com.order.order_service.dto.response.OrderResponse;
import com.order.order_service.dto.response.PageResponse;
import com.order.order_service.entity.Order;
import com.order.order_service.entity.OrderStatusHistory;
import com.order.order_service.enums.CustodyStatus;
import com.order.order_service.exception.ApplicationException;
import com.order.order_service.exception.ErrorCode;
import com.order.order_service.mapper.OrderMapper;
import com.order.order_service.repository.OrderRepository;
import com.order.order_service.repository.OrderStatusHistoryRepository;
import com.order.order_service.repository.PackageCustodyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final PackageCustodyRepository custodyRepository;
    private final OrderSagaService orderSagaService;
    private final OutboxService outboxService;
    private final OrderMapper orderMapper;

    public OrderResponse createOrder(String senderId, CreateOrderRequest request) {
        return orderSagaService.createOrder(senderId, request);
    }

    public OrderResponse getById(String orderId) {
        return orderMapper.toResponse(findOrThrow(orderId));
    }

    public OrderResponse getByTrackingCode(String trackingCode) {
        return orderMapper.toResponse(orderRepository.findByTrackingCode(trackingCode)
                .orElseThrow(() -> new ApplicationException(ErrorCode.ORDER_NOT_FOUND)));
    }

    public PageResponse<OrderResponse> getMyOrders(String senderId, int page, int size) {
        Page<Order> result = orderRepository.findBySenderId(senderId,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return toPageResponse(result, page, size);
    }

    public PageResponse<OrderResponse> getByStatus(String status, int page, int size) {
        var orderStatus = com.order.order_service.enums.OrderStatus.valueOf(status);
        Page<Order> result = orderRepository.findByStatus(orderStatus,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return toPageResponse(result, page, size);
    }

    @Transactional
    public OrderResponse updateStatus(String orderId, String changedBy, UpdateOrderStatusRequest request) {
        Order order = findOrThrow(orderId);

        if (order.getStatus() == com.order.order_service.enums.OrderStatus.CANCELLED) {
            throw new ApplicationException(ErrorCode.ORDER_CANCELLED);
        }

        order.setStatus(request.getStatus());
        orderRepository.save(order);

        statusHistoryRepository.save(OrderStatusHistory.builder()
                .orderId(orderId)
                .status(request.getStatus())
                .note(request.getNote())
                .changedBy(changedBy)
                .build());

        // If delivered or failed, release current custody
        if (request.getStatus() == com.order.order_service.enums.OrderStatus.DELIVERED
                || request.getStatus() == com.order.order_service.enums.OrderStatus.DELIVERY_FAILED) {
            releaseCustody(orderId);
        }

        outboxService.saveEvent("ORDER", orderId, KafkaTopic.ORDER_STATUS_CHANGED,
                OrderStatusChangedEvent.builder()
                        .orderId(orderId)
                        .trackingCode(order.getTrackingCode())
                        .userId(changedBy)
                        .newStatus(request.getStatus().name())
                        .note(request.getNote())
                        .changedAt(LocalDateTime.now())
                        .build());

        return orderMapper.toResponse(order);
    }

    public PageResponse<OrderResponse> getAssignedOrders(String shipperId, int page, int size) {
        Page<Order> result = orderRepository.findByShipperId(shipperId,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return toPageResponse(result, page, size);
    }

    @Transactional
    public OrderResponse assignShipper(String orderId, String shipperId) {
        Order order = findOrThrow(orderId);
        order.setShipperId(shipperId);
        orderRepository.save(order);
        return orderMapper.toResponse(order);
    }

    @Transactional
    public void cancelOrder(String orderId, String cancelledBy) {
        Order order = findOrThrow(orderId);
        if (order.getStatus() == com.order.order_service.enums.OrderStatus.CANCELLED) {
            throw new ApplicationException(ErrorCode.ORDER_CANCELLED);
        }
        order.setStatus(com.order.order_service.enums.OrderStatus.CANCELLED);
        orderRepository.save(order);

        statusHistoryRepository.save(OrderStatusHistory.builder()
                .orderId(orderId)
                .status(com.order.order_service.enums.OrderStatus.CANCELLED)
                .note("Cancelled by " + cancelledBy)
                .changedBy(cancelledBy)
                .build());

        releaseCustody(orderId);

        outboxService.saveEvent("ORDER", orderId, KafkaTopic.ORDER_CANCELLED,
                OrderStatusChangedEvent.builder()
                        .orderId(orderId)
                        .trackingCode(order.getTrackingCode())
                        .userId(cancelledBy)
                        .newStatus(com.order.order_service.enums.OrderStatus.CANCELLED.name())
                        .note("Cancelled by " + cancelledBy)
                        .changedAt(LocalDateTime.now())
                        .build());
    }

    public List<OrderStatusHistory> getStatusHistory(String orderId) {
        findOrThrow(orderId);
        return statusHistoryRepository.findByOrderIdOrderByChangedAtAsc(orderId);
    }

    private void releaseCustody(String orderId) {
        custodyRepository.findByOrderIdAndStatus(orderId, CustodyStatus.HOLDING)
                .ifPresent(custody -> {
                    custody.setStatus(CustodyStatus.RELEASED);
                    custody.setReleasedAt(LocalDateTime.now());
                    custodyRepository.save(custody);
                });
    }

    private Order findOrThrow(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ApplicationException(ErrorCode.ORDER_NOT_FOUND));
    }

    private PageResponse<OrderResponse> toPageResponse(Page<Order> page, int pageNum, int size) {
        return PageResponse.<OrderResponse>builder()
                .content(page.getContent().stream().map(orderMapper::toResponse).toList())
                .page(pageNum)
                .size(size)
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }
}
