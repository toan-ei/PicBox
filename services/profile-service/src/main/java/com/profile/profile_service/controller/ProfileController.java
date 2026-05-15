package com.profile.profile_service.controller;

import com.profile.profile_service.dto.request.ProfileUpdateRequest;
import com.profile.profile_service.dto.response.ApiResponse;
import com.profile.profile_service.dto.response.ProfileResponse;
import com.profile.profile_service.service.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileController {
    ProfileService profileService;

    @GetMapping("/getProfile/fromUserId/{userId}")
    public ApiResponse<ProfileResponse> getProfileFromUserId(@PathVariable String userId){
        ProfileResponse profileResponse = profileService.getProfileFromUserId(userId);
        return ApiResponse.<ProfileResponse>builder()
                .result(profileResponse)
                .build();
    }

    @GetMapping("/getProfile/{profileId}")
    public ApiResponse<ProfileResponse> getProfile(@PathVariable String profileId) {
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.getProfile(profileId))
                .build();
    }

    @GetMapping("/GetAllProfile")
    public ApiResponse<List<ProfileResponse>> getAllProfile(){
        return ApiResponse.<List<ProfileResponse>>builder()
                .result(profileService.getAllProfile())
                .build();
    }

    @PutMapping("/updateProfile/{profileId}")
    public ApiResponse<ProfileResponse> updateProfile(@RequestBody ProfileUpdateRequest request,
                                                      @PathVariable String profileId){
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.updateProfile(request, profileId))
                .build();
    }

    @PutMapping("/updateMyProfile")
    public ApiResponse<ProfileResponse> updateMyProfile(@RequestBody ProfileUpdateRequest request){
        ProfileResponse profileResponse = profileService.updataMyProfile(request);
        return ApiResponse.<ProfileResponse>builder()
                .result(profileResponse)
                .build();
    }

    @PutMapping("/avatar")
    public ApiResponse<ProfileResponse> updateAvatar(@RequestParam("media")MultipartFile file){
        ProfileResponse profileResponse = profileService.updateAvatar(file);
        return ApiResponse.<ProfileResponse>builder()
                .result(profileResponse)
                .build();
    }

    @DeleteMapping("/deleteProfile/{profileId}")
    public void deleteProfile(@PathVariable String profileId){
        profileService.deleteProfile(profileId);
    }
}
