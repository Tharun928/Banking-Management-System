package com.bank.payment.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PaymentKafkaProducer {
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Value("${topic.payment}")
    private String paymentTopic;
    @Value("${topic.audit}")
    private String auditTopic;

    public PaymentKafkaProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendPaymentEvent(String paymentEventJson) {
        kafkaTemplate.send(paymentTopic, paymentEventJson);
    }

    public void sendAuditEvent(String auditEventJson) {
        kafkaTemplate.send(auditTopic, auditEventJson);
    }
}