package com.bank.customer.service;

import com.bank.customer.dto.CustomerDto;
import com.bank.customer.model.Customer;
import com.bank.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;

    public CustomerDto save(CustomerDto dto) {
    	System.out.println("inside customer controller");
        Customer customer = new Customer();
        BeanUtils.copyProperties(dto, customer);
        Customer saved = customerRepository.save(customer);
        CustomerDto result = new CustomerDto();
        BeanUtils.copyProperties(saved, result);
        return result;
    }

    public List<CustomerDto> getAll() {
        return customerRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public Long getById(Long id) {
        Optional<Customer> byId = customerRepository.findById(id);
        if(byId.isEmpty()) {
        	return 0L;
        }
        return 1L;
    }

    public void delete(Long id) {
        customerRepository.deleteById(id);
    }

    private CustomerDto toDto(Customer customer) {
        CustomerDto dto = new CustomerDto();
        BeanUtils.copyProperties(customer, dto);
        return dto;
    }
}