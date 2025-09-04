package com.bank.account.controller;

import com.bank.account.dto.AccountDto;
import com.bank.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class AccountController {
	private final AccountService accountService;

	@PostMapping
	public ResponseEntity<AccountDto> create(@RequestBody AccountDto dto) {
		return ResponseEntity.ok(accountService.save(dto));
	}

	@GetMapping
	public ResponseEntity<List<AccountDto>> getAll() {
		return ResponseEntity.ok(accountService.getAll());
	}

	@GetMapping("/{id}")
	public ResponseEntity<AccountDto> getById(@PathVariable Long id) {
		return accountService.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("/customer/{customerId}")
	public ResponseEntity<List<AccountDto>> getByCustomerId(@PathVariable Long customerId) {
		return ResponseEntity.ok(accountService.getByCustomerId(customerId));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		accountService.delete(id);
		return ResponseEntity.noContent().build();
	}
}