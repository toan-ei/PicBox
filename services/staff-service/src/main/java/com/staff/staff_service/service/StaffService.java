package com.staff.staff_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.staff.staff_service.dto.request.CreateStaffRequest;
import com.staff.staff_service.dto.request.UpdateStatusRequest;
import com.staff.staff_service.dto.response.StaffResponse;
import com.staff.staff_service.entity.Staff;
import com.staff.staff_service.enums.StaffRole;
import com.staff.staff_service.enums.StaffStatus;
import com.staff.staff_service.exception.ApplicationException;
import com.staff.staff_service.exception.ErrorCode;
import com.staff.staff_service.mapper.StaffMapper;
import com.staff.staff_service.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StaffService {

    private static final String CACHE_PREFIX = "staff:";
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);

    private final StaffRepository staffRepository;
    private final StaffMapper staffMapper;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public StaffResponse create(CreateStaffRequest request) {
        if (request.getUserId() != null && staffRepository.existsByUserId(request.getUserId())) {
            throw new ApplicationException(ErrorCode.STAFF_USER_ALREADY_EXISTS);
        }
        Staff staff = staffMapper.toEntity(request);
        staff = staffRepository.save(staff);
        StaffResponse response = staffMapper.toResponse(staff);
        cacheStaff(response);
        return response;
    }

    public StaffResponse getById(String id) {
        String cached = redisTemplate.opsForValue().get(CACHE_PREFIX + id);
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, StaffResponse.class);
            } catch (JsonProcessingException e) {
                log.warn("Failed to deserialize cached staff {}", id);
            }
        }
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.STAFF_NOT_FOUND));
        StaffResponse response = staffMapper.toResponse(staff);
        cacheStaff(response);
        return response;
    }

    public List<StaffResponse> getAll() {
        return staffRepository.findAll().stream()
                .map(staffMapper::toResponse)
                .toList();
    }

    public List<StaffResponse> getByHomeBase(String homeBaseId) {
        return staffRepository.findByHomeBaseId(homeBaseId).stream()
                .map(staffMapper::toResponse)
                .toList();
    }

    public List<StaffResponse> getAvailableByHomeBase(String homeBaseId, StaffRole role) {
        return staffRepository.findByHomeBaseIdAndRoleAndStatus(homeBaseId, role, StaffStatus.ACTIVE).stream()
                .map(staffMapper::toResponse)
                .toList();
    }

    public List<StaffResponse> getByRole(StaffRole role) {
        return staffRepository.findByRole(role).stream()
                .map(staffMapper::toResponse)
                .toList();
    }

    public StaffResponse updateStatus(String id, UpdateStatusRequest request) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.STAFF_NOT_FOUND));
        staff.setStatus(request.getStatus());
        staff = staffRepository.save(staff);
        StaffResponse response = staffMapper.toResponse(staff);
        cacheStaff(response);
        return response;
    }

    private void cacheStaff(StaffResponse response) {
        try {
            redisTemplate.opsForValue().set(
                    CACHE_PREFIX + response.getId(),
                    objectMapper.writeValueAsString(response),
                    CACHE_TTL);
        } catch (JsonProcessingException e) {
            log.warn("Failed to cache staff {}", response.getId());
        }
    }

    public void evictCache(String id) {
        redisTemplate.delete(CACHE_PREFIX + id);
    }
}
