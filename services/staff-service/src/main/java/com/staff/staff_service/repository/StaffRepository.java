package com.staff.staff_service.repository;

import com.staff.staff_service.entity.Staff;
import com.staff.staff_service.enums.StaffRole;
import com.staff.staff_service.enums.StaffStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, String> {

    List<Staff> findByRole(StaffRole role);

    List<Staff> findByHomeBaseId(String homeBaseId);

    List<Staff> findByHomeBaseIdAndRole(String homeBaseId, StaffRole role);

    List<Staff> findByHomeBaseIdAndRoleAndStatus(String homeBaseId, StaffRole role, StaffStatus status);

    List<Staff> findByRoleAndStatus(StaffRole role, StaffStatus status);

    Optional<Staff> findByUserId(String userId);

    boolean existsByUserId(String userId);
}
