package com.hub_and_branch.hub_and_branch_service.mapper;

import com.hub_and_branch.hub_and_branch_service.dto.request.CreateTruckRequest;
import com.hub_and_branch.hub_and_branch_service.dto.response.TruckResponse;
import com.hub_and_branch.hub_and_branch_service.entity.Truck;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TruckMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    Truck toEntity(CreateTruckRequest request);

    TruckResponse toResponse(Truck truck);
}
