package com.hub_and_branch.hub_and_branch_service.mapper;

import com.hub_and_branch.hub_and_branch_service.dto.request.CreateRouteRequest;
import com.hub_and_branch.hub_and_branch_service.dto.response.RouteResponse;
import com.hub_and_branch.hub_and_branch_service.entity.TruckRoute;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RouteMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "actualDeparture", ignore = true)
    @Mapping(target = "actualArrival", ignore = true)
    @Mapping(target = "status", ignore = true)
    TruckRoute toEntity(CreateRouteRequest request);

    @Mapping(target = "truckLicensePlate", ignore = true)
    RouteResponse toResponse(TruckRoute route);
}
