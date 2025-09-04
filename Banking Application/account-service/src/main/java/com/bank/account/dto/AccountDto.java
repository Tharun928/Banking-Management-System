package com.bank.account.dto;

import lombok.Data;

@Data
public class AccountDto {
    private Long id;
    private Long customerId;
    private String accountNumber;
    private String accountType;
    private Double balance;
    private String status;
}