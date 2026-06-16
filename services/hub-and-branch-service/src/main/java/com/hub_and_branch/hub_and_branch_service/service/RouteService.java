package com.hub_and_branch.hub_and_branch_service.service;

import com.hub_and_branch.hub_and_branch_service.dto.request.CreateRouteRequest;
import com.hub_and_branch.hub_and_branch_service.dto.response.RouteResponse;
import com.hub_and_branch.hub_and_branch_service.entity.Truck;
import com.hub_and_branch.hub_and_branch_service.entity.TruckRoute;
import com.hub_and_branch.hub_and_branch_service.enums.RouteStatus;
import com.hub_and_branch.hub_and_branch_service.enums.TruckStatus;
import com.hub_and_branch.hub_and_branch_service.exception.ApplicationException;
import com.hub_and_branch.hub_and_branch_service.exception.ErrorCode;
import com.hub_and_branch.hub_and_branch_service.mapper.RouteMapper;
import com.hub_and_branch.hub_and_branch_service.repository.TruckRepository;
import com.hub_and_branch.hub_and_branch_service.repository.TruckRouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final TruckRouteRepository routeRepository;
    private final TruckRepository truckRepository;
    private final RouteMapper routeMapper;

    @Transactional
    public RouteResponse create(CreateRouteRequest request) {
        Truck truck = truckRepository.findById(request.getTruckId())
                .orElseThrow(() -> new ApplicationException(ErrorCode.TRUCK_NOT_FOUND));

        if (truck.getStatus() != TruckStatus.AVAILABLE) {
            throw new ApplicationException(ErrorCode.TRUCK_NOT_AVAILABLE);
        }

        TruckRoute route = routeMapper.toEntity(request);
        route = routeRepository.save(route);

        truck.setStatus(TruckStatus.ON_ROUTE);
        truckRepository.save(truck);

        RouteResponse response = routeMapper.toResponse(route);
        response.setTruckLicensePlate(truck.getLicensePlate());
        return response;
    }

    public RouteResponse getById(String id) {
        TruckRoute route = routeRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.ROUTE_NOT_FOUND));
        RouteResponse response = routeMapper.toResponse(route);
        truckRepository.findById(route.getTruckId())
                .ifPresent(t -> response.setTruckLicensePlate(t.getLicensePlate()));
        return response;
    }

    public List<RouteResponse> getByTruck(String truckId) {
        return routeRepository.findByTruckId(truckId).stream()
                .map(route -> {
                    RouteResponse res = routeMapper.toResponse(route);
                    truckRepository.findById(route.getTruckId())
                            .ifPresent(t -> res.setTruckLicensePlate(t.getLicensePlate()));
                    return res;
                }).toList();
    }

    @Transactional
    public RouteResponse depart(String id) {
        TruckRoute route = routeRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.ROUTE_NOT_FOUND));
        route.setStatus(RouteStatus.DEPARTED);
        route.setActualDeparture(LocalDateTime.now());
        routeRepository.save(route);
        return routeMapper.toResponse(route);
    }

    @Transactional
    public RouteResponse arrive(String id) {
        TruckRoute route = routeRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.ROUTE_NOT_FOUND));
        route.setStatus(RouteStatus.COMPLETED);
        route.setActualArrival(LocalDateTime.now());
        routeRepository.save(route);

        truckRepository.findById(route.getTruckId()).ifPresent(truck -> {
            truck.setStatus(TruckStatus.AVAILABLE);
            truckRepository.save(truck);
        });

        return routeMapper.toResponse(route);
    }
}
