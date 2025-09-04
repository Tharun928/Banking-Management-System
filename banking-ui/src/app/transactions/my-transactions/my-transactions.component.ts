import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaymentService } from '../../core/payments/payment.service';
import { Transaction, AccountBalance } from '../../core/payments/payment.models';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-my-transactions',
  templateUrl: './my-transactions.component.html',
  styleUrls: ['./my-transactions.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class MyTransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  customerAccounts: AccountBalance[] = [];
  selectedAccountId: number | null = null;
  loading = false;
  error = '';

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCustomerAccounts();
  }

  loadCustomerAccounts() {
    // For demo purposes, we'll use a mock customer ID
    // In real app, this would come from the user's profile
    const customerId = 1; // Mock customer ID
    this.paymentService.getCustomerAccounts(customerId).subscribe({
      next: (accounts) => {
        this.customerAccounts = accounts;
        if (accounts.length > 0) {
          this.selectedAccountId = accounts[0].accountId;
          this.loadTransactions(accounts[0].accountId);
        }
      },
      error: (err) => this.error = 'Failed to load your accounts'
    });
  }

  loadTransactions(accountId: number) {
    this.loading = true;
    this.error = '';
    
    this.paymentService.getTransactionsByAccount(accountId).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        // Mock transactions for demo
        if (transactions.length === 0) {
          this.transactions = [
            {
              id: 1,
              transactionId: 'TXN001',
              fromAccountId: accountId,
              toAccountId: 2,
              fromAccountNumber: 'ACC001',
              toAccountNumber: 'ACC002',
              amount: 500,
              description: 'Payment for services',
              status: 'COMPLETED',
              timestamp: new Date().toISOString(),
              transactionType: 'PAYMENT'
            },
            {
              id: 2,
              transactionId: 'TXN002',
              fromAccountId: 3,
              toAccountId: accountId,
              fromAccountNumber: 'ACC003',
              toAccountNumber: 'ACC001',
              amount: 1000,
              description: 'Salary deposit',
              status: 'COMPLETED',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              transactionType: 'DEPOSIT'
            }
          ];
        }
      },
      error: (err) => {
        this.error = 'Failed to load transactions';
        // Mock data for demo
        this.transactions = [
          {
            id: 1,
            transactionId: 'TXN001',
            fromAccountId: accountId,
            toAccountId: 2,
            fromAccountNumber: 'ACC001',
            toAccountNumber: 'ACC002',
            amount: 500,
            description: 'Payment for services',
            status: 'COMPLETED',
            timestamp: new Date().toISOString(),
            transactionType: 'PAYMENT'
          }
        ];
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onAccountChange(event: any) {
    const accountId = parseInt(event.target.value);
    if (accountId) {
      this.selectedAccountId = accountId;
      this.loadTransactions(accountId);
    }
  }

  getTransactionTypeClass(type: string): string {
    switch (type) {
      case 'PAYMENT': return 'type-payment';
      case 'TRANSFER': return 'type-transfer';
      case 'DEPOSIT': return 'type-deposit';
      case 'WITHDRAWAL': return 'type-withdrawal';
      default: return 'type-other';
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      default: return 'status-other';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}


