import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WalletInfo {
  walletId: number;
  ownerName: string;
  ownerEmail: string;
  balance: number;
  currency: string;
}

const API_BASE = 'http://localhost:8080/api/wallet';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private http = inject(HttpClient);

  getMyWallet(): Observable<WalletInfo> {
    return this.http.get<WalletInfo>(`${API_BASE}/me`);
  }
}
