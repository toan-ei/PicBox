package com.identity.identity_service.repository;

import com.identity.identity_service.entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvalidateRepository extends JpaRepository<InvalidatedToken, String> {
}
