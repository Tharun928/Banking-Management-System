import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class LoginComponent {
  message = '';
  form: any;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.auth.login(this.form.value as any).subscribe({
      next: (res) => {
        if (res.token) {
          this.router.navigate(['/']);
        } else {
          this.message = res.message || 'Login response received';
        }
      },
      error: (err) => {
        const msg = err?.error?.message || '';
        if (err.status === 403 && msg.toLowerCase().includes('otp')) {
          this.message = 'OTP required. Check your email.';
          this.router.navigate(['/auth/otp'], { queryParams: { username: this.form.value.username } });
        } else {
          this.message = msg || 'Login failed';
        }
      }
    });
  }
}
