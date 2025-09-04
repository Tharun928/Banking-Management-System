package com.bank.notification.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotificationController {
    @GetMapping("/notification/health")
    public String health() {
        return "Notification service is running";
    }
}