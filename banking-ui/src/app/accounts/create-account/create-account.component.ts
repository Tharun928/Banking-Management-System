import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class CreateAccountComponent implements OnInit {
  accountForm: any;
  customers: any[] = [];
  loading = false;
  message = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.accountForm = this.fb.group({
      customerId: ['', Validators.required],
      accountType: ['SAVINGS', Validators.required],
      initialBalance: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.http.get('/customer').subscribe({
      next: (customers: any) => {
        this.customers = customers;
      },
      error: (err) => {
        this.error = 'Failed to load customers';
      }
    });
  }

  submitAccount() {
    if (this.accountForm.invalid) return;

    this.loading = true;
    this.message = '';
    this.error = '';

    const accountData = this.accountForm.value;
    
    this.http.post('/account', accountData).subscribe({
      next: (response: any) => {
        this.message = `Account created successfully! Account ID: ${response.id}`;
        this.accountForm.reset();
        this.accountForm.patchValue({ accountType: 'SAVINGS', initialBalance: 0 });
      },
      error: (err) => {
        console.error('Account creation error:', err);
        this.error = err?.error?.message || 'Failed to create account';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getCustomerDisplay(customer: any): string {
    return `${customer.firstName} ${customer.lastName} (ID: ${customer.id})`;
  }
}
