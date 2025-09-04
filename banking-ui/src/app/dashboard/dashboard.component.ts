import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { UserRole } from '../core/auth/auth.models';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaymentService } from '../core/payments/payment.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent implements OnInit {
  UserRole = UserRole;

  constructor(
    public auth: AuthService, 
    private router: Router,
    private paymentService: PaymentService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Debug authentication status
    console.log('Dashboard - Auth Status:', {
      isLoggedIn: this.auth.isLoggedIn(),
      token: this.auth.getToken(),
      username: this.auth.getUsername(),
      role: this.auth.getRole()
    });
  }

  testAuth() {
    console.log('Testing authentication...');
    console.log('Token:', this.auth.getToken());
    console.log('Is Logged In:', this.auth.isLoggedIn());
    
    // Test a simple API call
    this.paymentService.getAllTransactions().subscribe({
      next: (data) => {
        console.log('Auth test successful:', data);
        alert('Authentication test successful!');
      },
      error: (error) => {
        console.log('Auth test failed:', error);
        alert('Authentication test failed: ' + error.status);
      }
    });
  }

  createTestUser() {
    console.log('Creating test user...');
    const testUser = {
      username: 'testuser',
      password: 'testpass123',
      email: 'test@example.com',
      role: 'CUSTOMER'
    };

    this.http.post('/auth/register', testUser).subscribe({
      next: (response) => {
        console.log('Test user created:', response);
        alert('Test user created successfully! Now try logging in.');
      },
      error: (error) => {
        console.log('Failed to create test user:', error);
        alert('Failed to create test user: ' + error.status);
      }
    });
  }

  loginTestUser() {
    console.log('Logging in test user...');
    const loginData = {
      username: 'testuser',
      password: 'testpass123'
    };

    this.auth.login(loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        alert('Login successful! You can now access the payment features.');
        // Refresh the page to update the UI
        window.location.reload();
      },
      error: (error) => {
        console.log('Login failed:', error);
        alert('Login failed: ' + (error.error?.message || error.status));
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
