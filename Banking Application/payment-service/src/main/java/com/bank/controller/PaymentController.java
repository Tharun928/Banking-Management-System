package com.bank.controller;

import java.util.Date;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bank.payment.dto.AuditLogDto;
import com.bank.payment.dto.PaymentDto;
import com.bank.payment.service.PaymentKafkaProducer;
import com.bank.payment.service.PaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    private final PaymentKafkaProducer paymentKafkaProducer;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping
    public ResponseEntity<PaymentDto> makePayment(@RequestBody PaymentDto dto) {
        PaymentDto saved = paymentService.makePayment(dto);
        try {
            String eventJson = objectMapper.writeValueAsString(saved);
            paymentKafkaProducer.sendPaymentEvent(eventJson);
            
            AuditLogDto auditLog = new AuditLogDto();
            auditLog.setEventType(saved.getStatus());
            auditLog.setDetails("Payment from " + "account id" +saved.getFromAccountId() + " to " + "account id "+saved.getToAccountId() + " of amount " + saved.getAmount());
            auditLog.setTimestamp(new Date());
            String auditEventJson = new ObjectMapper().writeValueAsString(auditLog);
            paymentKafkaProducer.sendAuditEvent(auditEventJson);
        } catch (Exception e) {
            // log error if needed
        }
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<PaymentDto>> getAllPayments(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
                                                          @RequestHeader(value = "X-User-Role", required = false) String role) {
        if (role == null || !(role.equals("ADMIN") || role.equals("EMPLOYEE"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(paymentService.getAll());
    }
    @GetMapping("/{id}")
    public ResponseEntity<PaymentDto> getById(@PathVariable Long id) {
        return paymentService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}