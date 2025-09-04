package com.bank.payment.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.bank.payment.dto.PaymentDto;
import com.bank.payment.model.Account;
import com.bank.payment.model.Payment;
import com.bank.payment.repository.AccountRepository;
import com.bank.payment.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AccountRepository accountRepository;

 

    public PaymentDto makePayment(PaymentDto dto) {
        Payment payment = new Payment();
        BeanUtils.copyProperties(dto, payment);
        payment.setTimestamp(new Date());

        // Example logic: check account exists and has enough funds
        Optional<Account> fromAccountOpt = accountRepository.findById(dto.getFromAccountId());
        Optional<Account> toAccountOpt = accountRepository.findById(dto.getToAccountId());

        if (fromAccountOpt.isPresent() && toAccountOpt.isPresent()) {
            Account from = fromAccountOpt.get();
            if (from.getBalance() >= dto.getAmount()) {
                // Deduct and update both accounts
                from.setBalance(from.getBalance() - dto.getAmount());
                Account to = toAccountOpt.get();
                to.setBalance(to.getBalance() + dto.getAmount());
                System.out.println("inside payment");
                accountRepository.save(from);
                accountRepository.save(to);

                payment.setStatus("SUCCESS");
            } else {
                payment.setStatus("FAILED");
            }
        } else {
            payment.setStatus("FAILED");
        }

        Payment saved = paymentRepository.save(payment);
        PaymentDto result = new PaymentDto();
        BeanUtils.copyProperties(saved, result);
        return result;
    }
    public List<PaymentDto> getAll() {
        return paymentRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public Optional<PaymentDto> getById(Long id) {
        return paymentRepository.findById(id).map(this::toDto);
    }

    private PaymentDto toDto(Payment payment) {
        PaymentDto dto = new PaymentDto();
        BeanUtils.copyProperties(payment, dto);
        return dto;
    }
}