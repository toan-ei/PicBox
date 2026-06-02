package com.order.order_service.repository;

import com.order.order_service.entity.ShipperRoute;
import com.order.order_service.enums.RouteStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ShipperRouteRepository extends JpaRepository<ShipperRoute, String> {
    List<ShipperRoute> findByShipperIdAndRouteDate(String shipperId, LocalDate routeDate);
    List<ShipperRoute> findByBranchIdAndRouteDateAndStatus(String branchId, LocalDate routeDate, RouteStatus status);
}
