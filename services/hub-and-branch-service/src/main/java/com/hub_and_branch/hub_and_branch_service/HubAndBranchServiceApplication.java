package com.hub_and_branch.hub_and_branch_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class HubAndBranchServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(HubAndBranchServiceApplication.class, args);
	}

}
