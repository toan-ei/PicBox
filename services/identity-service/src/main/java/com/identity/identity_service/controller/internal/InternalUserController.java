package com.identity.identity_service.controller.internal;


import com.identity.identity_service.dto.response.ApiResponse;
import com.identity.identity_service.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InternalUserController {
    UserService userService;

    @DeleteMapping("/deleteUser/{userId}")
    public ApiResponse<Void> deleteUser(@PathVariable String userId){
        userService.deleteUser(userId);
        return ApiResponse.<Void>builder()
                .code(1001)
                .build();
    }

}
