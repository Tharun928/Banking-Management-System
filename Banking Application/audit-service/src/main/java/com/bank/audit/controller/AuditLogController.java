package com.bank.audit.controller;

import com.bank.audit.dto.AuditLogDto;
import com.bank.audit.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/audit")
@RequiredArgsConstructor
public class AuditLogController {
    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLogDto>> getAll() {
        return ResponseEntity.ok(auditLogService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuditLogDto> getById(@PathVariable Long id) {
        return auditLogService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}