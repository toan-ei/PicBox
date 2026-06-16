package com.hub_and_branch.hub_and_branch_service.repository;

import com.hub_and_branch.hub_and_branch_service.entity.TruckManifest;
import com.hub_and_branch.hub_and_branch_service.enums.ManifestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TruckManifestRepository extends JpaRepository<TruckManifest, String> {
    List<TruckManifest> findByRouteId(String routeId);
    List<TruckManifest> findByOrderId(String orderId);
    Optional<TruckManifest> findByRouteIdAndOrderId(String routeId, String orderId);
    List<TruckManifest> findByRouteIdAndStatus(String routeId, ManifestStatus status);
}
