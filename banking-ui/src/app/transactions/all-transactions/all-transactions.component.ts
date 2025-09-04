import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaymentService } from '../../core/payments/payment.service';
import { Transaction } from '../../core/payments/payment.models';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-all-transactions',
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AllTransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  loading = false;
  error = '';
  currentUserRole = '';

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.authService.getRole() || '';
    this.loadAllTransactions();
  }

  loadAllTransactions(): void {
    this.loading = true;
    this.error = '';
    
    this.paymentService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        // Mock transactions for demo if none exist
        if (transactions.length === 0) {
          this.transactions = [
            {
              id: 1,
              transactionId: 'TXN001',
              fromAccountId: 1,
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
              toAccountId: 1,
              fromAccountNumber: 'ACC003',
              toAccountNumber: 'ACC001',
              amount: 1000,
              description: 'Salary deposit',
              status: 'COMPLETED',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              transactionType: 'DEPOSIT'
            },
            {
              id: 3,
              transactionId: 'TXN003',
              fromAccountId: 2,
              toAccountId: 4,
              fromAccountNumber: 'ACC002',
              toAccountNumber: 'ACC004',
              amount: 750,
              description: 'Utility bill payment',
              status: 'COMPLETED',
              timestamp: new Date(Date.now() - 172800000).toISOString(),
              transactionType: 'PAYMENT'
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
            fromAccountId: 1,
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

  getTransactionTypeClass(type: string): string {
    switch (type) {
      case 'PAYMENT': return 'type-payment';
      case 'TRANSFER': return 'type-transfer';
      case 'DEPOSIT': return 'type-deposit';
      case 'WITHDRAWAL': return 'type-withdrawal';
      default: return 'type-default';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'status-completed';
      case 'PENDING': return 'status-pending';
      case 'FAILED': return 'status-failed';
      default: return 'status-default';
    }
  }

  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }

  getTotalAmount(): number {
    return this.transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  getCompletedTransactions(): number {
    return this.transactions.filter(t => t.status === 'COMPLETED').length;
  }
}
