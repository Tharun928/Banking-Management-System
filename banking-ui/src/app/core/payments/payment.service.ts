import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PaymentRequest, PaymentResponse, Transaction, AccountBalance } from './payment.models';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly base = environment.apiBaseUrl || '';
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Make a payment
  makePayment(payment: PaymentRequest) {
    console.log('Making payment with auth token:', this.authService.getToken());
    return this.http.post<PaymentResponse>(`${this.base}/payment`, payment);
  }

  // Get all transactions (for admin/employee)
  getAllTransactions() {
    console.log('Getting all transactions with auth token:', this.authService.getToken());
    return this.http.get<Transaction[]>(`${this.base}/payment/transactions`);
  }

  // Get transactions for a specific account (for customers)
  getTransactionsByAccount(accountId: number) {
    console.log('Getting transactions for account:', accountId, 'with auth token:', this.authService.getToken());
    return this.http.get<Transaction[]>(`${this.base}/payment/transactions/account/${accountId}`);
  }

  // Get account balance
  getAccountBalance(accountId: number) {
    return this.http.get<AccountBalance>(`${this.base}/account/${accountId}`);
  }

  // Get customer accounts (for customers to see their own accounts)
  getCustomerAccounts(customerId: number) {
    return this.http.get<AccountBalance[]>(`${this.base}/account/customer/${customerId}`);
  }
}


export type { AccountBalance };

