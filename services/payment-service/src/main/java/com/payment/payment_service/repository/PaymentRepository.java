package com.payment.payment_service.repository;

import com.payment.payment_service.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    Optional<Payment> findByIdempotencyKey(String idempotencyKey);
    List<Payment> findByOrderId(String orderId);
    boolean existsByIdempotencyKey(String idempotencyKey);
}
