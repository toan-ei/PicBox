package com.payment.payment_service.repository;

import com.payment.payment_service.entity.CodSettlement;
import com.payment.payment_service.enums.SettlementStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CodSettlementRepository extends JpaRepository<CodSettlement, String> {
    Optional<CodSettlement> findByOrderId(String orderId);
    List<CodSettlement> findByShipperIdAndStatus(String shipperId, SettlementStatus status);
}
