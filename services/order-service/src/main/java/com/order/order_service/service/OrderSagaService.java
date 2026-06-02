package com.order.order_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.order.order_service.constant.KafkaTopic;
import com.order.order_service.dto.event.OrderCreatedEvent;
import com.order.order_service.dto.event.ShipperAssignedEvent;
import com.order.order_service.dto.request.CreateOrderRequest;
import com.order.order_service.dto.response.OrderResponse;
import com.order.order_service.entity.*;
import com.order.order_service.enums.*;
import com.order.order_service.exception.ApplicationException;
import com.order.order_service.exception.ErrorCode;
import com.order.order_service.mapper.OrderMapper;
import com.order.order_service.repository.*;
import com.order.order_service.repository.httpclient.DebitWalletRequest;
import com.order.order_service.repository.httpclient.PaymentClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderSagaService {

    private final OrderRepository orderRepository;
    private final OrderSagaRepository orderSagaRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final PackageCustodyRepository custodyRepository;
    private final ShipperRouteRepository shipperRouteRepository;
    private final RouteOrderRepository routeOrderRepository;
    private final OutboxService outboxService;
    private final PaymentClient paymentClient;
    private final OrderMapper orderMapper;
    private final ObjectMapper objectMapper;

    @Transactional
    public OrderResponse createOrder(String senderId, CreateOrderRequest request) {
        String tempOrderId = UUID.randomUUID().toString();

        // Save saga state
        OrderSaga saga = saveSaga(tempOrderId, request, SagaStatus.STARTED, SagaStep.INIT);

        String orderId = null;
        boolean paymentDebited = false;

        try {
            // Step 1: Debit wallet
            if (request.getFee() != null && request.getFee().compareTo(java.math.BigDecimal.ZERO) > 0) {
                try {
                    var debitResp = paymentClient.debitWallet(DebitWalletRequest.builder()
                            .userId(senderId)
                            .amount(request.getFee())
                            .referenceId(tempOrderId)
                            .description("Payment for order " + tempOrderId)
                            .build());
                    if (debitResp.getCode() != 0) {
                        throw new ApplicationException(ErrorCode.PAYMENT_DEBIT_FAILED);
                    }
                    paymentDebited = true;
                } catch (ApplicationException e) {
                    throw e;
                } catch (Exception e) {
                    log.warn("Payment service unavailable, proceeding without debit: {}", e.getMessage());
                }
            }
            updateSaga(saga, SagaStatus.STARTED, SagaStep.PAYMENT_DEBITED);

            // Step 2: Create order
            String trackingCode = generateTrackingCode();
            Order order = Order.builder()
                    .trackingCode(trackingCode)
                    .senderId(senderId)
                    .senderName(request.getSenderName())
                    .senderPhone(request.getSenderPhone())
                    .receiverName(request.getReceiverName())
                    .receiverPhone(request.getReceiverPhone())
                    .receiverAddress(request.getReceiverAddress())
                    .originBranchId(request.getOriginBranchId())
                    .originBranchName(request.getOriginBranchName())
                    .destBranchId(request.getDestBranchId())
                    .destBranchName(request.getDestBranchName())
                    .weight(request.getWeight())
                    .width(request.getWidth())
                    .height(request.getHeight())
                    .length(request.getLength())
                    .fee(request.getFee())
                    .codAmount(request.getCodAmount())
                    .pickupMethod(request.getPickupMethod())
                    .status(OrderStatus.PENDING)
                    .regionCode(request.getRegionCode())
                    .note(request.getNote())
                    .build();
            order = orderRepository.save(order);
            orderId = order.getId();

            // Sync saga orderId → real orderId
            saga.setOrderId(orderId);
            updateSaga(saga, SagaStatus.STARTED, SagaStep.ORDER_CREATED);

            // Record initial status history
            statusHistoryRepository.save(OrderStatusHistory.builder()
                    .orderId(orderId)
                    .status(OrderStatus.PENDING)
                    .note("Order created")
                    .changedBy(senderId)
                    .build());

            // Step 3: Initialize custody chain — sender holds the package
            custodyRepository.save(PackageCustody.builder()
                    .orderId(orderId)
                    .custodyType(CustodyType.SENDER)
                    .custodyId(senderId)
                    .custodyName(request.getSenderName())
                    .status(CustodyStatus.HOLDING)
                    .build());
            updateSaga(saga, SagaStatus.STARTED, SagaStep.CUSTODY_INITIALIZED);

            // Step 4: If pickup_at_door, assign shipper and publish shipper.assigned
            if (PickupMethod.PICKUP_AT_DOOR.equals(request.getPickupMethod())) {
                ShipperRoute route = ShipperRoute.builder()
                        .branchId(request.getOriginBranchId())
                        .routeType(RouteType.PICKUP)
                        .routeDate(LocalDate.now())
                        .status(RouteStatus.ASSIGNED)
                        .build();
                route = shipperRouteRepository.save(route);

                routeOrderRepository.save(RouteOrder.builder()
                        .routeId(route.getId())
                        .orderId(orderId)
                        .sequence(1)
                        .status(OrderStatus.PENDING)
                        .build());

                outboxService.saveEvent("ORDER", orderId, KafkaTopic.SHIPPER_ASSIGNED,
                        ShipperAssignedEvent.builder()
                                .routeId(route.getId())
                                .branchId(request.getOriginBranchId())
                                .routeType(RouteType.PICKUP.name())
                                .routeDate(LocalDate.now())
                                .totalOrders(1)
                                .build());
                updateSaga(saga, SagaStatus.STARTED, SagaStep.SHIPPER_ASSIGNED);
            }

            // Step 5: Publish order.created via Outbox
            outboxService.saveEvent("ORDER", orderId, KafkaTopic.ORDER_CREATED,
                    OrderCreatedEvent.builder()
                            .orderId(orderId)
                            .trackingCode(trackingCode)
                            .senderId(senderId)
                            .senderPhone(request.getSenderPhone())
                            .receiverName(request.getReceiverName())
                            .receiverPhone(request.getReceiverPhone())
                            .destBranchId(request.getDestBranchId())
                            .fee(request.getFee())
                            .codAmount(request.getCodAmount())
                            .pickupMethod(request.getPickupMethod().name())
                            .createdAt(LocalDateTime.now())
                            .build());

            updateSaga(saga, SagaStatus.COMPLETED, SagaStep.COMPLETED);
            return orderMapper.toResponse(order);

        } catch (Exception e) {
            log.error("Saga failed for order {}: {}", tempOrderId, e.getMessage());
            compensate(saga, senderId, request, paymentDebited, tempOrderId, orderId);
            if (e instanceof ApplicationException ae) throw ae;
            throw new ApplicationException(ErrorCode.SAGA_FAILED);
        }
    }

    private void compensate(OrderSaga saga, String senderId, CreateOrderRequest request,
                            boolean paymentDebited, String referenceId, String orderId) {
        saga.setStatus(SagaStatus.COMPENSATING);
        orderSagaRepository.save(saga);

        if (paymentDebited && request.getFee() != null) {
            try {
                paymentClient.creditWallet(DebitWalletRequest.builder()
                        .userId(senderId)
                        .amount(request.getFee())
                        .referenceId(referenceId)
                        .description("Refund for failed order " + referenceId)
                        .build());
            } catch (Exception ex) {
                log.error("Compensation failed — wallet refund error: {}", ex.getMessage());
            }
        }

        if (orderId != null) {
            orderRepository.deleteById(orderId);
        }

        saga.setStatus(SagaStatus.COMPENSATED);
        saga.setFailureReason("Saga compensation executed");
        orderSagaRepository.save(saga);
    }

    private OrderSaga saveSaga(String orderId, CreateOrderRequest request,
                               SagaStatus status, SagaStep step) {
        try {
            return orderSagaRepository.save(OrderSaga.builder()
                    .orderId(orderId)
                    .status(status)
                    .currentStep(step)
                    .requestPayload(objectMapper.writeValueAsString(request))
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("Failed to save saga", e);
        }
    }

    private void updateSaga(OrderSaga saga, SagaStatus status, SagaStep step) {
        saga.setStatus(status);
        saga.setCurrentStep(step);
        orderSagaRepository.save(saga);
    }

    private String generateTrackingCode() {
        String uid = UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
        return "PKB" + uid;
    }
}
