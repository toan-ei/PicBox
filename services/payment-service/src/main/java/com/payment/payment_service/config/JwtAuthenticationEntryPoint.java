package com.payment.payment_service.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.payment.payment_service.dto.response.ApiResponse;
import com.payment.payment_service.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        ErrorCode code = ErrorCode.UNAUTHENTICATED;
        response.setStatus(code.getStatusCode().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ApiResponse<?> body = ApiResponse.builder()
                .code(code.getCode())
                .message(code.getMessage())
                .build();
        new ObjectMapper().writeValue(response.getOutputStream(), body);
    }
}
