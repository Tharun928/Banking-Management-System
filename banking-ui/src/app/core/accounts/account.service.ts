import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Account {
  id: number;
  customerId: number;
  accountNumber: string;
  accountType: string;
  balance: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly base = environment.apiBaseUrl || '';
  
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Account[]>(`${this.base}/account`);
  }

  getByCustomerId(customerId: number) {
    return this.http.get<Account[]>(`${this.base}/account/customer/${customerId}`);
  }
}
