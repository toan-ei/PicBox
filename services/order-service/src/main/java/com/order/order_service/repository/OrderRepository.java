package com.order.order_service.repository;

import com.order.order_service.entity.Order;
import com.order.order_service.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, String> {
    Optional<Order> findByTrackingCode(String trackingCode);
    Page<Order> findBySenderId(String senderId, Pageable pageable);
    Page<Order> findByShipperId(String shipperId, Pageable pageable);
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    Page<Order> findByDestBranchIdAndStatus(String destBranchId, OrderStatus status, Pageable pageable);
    boolean existsByTrackingCode(String trackingCode);
}
