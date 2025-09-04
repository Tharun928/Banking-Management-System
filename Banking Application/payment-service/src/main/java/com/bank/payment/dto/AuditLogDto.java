package com.bank.payment.dto;

import java.util.Date;

import lombok.Data;

@Data
public class AuditLogDto {
    private Long id;
    private String eventType;
    private String details;
    private Date timestamp;
}