package com.file.file_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileDataResponse {
    String name;
    String contentType;
    String category;
    long size;
    String md5Checksum;
    String path;
    String url;
}
