import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class CreateCustomerComponent {
  customerForm: any;
  loading = false;
  message = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      dateOfBirth: ['', Validators.required]
    });
  }

  submitCustomer() {
    if (this.customerForm.invalid) return;

    this.loading = true;
    this.message = '';
    this.error = '';

    const customerData = this.customerForm.value;
    
    this.http.post('/customer', customerData).subscribe({
      next: (response: any) => {
        this.message = `Customer created successfully! Customer ID: ${response.id}`;
        this.customerForm.reset();
      },
      error: (err) => {
        console.error('Customer creation error:', err);
        this.error = err?.error?.message || 'Failed to create customer';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
