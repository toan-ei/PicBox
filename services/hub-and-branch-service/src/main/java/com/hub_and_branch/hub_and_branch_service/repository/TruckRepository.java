package com.hub_and_branch.hub_and_branch_service.repository;

import com.hub_and_branch.hub_and_branch_service.entity.Truck;
import com.hub_and_branch.hub_and_branch_service.enums.TruckStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TruckRepository extends JpaRepository<Truck, String> {
    Optional<Truck> findByLicensePlate(String licensePlate);
    List<Truck> findByHomeBaseId(String homeBaseId);
    List<Truck> findByStatus(TruckStatus status);
    List<Truck> findByHomeBaseIdAndStatus(String homeBaseId, TruckStatus status);
    boolean existsByLicensePlate(String licensePlate);
}
