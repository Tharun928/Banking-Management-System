export interface PaymentRequest {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description?: string;
}

export interface PaymentResponse {
  id: number;
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description?: string;
  status: string;
  timestamp: string;
  transactionId: string;
}

export interface Transaction {
  id: number;
  transactionId: string;
  fromAccountId: number;
  toAccountId: number;
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  description?: string;
  status: string;
  timestamp: string;
  transactionType: 'PAYMENT' | 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL';
}

export interface AccountBalance {
  accountId: number;
  accountNumber: string;
  balance: number;
  accountType: string;
  status: string;
}


