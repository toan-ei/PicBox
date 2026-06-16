package com.hub_and_branch.hub_and_branch_service.dto.response;

import lombok.Data;

@Data
public class BranchResponse {
    private String id;
    private String name;
    private String hubId;
    private String hubName;
    private String areaId;
    private String address;
    private String district;
    private String ward;
    private String province;
    private Double latitude;
    private Double longitude;
    private String contactPhone;
    private Integer maxCapacity;
    private boolean active;
}
