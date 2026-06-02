package com.payment.payment_service.repository;

import com.payment.payment_service.entity.WalletTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, String> {
    Page<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(String walletId, Pageable pageable);
}
