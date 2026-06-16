package com.hub_and_branch.hub_and_branch_service.repository;

import com.hub_and_branch.hub_and_branch_service.entity.TruckRoute;
import com.hub_and_branch.hub_and_branch_service.enums.RouteStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TruckRouteRepository extends JpaRepository<TruckRoute, String> {
    List<TruckRoute> findByTruckId(String truckId);
    List<TruckRoute> findByStatus(RouteStatus status);
    List<TruckRoute> findByOriginId(String originId);
    List<TruckRoute> findByDestId(String destId);
    List<TruckRoute> findByTruckIdAndStatus(String truckId, RouteStatus status);
}
