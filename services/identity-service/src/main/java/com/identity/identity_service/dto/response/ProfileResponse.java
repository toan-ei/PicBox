package com.identity.identity_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileResponse {
    String id;
    String userId;
    String avatar;
    String fullName;
    Date dob;
    String gender;
    String address;
    String phoneNumber;
    int totalPages;
}
