package com.hub_and_branch.hub_and_branch_service.mapper;

import com.hub_and_branch.hub_and_branch_service.dto.request.CreateHubRequest;
import com.hub_and_branch.hub_and_branch_service.dto.response.HubResponse;
import com.hub_and_branch.hub_and_branch_service.entity.Hub;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface HubMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "true")
    Hub toEntity(CreateHubRequest request);

    @Mapping(target = "areaName", ignore = true)
    HubResponse toResponse(Hub hub);
}
