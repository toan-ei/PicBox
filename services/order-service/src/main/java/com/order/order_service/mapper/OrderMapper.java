package com.order.order_service.mapper;

import com.order.order_service.dto.response.OrderResponse;
import com.order.order_service.entity.Order;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderResponse toResponse(Order order);
}
