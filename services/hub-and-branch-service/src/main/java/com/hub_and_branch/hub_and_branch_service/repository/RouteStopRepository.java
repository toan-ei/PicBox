package com.hub_and_branch.hub_and_branch_service.repository;

import com.hub_and_branch.hub_and_branch_service.entity.RouteStop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RouteStopRepository extends JpaRepository<RouteStop, String> {
    List<RouteStop> findByRouteIdOrderBySequenceAsc(String routeId);
    void deleteByRouteId(String routeId);
}
