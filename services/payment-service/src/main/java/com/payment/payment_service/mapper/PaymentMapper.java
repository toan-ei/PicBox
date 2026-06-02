package com.payment.payment_service.mapper;

import com.payment.payment_service.dto.response.PaymentResponse;
import com.payment.payment_service.entity.Payment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    PaymentResponse toResponse(Payment payment);
}
