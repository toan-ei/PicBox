package com.hub_and_branch.hub_and_branch_service.repository;

import com.hub_and_branch.hub_and_branch_service.entity.Area;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AreaRepository extends JpaRepository<Area, String> {
    List<Area> findByRegionId(String regionId);
    Optional<Area> findByCode(String code);
    boolean existsByCode(String code);
}
