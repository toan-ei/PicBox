package com.tracking.tracking_service.repository;

import com.tracking.tracking_service.model.LocationLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LocationLogRepository extends MongoRepository<LocationLog, String> {
    List<LocationLog> findByOrderIdOrderByTimestampDesc(String orderId);
    List<LocationLog> findByShipperIdOrderByTimestampDesc(String shipperId);
}