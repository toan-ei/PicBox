package com.file.file_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileDownloadResponse {
    String contentType;
    Resource resource;
}
