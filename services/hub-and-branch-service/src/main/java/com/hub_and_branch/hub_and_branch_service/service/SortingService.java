package com.hub_and_branch.hub_and_branch_service.service;

import com.hub_and_branch.hub_and_branch_service.dto.request.EnqueueSortingRequest;
import com.hub_and_branch.hub_and_branch_service.entity.SortingQueue;
import com.hub_and_branch.hub_and_branch_service.enums.SortingStatus;
import com.hub_and_branch.hub_and_branch_service.exception.ApplicationException;
import com.hub_and_branch.hub_and_branch_service.exception.ErrorCode;
import com.hub_and_branch.hub_and_branch_service.repository.HubRepository;
import com.hub_and_branch.hub_and_branch_service.repository.SortingQueueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SortingService {

    private final SortingQueueRepository sortingQueueRepository;
    private final HubRepository hubRepository;

    public SortingQueue enqueue(EnqueueSortingRequest request) {
        if (!hubRepository.existsById(request.getHubId())) {
            throw new ApplicationException(ErrorCode.HUB_NOT_FOUND);
        }
        SortingQueue item = SortingQueue.builder()
                .hubId(request.getHubId())
                .orderId(request.getOrderId())
                .destBranchId(request.getDestBranchId())
                .priority(request.getPriority())
                .status(SortingStatus.PENDING)
                .build();
        return sortingQueueRepository.save(item);
    }

    public SortingQueue sort(String id) {
        SortingQueue item = sortingQueueRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.SORTING_NOT_FOUND));
        item.setStatus(SortingStatus.SORTED);
        item.setSortedAt(LocalDateTime.now());
        return sortingQueueRepository.save(item);
    }

    public List<SortingQueue> getPendingByHub(String hubId) {
        return sortingQueueRepository.findByHubIdAndStatusOrderByPriorityDescIdAsc(hubId, SortingStatus.PENDING);
    }

    public List<SortingQueue> getByHub(String hubId) {
        return sortingQueueRepository.findByHubId(hubId);
    }
}
