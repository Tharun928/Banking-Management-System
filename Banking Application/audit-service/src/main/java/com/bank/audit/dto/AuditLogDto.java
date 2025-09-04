package com.bank.audit.dto;

import lombok.Data;

import java.util.Date;

@Data
public class AuditLogDto {
    private Long id;
    private String eventType;
    private String details;
    private Date timestamp;
}