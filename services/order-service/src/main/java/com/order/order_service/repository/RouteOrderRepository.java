package com.order.order_service.repository;

import com.order.order_service.entity.RouteOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RouteOrderRepository extends JpaRepository<RouteOrder, String> {
    List<RouteOrder> findByRouteIdOrderBySequenceAsc(String routeId);
    List<RouteOrder> findByOrderId(String orderId);
}
