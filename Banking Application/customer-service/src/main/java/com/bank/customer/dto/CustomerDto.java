package com.bank.customer.dto;

import lombok.Data;

@Data
public class CustomerDto {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private String kycStatus;
}