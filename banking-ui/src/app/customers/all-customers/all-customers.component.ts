import { Component, OnInit } from '@angular/core';
import { Customer, CustomerService } from '../../core/customers/customer.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-customers',
  templateUrl: './all-customers.component.html',
  styleUrls: ['./all-customers.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AllCustomersComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;
  error = '';

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loading = true;
    this.customerService.getAll().subscribe({
      next: (res) => (this.customers = res),
      error: (err) => (this.error = err?.error?.message || 'Failed to load customers'),
      complete: () => (this.loading = false)
    });
  }
}
