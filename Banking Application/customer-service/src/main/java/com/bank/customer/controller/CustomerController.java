package com.bank.customer.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bank.customer.dto.CustomerDto;
import com.bank.customer.service.CustomerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
public class CustomerController {
	private final CustomerService customerService;

	@PostMapping
	public ResponseEntity<CustomerDto> create(@RequestBody CustomerDto dto) {
		return ResponseEntity.ok(customerService.save(dto));
	}
    
	@GetMapping
	public ResponseEntity<List<CustomerDto>> getAllCustomers(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
			@RequestHeader(value = "X-User-Role", required = false) String role) {
		System.out.println(role);
		if (role == null || !(role.equals("ADMIN") || role.equals("EMPLOYEE"))) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		return ResponseEntity.ok(customerService.getAll());
	}

	@GetMapping("/{id}")
	public Long getById(@PathVariable Long id) {
		Long byId = customerService.getById(id);
		return byId;
				
	}
	

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		customerService.delete(id);
		return ResponseEntity.noContent().build();
	}
}