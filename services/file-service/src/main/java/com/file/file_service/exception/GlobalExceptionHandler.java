package com.file.file_service.exception;

import com.file.file_service.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = RuntimeException.class)
    public ResponseEntity<ApiResponse> handlingRuntimeException(RuntimeException runtimeException) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(ErrorCode.UNCATEFORIZED_EXCEPTION.getCode());
        apiResponse.setMessage(ErrorCode.UNCATEFORIZED_EXCEPTION.getMessage());
        return ResponseEntity
                .status(ErrorCode.UNCATEFORIZED_EXCEPTION.getStatusCode())
                .body(apiResponse);
    }

    @ExceptionHandler(value = ApplicationException.class)
    public ResponseEntity<ApiResponse> handlingApplicationException(ApplicationException applicationException) {
        ErrorCode errorCode = applicationException.getErrorCode();
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(apiResponse);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    public ResponseEntity<ApiResponse> handlingAccessDeniedException(AccessDeniedException accessDeniedException) {
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build());
    }
}
