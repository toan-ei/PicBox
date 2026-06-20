package com.identity.identity_service.service;

import com.identity.identity_service.constant.PredefinedRole;
import com.identity.identity_service.dto.request.*;
import com.identity.identity_service.dto.response.*;
import com.identity.identity_service.entity.Role;
import com.identity.identity_service.entity.User;
import com.identity.identity_service.exception.ApplicationException;
import com.identity.identity_service.exception.ErrorCode;
import com.identity.identity_service.mapper.ProfileMapper;
import com.identity.identity_service.mapper.UserMapper;
import com.identity.identity_service.repository.RoleRepository;
import com.identity.identity_service.repository.UserRepository;
import com.identity.identity_service.repository.httpclient.ProfileClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;
    ProfileClient profileClient;
    ProfileMapper profileMapper;

    public UserResponse createUser(CreateUserRequest request){
        if(userRepository.existsByUsername(request.getUsername())){
            throw new ApplicationException(ErrorCode.USER_EXISTED);
        }
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Set<Role> roles = new HashSet<>();
        roleRepository.findById(PredefinedRole.STUDENT_ROLE).ifPresent(roles::add);
        user.setRoles(roles);
        user = userRepository.save(user);
        try {
            ProfileRequest profileRequest = profileMapper.toProfileRequest(request);
            profileRequest.setUserId(user.getId());
            profileClient.createProfile(profileRequest);
        } catch (Exception e) {
            log.warn("Could not create profile for user {}: {}", user.getId(), e.getMessage());
        }
        return userMapper.toUserResponse(user);
    }
    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse getUser(String userId){
        return userMapper.toUserResponse(userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND)));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public List<UserResponse> getAllUser(){
        return userRepository.findAll().stream().map(userMapper::toUserResponse).collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public UserResponse updateUser(UpdateUserRequest request, String userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND));
        userMapper.updateUser(user, request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public UserResponse updateUserForAdmin(UpdateUserForAdminRequest request, String userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND));
        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void deleteUser(String userId){
        userRepository.deleteById(userId);
    }

    public PageResponseCustom<List<ProfileResponse>> getUserRole(String role, int page, int size){
        Pageable pageable = PageRequest.of(page,size,Sort.by("username").ascending());
        Page<User> byRolesName = userRepository.findAllByRoles_Name(role, pageable);
        List<String> userId = byRolesName.getContent()
                .stream()
                .map(User::getId)
                .collect(Collectors.toList());
        log.info("page {}", page);
        log.info("size {}", size);
        log.info("userids {}", userId);
        ProfileListUserIDRequest profileListUserIDRequest = ProfileListUserIDRequest.builder()
                .userIds(userId)
                .build();
        try {
            ApiResponse<List<ProfileResponse>> profilesFromUserIds =
                    profileClient.getProfilesFromUserIds(profileListUserIDRequest);
            return PageResponseCustom.<List<ProfileResponse>>builder()
                    .totalElements(byRolesName.getTotalElements())
                    .totalPage(byRolesName.getTotalPages())
                    .currentPage(page)
                    .pageSize(size)
                    .data(profilesFromUserIds.getResult())
                    .build();
        } catch (Exception e) {
            log.error("Lỗi gọi profileClient", e);
            throw new ApplicationException(ErrorCode.valueOf("loi"));
        }
    }

    public CountUserWithRoleResponse totalUserWithRole(String role){
        long countUser = userRepository.countByRoles_Name(role);
        return CountUserWithRoleResponse.builder()
                .countUser(countUser)
                .build();
    }
}
