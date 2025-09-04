import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { UserRole } from '../../core/auth/auth.models';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class RegisterComponent {
  roles = Object.values(UserRole);
  message = '';
  form: any;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [UserRole.CUSTOMER, Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.auth.register(this.form.value as any).subscribe({
      next: (res) => {
        this.message = res.message;
        // Redirect to OTP verification after successful registration
        setTimeout(() => {
          this.router.navigate(['/auth/otp'], { 
            queryParams: { username: this.form.value.username } 
          });
        }, 2000); // Wait 2 seconds to show the message
      },
      error: (err) => (this.message = err?.error?.message || 'Registration failed')
    });
  }
}
