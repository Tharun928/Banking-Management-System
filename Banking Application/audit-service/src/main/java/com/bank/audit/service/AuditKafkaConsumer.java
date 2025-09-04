package com.bank.audit.service;

import com.bank.audit.dto.AuditLogDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditKafkaConsumer {
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "${topic.audit}", groupId = "audit-service")
    public void consumeAuditEvent(String message) {
        try {
            AuditLogDto dto = objectMapper.readValue(message, AuditLogDto.class);
            auditLogService.save(dto);
        } catch (Exception e) {
            // Log or handle error as needed
        }
    }
}