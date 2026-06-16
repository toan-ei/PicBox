package com.hub_and_branch.hub_and_branch_service.dto.response;

import lombok.Data;

@Data
public class HubResponse {
    private String id;
    private String name;
    private String areaId;
    private String areaName;
    private String address;
    private String province;
    private Double latitude;
    private Double longitude;
    private String contactPhone;
    private boolean active;
}
