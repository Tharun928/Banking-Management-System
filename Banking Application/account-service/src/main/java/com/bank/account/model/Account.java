package com.bank.account.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "accounts")
@Data
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Use IDENTITY for MySQL
    private Long id;

    private Long customerId;
    private String accountNumber;
    private String accountType;  // SAVINGS, CURRENT, LOAN
    private Double balance;
    private String status;       // ACTIVE, CLOSED, etc.
}
