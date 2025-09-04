package com.bank.notification.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.bank.notification.service.EmailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentKafkaConsumer {
    private final EmailService emailService;

    @KafkaListener(topics = "${topic.payment}", groupId = "notification-service")
    public void consumePaymentEvent(String message) {
        // You can parse JSON and extract details as needed.
        // For now, just send a sample notification.
        // In production: use ObjectMapper to parse event.
        emailService.sendEmail(
            "recipient@email.com",
            "Payment Notification",
            "Payment Event: " + message
        );
    }
}