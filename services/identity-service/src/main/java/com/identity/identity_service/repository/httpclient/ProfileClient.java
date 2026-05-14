package com.identity.identity_service.repository.httpclient;

import com.identity.identity_service.dto.request.ProfileListUserIDRequest;
import com.identity.identity_service.dto.request.ProfileRequest;
import com.identity.identity_service.dto.response.ApiResponse;
import com.identity.identity_service.dto.response.ProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "profile-service", url = "http://localhost:8081/profile")
public interface ProfileClient {
    @PostMapping(value = "/profiles/Internal/createProfile", produces = MediaType.APPLICATION_JSON_VALUE)
    ProfileResponse createProfile(@RequestBody ProfileRequest request);
    @PostMapping(value = "/profiles/Internal/fromUserIds", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<List<ProfileResponse>> getProfilesFromUserIds(@RequestBody ProfileListUserIDRequest request);
}
