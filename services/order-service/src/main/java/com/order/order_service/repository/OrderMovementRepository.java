package com.order.order_service.repository;

import com.order.order_service.entity.OrderMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderMovementRepository extends JpaRepository<OrderMovement, String> {
    List<OrderMovement> findByOrderIdOrderByHappenedAtAsc(String orderId);
}
