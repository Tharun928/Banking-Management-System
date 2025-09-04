package com.bank.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class OtpKafkaProducer {
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Value("${topic.otp}")
    private String otpTopic;

    public OtpKafkaProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendOtp(String email, String otp) {
        // Message format: email:otp
        kafkaTemplate.send(otpTopic, email + ":" + otp);
    }
}