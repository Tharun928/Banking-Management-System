package com.bank.auth.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public String generateOtp(String username) {
        String otp = String.format("%06d", random.nextInt(999999));
        otpStore.put(username, otp);
        return otp;
    }

    public boolean validateOtp(String username, String otp) {
        String validOtp = otpStore.get(username);
        if (validOtp != null && validOtp.equals(otp)) {
            otpStore.remove(username);
            return true;
        }
        return false;
    }
}