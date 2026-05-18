package com.file.file_service.mapper;

import com.file.file_service.dto.response.FileDataResponse;
import com.file.file_service.entity.FileManagement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FileMapper {
    @Mapping(source = "name", target = "id")
    FileManagement toFileManagement(FileDataResponse fileDataResponse);
}
