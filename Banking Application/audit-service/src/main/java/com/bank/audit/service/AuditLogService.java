package com.bank.audit.service;

import com.bank.audit.dto.AuditLogDto;
import com.bank.audit.model.AuditLog;
import com.bank.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    private final AuditLogRepository auditLogRepository;

    public AuditLogDto save(AuditLogDto dto) {
        AuditLog log = new AuditLog();
        BeanUtils.copyProperties(dto, log);
        log.setTimestamp(new Date());
        AuditLog saved = auditLogRepository.save(log);
        AuditLogDto result = new AuditLogDto();
        BeanUtils.copyProperties(saved, result);
        return result;
    }

    public List<AuditLogDto> getAll() {
        return auditLogRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public Optional<AuditLogDto> getById(Long id) {
        return auditLogRepository.findById(id).map(this::toDto);
    }

    private AuditLogDto toDto(AuditLog log) {
        AuditLogDto dto = new AuditLogDto();
        BeanUtils.copyProperties(log, dto);
        return dto;
    }
}