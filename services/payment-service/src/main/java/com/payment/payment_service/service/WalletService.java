package com.payment.payment_service.service;

import com.payment.payment_service.dto.request.CreateWalletRequest;
import com.payment.payment_service.dto.request.InternalDebitRequest;
import com.payment.payment_service.dto.request.TopUpRequest;
import com.payment.payment_service.dto.response.InternalDebitResponse;
import com.payment.payment_service.dto.response.WalletResponse;
import com.payment.payment_service.entity.Wallet;
import com.payment.payment_service.entity.WalletTransaction;
import com.payment.payment_service.enums.WalletTransactionType;
import com.payment.payment_service.exception.ApplicationException;
import com.payment.payment_service.exception.ErrorCode;
import com.payment.payment_service.mapper.WalletMapper;
import com.payment.payment_service.repository.WalletRepository;
import com.payment.payment_service.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final WalletMapper walletMapper;

    @Transactional
    public WalletResponse createWallet(CreateWalletRequest request) {
        if (walletRepository.findByUserId(request.getUserId()).isPresent()) {
            throw new ApplicationException(ErrorCode.WALLET_ALREADY_EXISTS);
        }
        Wallet wallet = Wallet.builder()
                .userId(request.getUserId())
                .balance(request.getInitialBalance())
                .build();
        return walletMapper.toResponse(walletRepository.save(wallet));
    }

    public WalletResponse getByUserId(String userId) {
        return walletMapper.toResponse(findWalletOrThrow(userId));
    }

    @Transactional
    @Retryable(retryFor = OptimisticLockingFailureException.class, maxAttempts = 3,
               backoff = @Backoff(delay = 100, multiplier = 2))
    public WalletResponse topUp(String userId, TopUpRequest request) {
        Wallet wallet = findWalletOrThrow(userId);
        BigDecimal newBalance = wallet.getBalance().add(request.getAmount());
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

        recordTransaction(wallet.getId(), WalletTransactionType.CREDIT, request.getAmount(),
                newBalance, null, "TOP_UP", request.getDescription());

        return walletMapper.toResponse(wallet);
    }

    // Called by Order Service via Feign (internal endpoint) — Optimistic Locking protects concurrent debits
    @Transactional
    @Retryable(retryFor = OptimisticLockingFailureException.class, maxAttempts = 3,
               backoff = @Backoff(delay = 100, multiplier = 2))
    public InternalDebitResponse debit(InternalDebitRequest request) {
        Wallet wallet = walletRepository.findByUserIdForUpdate(request.getUserId())
                .orElseThrow(() -> new ApplicationException(ErrorCode.WALLET_NOT_FOUND));

        if (wallet.getBalance().compareTo(request.getAmount()) < 0) {
            throw new ApplicationException(ErrorCode.INSUFFICIENT_BALANCE);
        }

        BigDecimal newBalance = wallet.getBalance().subtract(request.getAmount());
        wallet.setBalance(newBalance);

        try {
            walletRepository.save(wallet);
        } catch (OptimisticLockingFailureException e) {
            throw new ApplicationException(ErrorCode.OPTIMISTIC_LOCK_FAILURE);
        }

        WalletTransaction tx = recordTransaction(wallet.getId(), WalletTransactionType.DEBIT,
                request.getAmount(), newBalance, request.getReferenceId(), "ORDER_PAYMENT",
                request.getDescription());

        return InternalDebitResponse.builder()
                .transactionId(tx.getId())
                .balanceAfter(newBalance)
                .build();
    }

    // Called for saga compensation (refund on order creation failure)
    @Transactional
    @Retryable(retryFor = OptimisticLockingFailureException.class, maxAttempts = 3,
               backoff = @Backoff(delay = 100, multiplier = 2))
    public void credit(InternalDebitRequest request) {
        Wallet wallet = findWalletOrThrow(request.getUserId());
        BigDecimal newBalance = wallet.getBalance().add(request.getAmount());
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

        recordTransaction(wallet.getId(), WalletTransactionType.CREDIT, request.getAmount(),
                newBalance, request.getReferenceId(), "REFUND", request.getDescription());
    }

    private WalletTransaction recordTransaction(String walletId, WalletTransactionType type,
                                                BigDecimal amount, BigDecimal balanceAfter,
                                                String referenceId, String referenceType,
                                                String description) {
        return transactionRepository.save(WalletTransaction.builder()
                .walletId(walletId)
                .type(type)
                .amount(amount)
                .balanceAfter(balanceAfter)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .description(description)
                .build());
    }

    private Wallet findWalletOrThrow(String userId) {
        return walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ApplicationException(ErrorCode.WALLET_NOT_FOUND));
    }
}
