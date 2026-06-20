package com.profile.profile_service.repository.httpclient;

import com.profile.profile_service.config.AuthenticationRequestInterceptor;
import com.profile.profile_service.dto.response.ApiResponse;
import com.profile.profile_service.dto.response.FileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "file-service", url = "${file-service.url:http://localhost:8089/file}",
        configuration = { AuthenticationRequestInterceptor.class})
public interface FileClient {
    @PostMapping(value = "/media/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<FileResponse> updateMedia(@RequestPart("media")MultipartFile file);

}
