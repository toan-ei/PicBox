package com.identity.identity_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Collections;
import java.util.List;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PageResponseCustom<T>{
    int currentPage;
    int totalPage;
    int pageSize;
    long totalElements;
    T data;
}

