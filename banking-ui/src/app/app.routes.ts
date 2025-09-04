import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { OtpComponent } from './auth/otp/otp.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AllAccountsComponent } from './accounts/all-accounts/all-accounts.component';
import { AllCustomersComponent } from './customers/all-customers/all-customers.component';
import { CreateCustomerComponent } from './customers/create-customer/create-customer.component';
import { CreateAccountComponent } from './accounts/create-account/create-account.component';
import { MakePaymentComponent } from './payments/make-payment/make-payment.component';
import { MyTransactionsComponent } from './transactions/my-transactions/my-transactions.component';
import { AllTransactionsComponent } from './transactions/all-transactions/all-transactions.component';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { UserRole } from './core/auth/auth.models';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/otp', component: OtpComponent },
  {
    path: 'accounts',
    component: AllAccountsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.EMPLOYEE] }
  },
  {
    path: 'accounts/create',
    component: CreateAccountComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.EMPLOYEE] }
  },
  {
    path: 'customers',
    component: AllCustomersComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.EMPLOYEE] }
  },
  {
    path: 'customers/create',
    component: CreateCustomerComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.EMPLOYEE] }
  },
  {
    path: 'payments/make-payment',
    component: MakePaymentComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transactions/my-transactions',
    component: MyTransactionsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transactions/all-transactions',
    component: AllTransactionsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.EMPLOYEE] }
  },
  { path: '**', redirectTo: '' }
];
