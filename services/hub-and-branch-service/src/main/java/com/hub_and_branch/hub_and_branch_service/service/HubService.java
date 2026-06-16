package com.hub_and_branch.hub_and_branch_service.service;

import com.hub_and_branch.hub_and_branch_service.dto.request.CreateHubRequest;
import com.hub_and_branch.hub_and_branch_service.dto.response.HubResponse;
import com.hub_and_branch.hub_and_branch_service.entity.Area;
import com.hub_and_branch.hub_and_branch_service.entity.Hub;
import com.hub_and_branch.hub_and_branch_service.exception.ApplicationException;
import com.hub_and_branch.hub_and_branch_service.exception.ErrorCode;
import com.hub_and_branch.hub_and_branch_service.mapper.HubMapper;
import com.hub_and_branch.hub_and_branch_service.repository.AreaRepository;
import com.hub_and_branch.hub_and_branch_service.repository.HubRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HubService {

    private final HubRepository hubRepository;
    private final AreaRepository areaRepository;
    private final HubMapper hubMapper;

    public HubResponse create(CreateHubRequest request) {
        Area area = areaRepository.findById(request.getAreaId())
                .orElseThrow(() -> new ApplicationException(ErrorCode.AREA_NOT_FOUND));

        Hub hub = hubMapper.toEntity(request);
        hub = hubRepository.save(hub);

        HubResponse response = hubMapper.toResponse(hub);
        response.setAreaName(area.getName());
        return response;
    }

    public HubResponse getById(String id) {
        Hub hub = hubRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.HUB_NOT_FOUND));
        Area area = areaRepository.findById(hub.getAreaId()).orElse(null);

        HubResponse response = hubMapper.toResponse(hub);
        if (area != null) response.setAreaName(area.getName());
        return response;
    }

    public List<HubResponse> getAll() {
        return hubRepository.findAll().stream()
                .map(hub -> {
                    HubResponse response = hubMapper.toResponse(hub);
                    areaRepository.findById(hub.getAreaId())
                            .ifPresent(a -> response.setAreaName(a.getName()));
                    return response;
                }).toList();
    }

    public List<HubResponse> getByArea(String areaId) {
        return hubRepository.findByAreaId(areaId).stream()
                .map(hub -> {
                    HubResponse response = hubMapper.toResponse(hub);
                    areaRepository.findById(hub.getAreaId())
                            .ifPresent(a -> response.setAreaName(a.getName()));
                    return response;
                }).toList();
    }

    public HubResponse setActive(String id, boolean active) {
        Hub hub = hubRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.HUB_NOT_FOUND));
        hub.setActive(active);
        hub = hubRepository.save(hub);
        return hubMapper.toResponse(hub);
    }
}
