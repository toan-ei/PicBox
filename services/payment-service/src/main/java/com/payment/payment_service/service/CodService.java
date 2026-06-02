package com.payment.payment_service.service;

import com.payment.payment_service.dto.request.CodCollectRequest;
import com.payment.payment_service.entity.CodSettlement;
import com.payment.payment_service.enums.SettlementStatus;
import com.payment.payment_service.exception.ApplicationException;
import com.payment.payment_service.exception.ErrorCode;
import com.payment.payment_service.repository.CodSettlementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CodService {

    private final CodSettlementRepository codSettlementRepository;

    @Transactional
    public CodSettlement createCodSettlement(CodCollectRequest request) {
        if (codSettlementRepository.findByOrderId(request.getOrderId()).isPresent()) {
            throw new ApplicationException(ErrorCode.COD_ALREADY_COLLECTED);
        }
        return codSettlementRepository.save(CodSettlement.builder()
                .orderId(request.getOrderId())
                .shipperId(request.getShipperId())
                .senderId(request.getSenderId())
                .amount(request.getAmount())
                .status(SettlementStatus.PENDING)
                .build());
    }

    @Transactional
    public CodSettlement collect(String orderId) {
        CodSettlement cod = findOrThrow(orderId);
        if (cod.getStatus() != SettlementStatus.PENDING) {
            throw new ApplicationException(ErrorCode.COD_ALREADY_COLLECTED);
        }
        cod.setStatus(SettlementStatus.COLLECTED);
        cod.setCollectedAt(LocalDateTime.now());
        return codSettlementRepository.save(cod);
    }

    @Transactional
    public CodSettlement settle(String orderId) {
        CodSettlement cod = findOrThrow(orderId);
        if (cod.getStatus() != SettlementStatus.COLLECTED) {
            throw new ApplicationException(ErrorCode.COD_NOT_FOUND);
        }
        cod.setStatus(SettlementStatus.SETTLED);
        cod.setSettledAt(LocalDateTime.now());
        codSettlementRepository.save(cod);
        log.info("COD settled for order {} — amount {} credited to sender {}",
                orderId, cod.getAmount(), cod.getSenderId());
        return cod;
    }

    public List<CodSettlement> getByShipper(String shipperId, String status) {
        SettlementStatus s = SettlementStatus.valueOf(status);
        return codSettlementRepository.findByShipperIdAndStatus(shipperId, s);
    }

    public CodSettlement getByOrderId(String orderId) {
        return findOrThrow(orderId);
    }

    private CodSettlement findOrThrow(String orderId) {
        return codSettlementRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ApplicationException(ErrorCode.COD_NOT_FOUND));
    }
}
