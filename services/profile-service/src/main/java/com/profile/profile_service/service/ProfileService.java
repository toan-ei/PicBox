package com.profile.profile_service.service;

import com.profile.profile_service.dto.request.ProfileListUserIDRequest;
import com.profile.profile_service.dto.request.ProfileRequest;
import com.profile.profile_service.dto.request.ProfileUpdateRequest;
import com.profile.profile_service.dto.response.ApiResponse;
import com.profile.profile_service.dto.response.FileResponse;
import com.profile.profile_service.dto.response.ProfileResponse;
import com.profile.profile_service.entity.Profile;
import com.profile.profile_service.exception.ApplicationException;
import com.profile.profile_service.exception.ErrorCode;
import com.profile.profile_service.mapper.ProfileMapper;
import com.profile.profile_service.repository.ProfileRepository;
import com.profile.profile_service.repository.httpclient.FileClient;
import com.profile.profile_service.repository.httpclient.IdentityClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProfileService {
    ProfileRepository profileRepository;
    ProfileMapper profileMapper;
    IdentityClient identityClient;
    FileClient fileClient;

    public ProfileResponse createProfile(ProfileRequest request){
        Profile profile = profileMapper.toProfile(request);
        return profileMapper.toProfileResponse(profileRepository.save(profile));
    }

    public ProfileResponse getProfileFromUserId(String userId) {
        Profile profile =
                profileRepository.findByUserId(userId)
                        .orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND));

        return profileMapper.toProfileResponse(profile);
    }

    public List<ProfileResponse> getProfilesFromUserIds(ProfileListUserIDRequest request){
        List<Profile> profiles = profileRepository.findByUserIdIn(request.getUserIds());
        log.info("profiles {}", profiles);
        return profiles.stream().map(profileMapper::toProfileResponse).collect(Collectors.toList());
    }

    public ProfileResponse getProfile(String id){
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND));
        ProfileResponse profileResponse = profileMapper.toProfileResponse(profile);
        return profileResponse;
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public List<ProfileResponse> getAllProfile(){
        return profileRepository.findAll()
                .stream().map(profileMapper::toProfileResponse).collect(Collectors.toList());
    }

    public ProfileResponse updateProfile(ProfileUpdateRequest request, String id){
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND));
        profileMapper.updateProfile(profile, request);
        return profileMapper.toProfileResponse(profileRepository.save(profile));
    }

    public ProfileResponse updataMyProfile(ProfileUpdateRequest request){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        Optional<Profile> byUserId = profileRepository.findByUserId(userId);
        Profile profile = byUserId.get();
        profileMapper.updateProfile(profile, request);
        return profileMapper.toProfileResponse(profileRepository.save(profile));
    }

    public ProfileResponse updateAvatar(MultipartFile file){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        Optional<Profile> byUserId = profileRepository.findByUserId(userId);
        Profile profile = byUserId.get();

        ApiResponse<FileResponse> fileResponseApiResponse = fileClient.updateMedia(file);

        profile.setAvatar(fileResponseApiResponse.getResult().getUrl());

        return profileMapper.toProfileResponse(profileRepository.save(profile));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteProfile(String id){
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND));
        profileRepository.deleteById(id);
        identityClient.deleteUser(profile.getUserId());
    }
}
