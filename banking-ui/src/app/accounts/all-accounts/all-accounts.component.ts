import { Component, OnInit } from '@angular/core';
import { Account, AccountService } from '../../core/accounts/account.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-accounts',
  templateUrl: './all-accounts.component.html',
  styleUrls: ['./all-accounts.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AllAccountsComponent implements OnInit {
  accounts: Account[] = [];
  loading = false;
  error = '';

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loading = true;
    this.accountService.getAll().subscribe({
      next: (res) => (this.accounts = res),
      error: (err) => (this.error = err?.error?.message || 'Failed to load accounts'),
      complete: () => (this.loading = false)
    });
  }
}
