package com.hub_and_branch.hub_and_branch_service.service;

import com.hub_and_branch.hub_and_branch_service.dto.request.CreateBranchRequest;
import com.hub_and_branch.hub_and_branch_service.dto.response.BranchResponse;
import com.hub_and_branch.hub_and_branch_service.entity.Branch;
import com.hub_and_branch.hub_and_branch_service.entity.Hub;
import com.hub_and_branch.hub_and_branch_service.exception.ApplicationException;
import com.hub_and_branch.hub_and_branch_service.exception.ErrorCode;
import com.hub_and_branch.hub_and_branch_service.mapper.BranchMapper;
import com.hub_and_branch.hub_and_branch_service.repository.BranchRepository;
import com.hub_and_branch.hub_and_branch_service.repository.HubRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BranchService {

    private final BranchRepository branchRepository;
    private final HubRepository hubRepository;
    private final BranchMapper branchMapper;

    public BranchResponse create(CreateBranchRequest request) {
        Hub hub = hubRepository.findById(request.getHubId())
                .orElseThrow(() -> new ApplicationException(ErrorCode.HUB_NOT_FOUND));

        Branch branch = branchMapper.toEntity(request);
        branch = branchRepository.save(branch);

        BranchResponse response = branchMapper.toResponse(branch);
        response.setHubName(hub.getName());
        return response;
    }

    public BranchResponse getById(String id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.BRANCH_NOT_FOUND));
        Hub hub = hubRepository.findById(branch.getHubId()).orElse(null);

        BranchResponse response = branchMapper.toResponse(branch);
        if (hub != null) response.setHubName(hub.getName());
        return response;
    }

    public List<BranchResponse> getByHub(String hubId) {
        Hub hub = hubRepository.findById(hubId)
                .orElseThrow(() -> new ApplicationException(ErrorCode.HUB_NOT_FOUND));
        return branchRepository.findByHubId(hubId).stream()
                .map(branch -> {
                    BranchResponse response = branchMapper.toResponse(branch);
                    response.setHubName(hub.getName());
                    return response;
                }).toList();
    }

    public List<BranchResponse> getAll() {
        return branchRepository.findAll().stream()
                .map(branch -> {
                    BranchResponse response = branchMapper.toResponse(branch);
                    hubRepository.findById(branch.getHubId())
                            .ifPresent(h -> response.setHubName(h.getName()));
                    return response;
                }).toList();
    }

    public BranchResponse setActive(String id, boolean active) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.BRANCH_NOT_FOUND));
        branch.setActive(active);
        branch = branchRepository.save(branch);
        return branchMapper.toResponse(branch);
    }
}
