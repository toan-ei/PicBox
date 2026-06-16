package com.hub_and_branch.hub_and_branch_service.mapper;

import com.hub_and_branch.hub_and_branch_service.dto.request.CreateBranchRequest;
import com.hub_and_branch.hub_and_branch_service.dto.response.BranchResponse;
import com.hub_and_branch.hub_and_branch_service.entity.Branch;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BranchMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "true")
    Branch toEntity(CreateBranchRequest request);

    @Mapping(target = "hubName", ignore = true)
    BranchResponse toResponse(Branch branch);
}
