package com.bank.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.bank.account.dto.CustomerDto;

// Replace "customer-service" with the correct service name registered in Eureka
@FeignClient(name = "customer-service")
public interface CustomerClient {

    @GetMapping("/customer/{id}")
    Long getCustomerById(@PathVariable("id") Long id);
}