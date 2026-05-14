package com.identity.identity_service.config;

import com.identity.identity_service.constant.PredefinedRole;
import com.identity.identity_service.entity.Role;
import com.identity.identity_service.entity.User;
import com.identity.identity_service.repository.RoleRepository;
import com.identity.identity_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository){
        return args -> {
            if(userRepository.findByUsername("ADMIN").isEmpty()){
                Set<Role> roles = new HashSet<>();
                roleRepository.findById(PredefinedRole.ADMIN_ROLE).ifPresent(roles::add);
                User user = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .roles(roles)
                        .build();
                userRepository.save(user);
            }
        };
    }
}
