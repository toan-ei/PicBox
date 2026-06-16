package com.hub_and_branch.hub_and_branch_service.service;

import com.hub_and_branch.hub_and_branch_service.dto.request.LoadManifestRequest;
import com.hub_and_branch.hub_and_branch_service.entity.TruckManifest;
import com.hub_and_branch.hub_and_branch_service.enums.ManifestStatus;
import com.hub_and_branch.hub_and_branch_service.exception.ApplicationException;
import com.hub_and_branch.hub_and_branch_service.exception.ErrorCode;
import com.hub_and_branch.hub_and_branch_service.repository.TruckManifestRepository;
import com.hub_and_branch.hub_and_branch_service.repository.TruckRouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ManifestService {

    private final TruckManifestRepository manifestRepository;
    private final TruckRouteRepository routeRepository;

    public List<TruckManifest> load(LoadManifestRequest request) {
        if (!routeRepository.existsById(request.getRouteId())) {
            throw new ApplicationException(ErrorCode.ROUTE_NOT_FOUND);
        }

        return request.getOrderIds().stream().map(orderId -> {
            if (manifestRepository.findByRouteIdAndOrderId(request.getRouteId(), orderId).isPresent()) {
                throw new ApplicationException(ErrorCode.MANIFEST_DUPLICATE_ORDER);
            }
            return manifestRepository.save(TruckManifest.builder()
                    .routeId(request.getRouteId())
                    .orderId(orderId)
                    .status(ManifestStatus.LOADED)
                    .loadedAt(LocalDateTime.now())
                    .build());
        }).toList();
    }

    public TruckManifest deliver(String manifestId) {
        TruckManifest manifest = manifestRepository.findById(manifestId)
                .orElseThrow(() -> new ApplicationException(ErrorCode.MANIFEST_NOT_FOUND));
        manifest.setStatus(ManifestStatus.DELIVERED);
        manifest.setDeliveredAt(LocalDateTime.now());
        return manifestRepository.save(manifest);
    }

    public List<TruckManifest> getByRoute(String routeId) {
        return manifestRepository.findByRouteId(routeId);
    }

    public List<TruckManifest> getByOrder(String orderId) {
        return manifestRepository.findByOrderId(orderId);
    }
}
