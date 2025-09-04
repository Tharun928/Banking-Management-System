package com.bank.auth.controller;

import com.bank.auth.dto.*;
import com.bank.auth.model.User;
import com.bank.auth.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final OtpService otpService;
    private final OtpKafkaProducer otpKafkaProducer;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        User user = userService.register(request);
        String otp = otpService.generateOtp(user.getUsername());
        otpKafkaProducer.sendOtp(user.getEmail(), otp);
        return ResponseEntity.ok(new AuthResponse("Registered! OTP sent to email.", null));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userService.findByUsername(request.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(new AuthResponse("Invalid credentials", null));
        }
        User user = userOpt.get();
        if (!user.isOtpVerified()) {
            String otp = otpService.generateOtp(user.getUsername());
            otpKafkaProducer.sendOtp(user.getEmail(), otp);
            return ResponseEntity.status(403).body(new AuthResponse("OTP required. Sent to email.", null));
        }
        if (!userService.getPasswordEncoder().matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(new AuthResponse("Invalid credentials", null));
        }
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponse("Login successful", token));
    }

    @PostMapping("/otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody OtpRequest request) {
        Optional<User> userOpt = userService.findByUsername(request.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(new AuthResponse("User not found", null));
        }
        User user = userOpt.get();
        boolean valid = otpService.validateOtp(request.getUsername(), request.getOtp());
        if (!valid) {
            return ResponseEntity.status(401).body(new AuthResponse("Invalid OTP", null));
        }
        user.setOtpVerified(true);
        userService.update(user);
        return ResponseEntity.ok(new AuthResponse("OTP verified. You can now log in.", null));
    }
}