package com.order.order_service.repository;

import com.order.order_service.entity.PackageCustody;
import com.order.order_service.enums.CustodyStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PackageCustodyRepository extends JpaRepository<PackageCustody, String> {
    List<PackageCustody> findByOrderIdOrderByTakenAtAsc(String orderId);
    Optional<PackageCustody> findByOrderIdAndStatus(String orderId, CustodyStatus status);
}
