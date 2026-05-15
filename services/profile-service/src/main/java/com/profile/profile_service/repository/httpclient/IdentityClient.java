package com.profile.profile_service.repository.httpclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "identity-service", url = "http://localhost:8080/identity")
public interface IdentityClient {
    @DeleteMapping(value = "/internal/users/deleteUser/{userId}")
    Void deleteUser(@PathVariable String userId);
}
