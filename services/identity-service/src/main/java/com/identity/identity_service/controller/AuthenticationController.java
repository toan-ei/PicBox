package com.identity.identity_service.controller;

import com.identity.identity_service.dto.request.AuthenticationRequest;
import com.identity.identity_service.dto.request.CheckTokenRequest;
import com.identity.identity_service.dto.request.LogoutRequest;
import com.identity.identity_service.dto.request.RefreshRequest;
import com.identity.identity_service.dto.response.ApiResponse;
import com.identity.identity_service.dto.response.AuthenticationResponse;
import com.identity.identity_service.dto.response.CheckTokenResponse;
import com.identity.identity_service.dto.response.LogoutResponse;
import com.identity.identity_service.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/token")
    public ApiResponse<AuthenticationResponse> authenticated(@RequestBody AuthenticationRequest request){
        AuthenticationResponse authenticationResponse = authenticationService.authenticated(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationResponse)
                .build();
    }

    @PostMapping("/checkToken")
    public ApiResponse<CheckTokenResponse> checkToken(@RequestBody CheckTokenRequest request) throws ParseException, JOSEException {
        CheckTokenResponse checkTokenResponse = authenticationService.checkToken(request);
        return ApiResponse.<CheckTokenResponse>builder()
                .result(checkTokenResponse)
                .build();
    }
    @PostMapping("/logout")
    public ApiResponse<LogoutResponse> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        LogoutResponse logoutResponse = authenticationService.logout(request);
        return ApiResponse.<LogoutResponse>builder()
                .result(logoutResponse)
                .build();
    }
    @PostMapping("/refreshToken")
    public ApiResponse<AuthenticationResponse> refreshToken(@RequestBody RefreshRequest request) throws ParseException, JOSEException {
        AuthenticationResponse authenticationResponse = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationResponse)
                .build();
    }
}
