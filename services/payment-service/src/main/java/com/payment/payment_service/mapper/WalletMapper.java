package com.payment.payment_service.mapper;

import com.payment.payment_service.dto.response.WalletResponse;
import com.payment.payment_service.entity.Wallet;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WalletMapper {
    WalletResponse toResponse(Wallet wallet);
}
