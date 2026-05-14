package com.identity.identity_service.repository;

import com.identity.identity_service.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    public boolean existsByUsername(String username);
    Optional<User> findByUsername(String username);
    Page<User> findAllByRoles_Name(String roleName, Pageable pageable);
    long countByRoles_Name(String roleName);
}
