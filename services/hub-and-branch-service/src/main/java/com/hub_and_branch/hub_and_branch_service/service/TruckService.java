package com.hub_and_branch.hub_and_branch_service.service;

import com.hub_and_branch.hub_and_branch_service.dto.request.CreateTruckRequest;
import com.hub_and_branch.hub_and_branch_service.dto.response.TruckResponse;
import com.hub_and_branch.hub_and_branch_service.entity.Truck;
import com.hub_and_branch.hub_and_branch_service.enums.TruckStatus;
import com.hub_and_branch.hub_and_branch_service.exception.ApplicationException;
import com.hub_and_branch.hub_and_branch_service.exception.ErrorCode;
import com.hub_and_branch.hub_and_branch_service.mapper.TruckMapper;
import com.hub_and_branch.hub_and_branch_service.repository.TruckRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TruckService {

    private final TruckRepository truckRepository;
    private final TruckMapper truckMapper;

    public TruckResponse create(CreateTruckRequest request) {
        if (truckRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new ApplicationException(ErrorCode.TRUCK_LICENSE_EXISTS);
        }
        Truck truck = truckMapper.toEntity(request);
        return truckMapper.toResponse(truckRepository.save(truck));
    }

    public TruckResponse getById(String id) {
        return truckMapper.toResponse(
                truckRepository.findById(id)
                        .orElseThrow(() -> new ApplicationException(ErrorCode.TRUCK_NOT_FOUND))
        );
    }

    public List<TruckResponse> getByHomeBase(String homeBaseId) {
        return truckRepository.findByHomeBaseId(homeBaseId).stream()
                .map(truckMapper::toResponse).toList();
    }

    public List<TruckResponse> getAvailableByHomeBase(String homeBaseId) {
        return truckRepository.findByHomeBaseIdAndStatus(homeBaseId, TruckStatus.AVAILABLE).stream()
                .map(truckMapper::toResponse).toList();
    }

    public TruckResponse updateStatus(String id, TruckStatus status) {
        Truck truck = truckRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.TRUCK_NOT_FOUND));
        truck.setStatus(status);
        return truckMapper.toResponse(truckRepository.save(truck));
    }

    public TruckResponse assignDriver(String id, String driverId) {
        Truck truck = truckRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.TRUCK_NOT_FOUND));
        truck.setDriverId(driverId);
        return truckMapper.toResponse(truckRepository.save(truck));
    }
}
