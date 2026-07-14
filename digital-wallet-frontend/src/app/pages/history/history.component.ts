import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TransactionService, TransactionResponse } from '../../core/transaction.service';
import { AuthService } from '../../core/auth.service';
import { BottomNavComponent } from '../../shared/bottom-nav.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink, BottomNavComponent],
  template: `
    <div class="gradient-header small-header">
      <a routerLink="/dashboard" class="back-btn">← Back</a>
      <h2>Transaction History</h2>
    </div>

    <div class="content-area">
      @if (loading) {
        <p class="empty-text">Loading transactions...</p>
      } @else if (transactions.length === 0) {
        <div class="empty-state">
          <p>No transactions yet.</p>
          <a routerLink="/deposit" class="link-text">Add your first money</a>
        </div>
      } @else {
        @for (txn of transactions; track txn.id) {
          <div class="txn-row card">
            <div class="txn-icon" [class.credit]="isCredit(txn)">
              {{ isCredit(txn) ? '↓' : '↑' }}
            </div>
            <div class="txn-info">
              <p class="txn-title">
                {{ txn.type === 'DEPOSIT' ? 'Money Added' : (isCredit(txn) ? 'Received from ' + txn.senderName : 'Sent to ' + txn.receiverName) }}
              </p>
              <p class="txn-ref">{{ txn.referenceId }}</p>
              <p class="txn-date">{{ txn.createdAt | date: 'MMM d, y · h:mm a' }}</p>
              @if (txn.description) {
                <p class="txn-desc">{{ txn.description }}</p>
              }
            </div>
            <div class="txn-right">
              <div class="txn-amount" [class.credit]="isCredit(txn)">
                {{ isCredit(txn) ? '+' : '-' }}₹{{ txn.amount | number: '1.2-2' }}
              </div>
              <div class="txn-status" [class]="txn.status.toLowerCase()">
                {{ txn.status === 'SUCCESS' ? 'Completed' : txn.status }}
              </div>
            </div>
          </div>
        }
      }
    </div>

    <app-bottom-nav active="history"></app-bottom-nav>
  `,
  styles: [`
    .small-header { padding: 20px 20px 24px; }
    .back-btn { color: white; text-decoration: none; font-size: 13px; opacity: 0.9; }
    .small-header h2 { font-size: 20px; font-weight: 700; margin-top: 8px; }
    .content-area { padding: 20px 20px 90px; margin-top: -8px; }
    .empty-text { color: var(--text-muted); font-size: 13px; text-align: center; padding: 40px 0; }
    .empty-state { text-align: center; padding: 60px 20px; }
    .empty-state p { color: var(--text-muted); margin-bottom: 12px; }

    .txn-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 10px;
      padding: 16px;
    }
    .txn-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #ffe5e5;
      color: var(--danger);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      flex-shrink: 0;
    }
    .txn-icon.credit { background: #e3f9e9; color: #00c853; }
    .txn-info { flex: 1; min-width: 0; }
    .txn-title { font-size: 14px; font-weight: 600; }
    .txn-ref { font-size: 11px; color: var(--text-muted); margin-top: 2px; font-family: monospace; }
    .txn-date { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .txn-desc { font-size: 12px; color: var(--text-muted); margin-top: 4px; font-style: italic; }
    .txn-right { text-align: right; flex-shrink: 0; }
    .txn-amount { font-weight: 700; font-size: 14px; color: var(--danger); }
    .txn-amount.credit { color: #00c853; }
    .txn-status {
      font-size: 10px;
      font-weight: 600;
      margin-top: 4px;
      padding: 2px 8px;
      border-radius: 10px;
      display: inline-block;
      background: #e3f9e9;
      color: #00c853;
    }
    .txn-status.pending { background: #fff3cd; color: #856404; }
    .txn-status.failed { background: #ffe5e5; color: var(--danger); }
  `],
})
export class HistoryComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);

  transactions: TransactionResponse[] = [];
  loading = true;
  userPhone = this.authService.getPhone();

  ngOnInit() {
    this.transactionService.getHistory().subscribe({
      next: (data) => { this.transactions = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  isCredit(txn: TransactionResponse): boolean {
    return txn.type === 'DEPOSIT' || txn.receiverPhone === this.userPhone;
  }
}