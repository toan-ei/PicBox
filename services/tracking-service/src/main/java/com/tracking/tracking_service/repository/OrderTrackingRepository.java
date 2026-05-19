package com.tracking.tracking_service.repository;

import com.tracking.tracking_service.model.OrderTracking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OrderTrackingRepository extends MongoRepository<OrderTracking, String> {
    Optional<OrderTracking> findByOrderId(String orderId);
}