package com.order.order_service.repository;

import com.order.order_service.entity.OrderSaga;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderSagaRepository extends JpaRepository<OrderSaga, String> {
    Optional<OrderSaga> findByOrderId(String orderId);
}
