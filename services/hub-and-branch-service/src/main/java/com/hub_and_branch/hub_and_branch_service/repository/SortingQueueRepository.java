package com.hub_and_branch.hub_and_branch_service.repository;

import com.hub_and_branch.hub_and_branch_service.entity.SortingQueue;
import com.hub_and_branch.hub_and_branch_service.enums.SortingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SortingQueueRepository extends JpaRepository<SortingQueue, String> {
    List<SortingQueue> findByHubIdAndStatusOrderByPriorityDescIdAsc(String hubId, SortingStatus status);
    List<SortingQueue> findByOrderId(String orderId);
    List<SortingQueue> findByHubId(String hubId);
}
