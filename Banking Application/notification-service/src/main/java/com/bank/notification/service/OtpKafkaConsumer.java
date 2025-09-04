package com.bank.notification.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.bank.notification.service.EmailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OtpKafkaConsumer {
    private final EmailService emailService;

    @KafkaListener(topics = "${topic.otp}", groupId = "notification-service")
    public void consumeOtp(String message) {
        // Message format: email:otp
        String[] parts = message.split(":");
        if (parts.length == 2) {
            String email = parts[0];
            String otp = parts[1];
            emailService.sendEmail(email, "Your OTP Code", "Your OTP is: " + otp);
        }
    }
}