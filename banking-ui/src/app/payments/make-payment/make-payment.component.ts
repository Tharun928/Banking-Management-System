import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaymentService, AccountBalance } from '../../core/payments/payment.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class MakePaymentComponent implements OnInit {
  paymentForm: any;
  customerAccounts: AccountBalance[] = [];
  allAccounts: AccountBalance[] = [];
  loading = false;
  message = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {
    this.paymentForm = this.fb.group({
      fromAccountId: ['', Validators.required],
      toAccountId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCustomerAccounts();
    this.loadAllAccounts();
  }

  loadCustomerAccounts() {
    // For demo purposes, we'll use a mock customer ID
    // In real app, this would come from the user's profile
    const customerId = 1; // Mock customer ID
    this.paymentService.getCustomerAccounts(customerId).subscribe({
      next: (accounts) => {
        this.customerAccounts = accounts;
        if (accounts.length > 0) {
          this.paymentForm.patchValue({ fromAccountId: accounts[0].accountId });
        }
      },
      error: (err) => this.error = 'Failed to load your accounts'
    });
  }

  loadAllAccounts() {
    this.paymentService.getAllTransactions().subscribe({
      next: (transactions) => {
        // Mock all accounts for demo - in real app this would come from account service
        this.allAccounts = [
          { accountId: 1, accountNumber: 'ACC001', balance: 5000, accountType: 'SAVINGS', status: 'ACTIVE' },
          { accountId: 2, accountNumber: 'ACC002', balance: 3000, accountType: 'CURRENT', status: 'ACTIVE' },
          { accountId: 3, accountNumber: 'ACC003', balance: 7500, accountType: 'SAVINGS', status: 'ACTIVE' }
        ];
      },
      error: (err) => this.error = 'Failed to load accounts'
    });
  }

  submitPayment() {
    if (this.paymentForm.invalid) return;

    this.loading = true;
    this.message = '';
    this.error = '';

    const paymentData = this.paymentForm.value;
    
    // Validate and convert form data
    const payment: any = {
      fromAccountId: parseInt(paymentData.fromAccountId),
      toAccountId: parseInt(paymentData.toAccountId),
      amount: parseFloat(paymentData.amount),
      description: paymentData.description || ''
    };
    
    // Validate that we have valid numbers
    if (isNaN(payment.fromAccountId) || isNaN(payment.toAccountId) || isNaN(payment.amount)) {
      this.error = 'Invalid payment data. Please check your inputs.';
      this.loading = false;
      return;
    }
    
    console.log('Submitting payment:', payment);
    
    this.paymentService.makePayment(payment).subscribe({
      next: (response) => {
        this.message = `Payment successful! Transaction ID: ${response.transactionId}`;
        this.paymentForm.reset();
        this.loadCustomerAccounts(); // Refresh account balances
      },
      error: (err) => {
        console.error('Payment error:', err);
        this.error = err?.error?.message || 'Payment failed';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getAccountDisplay(account: AccountBalance): string {
    return `${account.accountNumber} (${account.accountType}) - Balance: $${account.balance}`;
  }
}


