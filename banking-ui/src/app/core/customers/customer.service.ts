import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Customer {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  kycStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly base = environment.apiBaseUrl || '';
  
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Customer[]>(`${this.base}/customer`);
  }
}
