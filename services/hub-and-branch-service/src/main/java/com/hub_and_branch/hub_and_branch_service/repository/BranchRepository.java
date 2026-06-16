package com.hub_and_branch.hub_and_branch_service.repository;

import com.hub_and_branch.hub_and_branch_service.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BranchRepository extends JpaRepository<Branch, String> {
    List<Branch> findByHubId(String hubId);
    List<Branch> findByAreaId(String areaId);
    List<Branch> findByActive(boolean active);
    List<Branch> findByProvince(String province);
    List<Branch> findByHubIdAndActive(String hubId, boolean active);
}
