import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class OtpComponent {
  message = '';
  form: any;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private route: ActivatedRoute, 
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      otp: ['', Validators.required]
    });
    
    const qpUser = this.route.snapshot.queryParamMap.get('username');
    if (qpUser) this.form.patchValue({ username: qpUser });
  }

  submit() {
    if (this.form.invalid) return;
    this.auth.verifyOtp(this.form.value as any).subscribe({
      next: (res) => {
        this.message = res.message;
        this.router.navigate(['/auth/login']);
      },
      error: (err) => (this.message = err?.error?.message || 'OTP verification failed')
    });
  }
}
