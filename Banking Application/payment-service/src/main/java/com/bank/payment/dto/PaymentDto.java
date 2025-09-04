package com.bank.payment.dto;

import lombok.Data;

import java.util.Date;

@Data
public class PaymentDto {
    private Long id;
    private Long fromAccountId;
    private Long toAccountId;
    private Double amount;
    private String status;
    private Date timestamp;
}