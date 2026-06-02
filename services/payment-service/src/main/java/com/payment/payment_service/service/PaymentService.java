package com.payment.payment_service.service;

import com.payment.payment_service.constant.KafkaTopic;
import com.payment.payment_service.dto.event.PaymentSuccessEvent;
import com.payment.payment_service.dto.request.CreatePaymentRequest;
import com.payment.payment_service.dto.response.PaymentResponse;
import com.payment.payment_service.entity.Payment;
import com.payment.payment_service.enums.PaymentStatus;
import com.payment.payment_service.exception.ApplicationException;
import com.payment.payment_service.exception.ErrorCode;
import com.payment.payment_service.mapper.PaymentMapper;
import com.payment.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final KafkaProducerService kafkaProducerService;
    private final PaymentMapper paymentMapper;

    @Transactional
    public PaymentResponse createPayment(String payerId, CreatePaymentRequest request) {
        // Idempotency check — return existing payment if same key is used again
        if (paymentRepository.existsByIdempotencyKey(request.getIdempotencyKey())) {
            Payment existing = paymentRepository.findByIdempotencyKey(request.getIdempotencyKey())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.PAYMENT_NOT_FOUND));
            log.info("Idempotent payment request detected, returning existing payment {}", existing.getId());
            return paymentMapper.toResponse(existing);
        }

        Payment payment = paymentRepository.save(Payment.builder()
                .orderId(request.getOrderId())
                .payerId(payerId)
                .amount(request.getAmount())
                .method(request.getMethod())
                .status(PaymentStatus.SUCCESS)
                .idempotencyKey(request.getIdempotencyKey())
                .build());

        kafkaProducerService.send(KafkaTopic.PAYMENT_SUCCESS, payment.getOrderId(),
                PaymentSuccessEvent.builder()
                        .paymentId(payment.getId())
                        .orderId(payment.getOrderId())
                        .payerId(payerId)
                        .amount(payment.getAmount())
                        .method(payment.getMethod().name())
                        .paidAt(LocalDateTime.now())
                        .build());

        return paymentMapper.toResponse(payment);
    }

    public PaymentResponse getById(String paymentId) {
        return paymentMapper.toResponse(paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ApplicationException(ErrorCode.PAYMENT_NOT_FOUND)));
    }

    public List<PaymentResponse> getByOrderId(String orderId) {
        return paymentRepository.findByOrderId(orderId).stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    @Transactional
    public PaymentResponse refund(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ApplicationException(ErrorCode.PAYMENT_NOT_FOUND));
        payment.setStatus(PaymentStatus.REFUNDED);
        return paymentMapper.toResponse(paymentRepository.save(payment));
    }
}
