package com.hub_and_branch.hub_and_branch_service.repository;

import com.hub_and_branch.hub_and_branch_service.entity.Hub;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HubRepository extends JpaRepository<Hub, String> {
    List<Hub> findByAreaId(String areaId);
    List<Hub> findByActive(boolean active);
    List<Hub> findByProvince(String province);
}
