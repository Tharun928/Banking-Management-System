package com.bank.account.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.bank.account.dto.AccountDto;
import com.bank.account.dto.CustomerDto;
import com.bank.account.model.Account;
import com.bank.account.repository.AccountRepository;
import com.bank.client.CustomerClient;
import com.bank.exception.CustomerNotFoundException;
import com.bank.exception.ResourceAlreadyExistsException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {
	private final AccountRepository accountRepository;
	private final CustomerClient customerClient;

	public AccountDto save(AccountDto dto) {
		// Check if account with same account_number already exists
		Optional<Account> existing = accountRepository.findByAccountNumber(dto.getAccountNumber());
		if (existing.isPresent()) {
			throw new ResourceAlreadyExistsException(
					"Account with account number '" + dto.getAccountNumber() + "' already exists");
		}

		// Check if customer exists
		 Long customerById = customerClient.getCustomerById(dto.getCustomerId());
		if (customerById==0L) {
			throw new CustomerNotFoundException("Customer with ID '" + dto.getCustomerId() + "' does not exist");
		}

		// Create new account
		Account account = new Account();
		BeanUtils.copyProperties(dto, account);
		Account saved = accountRepository.save(account);

		AccountDto result = new AccountDto();
		BeanUtils.copyProperties(saved, result);
		return result;
	}

	public List<AccountDto> getAll() {
		return accountRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
	}

	public Optional<AccountDto> getById(Long id) {
		return accountRepository.findById(id).map(this::toDto);
	}

	public List<AccountDto> getByCustomerId(Long customerId) {
		return accountRepository.findByCustomerId(customerId).stream().map(this::toDto).collect(Collectors.toList());
	}

	public void delete(Long id) {
		accountRepository.deleteById(id);
	}

	private AccountDto toDto(Account account) {
		AccountDto dto = new AccountDto();
		BeanUtils.copyProperties(account, dto);
		return dto;
	}
}