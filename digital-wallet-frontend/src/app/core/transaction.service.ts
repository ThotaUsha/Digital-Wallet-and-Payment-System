import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TransactionResponse {
  id: number;
  referenceId: string;
  senderName: string | null;
  senderPhone: string | null;
  receiverName: string | null;
  receiverPhone: string | null;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT';
  status: string;
  description: string;
  createdAt: string;
}

export interface DepositPayload {
  amount: number;
  description?: string;
}

export interface TransferPayload {
  receiverPhoneNumber: string;
  amount: number;
  description?: string;
  pin: string;
}

const API_BASE = 'http://localhost:8080/api/transactions';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private http = inject(HttpClient);

  deposit(payload: DepositPayload): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${API_BASE}/deposit`, payload);
  }

  transfer(payload: TransferPayload): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${API_BASE}/transfer`, payload);
  }

  getHistory(): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${API_BASE}/history`);
  }
}