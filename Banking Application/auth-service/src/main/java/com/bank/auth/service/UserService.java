package com.bank.auth.service;

import com.bank.auth.dto.RegisterRequest;
import com.bank.auth.model.User;
import com.bank.auth.repository.UserRepository;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Data
public class UserService {
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;

    public User register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
        user.setOtpVerified(false);
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void update(User user) {
        userRepository.save(user);
    }
}