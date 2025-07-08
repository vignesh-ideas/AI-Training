package com.hms.labservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableJpaAuditing
@EnableDiscoveryClient
public class LabServiceApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(LabServiceApplication.class, args);
    }
} 