import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { WalletService, WalletInfo } from '../../core/wallet.service';
import { TransactionService, TransactionResponse } from '../../core/transaction.service';
import { AuthService } from '../../core/auth.service';
import { BottomNavComponent } from '../../shared/bottom-nav.component';

interface ContactDisplay {
  phone: string;
  name: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BottomNavComponent],
  template: `
    <div class="gradient-header">
      <div class="top-row">
        <div>
          <p class="greet">Hello,</p>
          <h2>{{ userName }}</h2>
        </div>
        <div class="avatar-badge">{{ initials }}</div>
      </div>

      <div class="wallet-id-chip">
        Wallet ID: WLT-{{ maskedWalletId }}
      </div>
      <p class="updated-text">🕐 Updated just now</p>
    </div>

    <!-- 3 action cards -->
    <div class="action-cards">
      <a routerLink="/transfer" class="action-card">
        <div class="action-card-icon purple-bg">👤</div>
        <p class="action-card-title">Send to Contacts</p>
        <p class="action-card-sub">Transfer to saved contacts</p>
      </a>
      <a routerLink="/transfer" class="action-card">
        <div class="action-card-icon blue-bg">📱</div>
        <p class="action-card-title">Send to Number</p>
        <p class="action-card-sub">Enter mobile number to send</p>
      </a>
      <div class="action-card" (click)="toggleBalance()">
        <div class="action-card-icon green-bg">👁</div>
        <p class="action-card-title">View Balance</p>
        @if (showBalance) {
          <p class="action-card-balance">₹{{ wallet?.balance | number: '1.2-2' }}</p>
        } @else {
          <p class="action-card-sub">Tap to check wallet balance</p>
        }
      </div>
    </div>

    <!-- Quick Send -->
    <div class="section">
      <div class="section-header">
        <h3>Quick Send</h3>
        <a routerLink="/history" class="link-text small">View all</a>
      </div>
      <div class="contacts-row">
        <a routerLink="/transfer" class="add-new-chip">
          <div class="add-new-circle">+</div>
          <span>Add New</span>
        </a>
        @for (contact of recentContacts; track contact.phone) {
          <a [routerLink]="['/transfer']" [queryParams]="{ phone: contact.phone }" class="contact-card">
            <div class="contact-avatar" [style.background]="contact.color">{{ contact.name.charAt(0).toUpperCase() }}</div>
            <span class="contact-name">{{ contact.name }}</span>
            <span class="contact-email">{{ maskPhone(contact.phone) }}</span>
          </a>
        }
      </div>
    </div>

    <!-- Money In / Out -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon in-icon">↙</div>
        <p class="stat-label">Money In</p>
        <p class="stat-amount in-amount">₹{{ moneyInThisMonth | number: '1.0-0' }}</p>
        <p class="stat-sub">This month</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon out-icon">↗</div>
        <p class="stat-label">Money Out</p>
        <p class="stat-amount out-amount">₹{{ moneyOutThisMonth | number: '1.0-0' }}</p>
        <p class="stat-sub">This month</p>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="recent-section">
      <div class="section-header">
        <h3>Recent Activity</h3>
        <a routerLink="/history" class="link-text small">See all</a>
      </div>

      @if (loadingHistory) {
        <p class="empty-text">Loading transactions...</p>
      } @else if (recentTransactions.length === 0) {
        <p class="empty-text">No transactions yet. Add money to get started!</p>
      } @else {
        @for (txn of recentTransactions; track txn.id) {
          <div class="txn-row card">
            <div class="txn-icon" [class.credit]="isCredit(txn)">
              {{ isCredit(txn) ? '↓' : '↑' }}
            </div>
            <div class="txn-info">
              <p class="txn-title">{{ txn.type === 'DEPOSIT' ? 'Added money to wallet' : (isCredit(txn) ? 'Received from ' + txn.senderName : 'Sent to ' + txn.receiverName) }}</p>
              <p class="txn-date">{{ txn.createdAt | date: 'MMM d, y · h:mm a' }}</p>
            </div>
            <div class="txn-right">
              <p class="txn-amount" [class.credit]="isCredit(txn)">
                {{ isCredit(txn) ? '+' : '-' }}₹{{ txn.amount | number: '1.2-2' }}
              </p>
              <span class="status-pill" [class]="txn.status.toLowerCase()">
                {{ txn.status === 'SUCCESS' ? 'Completed' : txn.status }}
              </span>
            </div>
          </div>
        }
      }
    </div>

    <app-bottom-nav active="home"></app-bottom-nav>
  `,
  styles: [`
    .top-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .greet { font-size: 13px; opacity: 0.85; }
    .top-row h2 { font-size: 20px; font-weight: 700; }
    .avatar-badge {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
    }
    .wallet-id-chip {
      display: inline-block;
      background: rgba(255,255,255,0.15);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .updated-text { font-size: 11px; opacity: 0.75; }

    .action-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      padding: 20px;
    }
    .action-card {
      background: white;
      border-radius: 14px;
      padding: 16px 10px;
      text-align: center;
      text-decoration: none;
      color: var(--text-dark);
      box-shadow: 0 4px 16px rgba(95,37,159,0.08);
      cursor: pointer;
      min-height: 110px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .action-card-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
      margin: 0 auto 8px;
    }
    .purple-bg { background: #f0ebf8; color: var(--primary); }
    .blue-bg { background: #e6f0ff; color: #2563eb; }
    .green-bg { background: #e3f9e9; color: #00c853; }
    .action-card-title { font-size: 12px; font-weight: 700; margin-bottom: 2px; }
    .action-card-sub { font-size: 10px; color: var(--text-muted); line-height: 1.3; }
    .action-card-balance { font-size: 15px; font-weight: 800; color: var(--primary); }

    .section { padding: 8px 20px 4px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .section-header h3 { font-size: 16px; font-weight: 700; }
    .small { font-size: 12px; }

    .contacts-row { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 4px; }
    .add-new-chip {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: var(--text-dark);
      font-size: 11px;
      font-weight: 600;
      flex-shrink: 0;
      width: 64px;
    }
    .add-new-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px dashed #c9c2dd;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: var(--primary);
    }
    .contact-card {
      background: white;
      border-radius: 14px;
      padding: 12px 10px;
      text-align: center;
      text-decoration: none;
      color: var(--text-dark);
      box-shadow: 0 2px 10px rgba(95,37,159,0.08);
      flex-shrink: 0;
      width: 90px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .contact-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 17px;
      margin-bottom: 4px;
    }
    .contact-name { font-size: 11px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80px; }
    .contact-email { font-size: 9px; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80px; }

    .stats-row { display: flex; gap: 12px; padding: 16px 20px; }
    .stat-card {
      flex: 1;
      background: white;
      border-radius: 14px;
      padding: 16px;
      box-shadow: 0 4px 16px rgba(95,37,159,0.08);
    }
    .stat-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .in-icon { background: #e3f9e9; color: #00c853; }
    .out-icon { background: #ffe5e5; color: var(--danger); }
    .stat-label { font-size: 12px; color: var(--text-muted); font-weight: 600; margin-bottom: 4px; }
    .stat-amount { font-size: 20px; font-weight: 800; }
    .in-amount { color: #00c853; }
    .out-amount { color: var(--danger); }
    .stat-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

    .recent-section { padding: 8px 20px 90px; }
    .empty-text { color: var(--text-muted); font-size: 13px; text-align: center; padding: 24px 0; }

    .txn-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
      padding: 14px;
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
    .txn-title { font-size: 13.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .txn-date { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }
    .txn-right { text-align: right; flex-shrink: 0; }
    .txn-amount { font-weight: 700; font-size: 14px; color: var(--danger); }
    .txn-amount.credit { color: #00c853; }
    .status-pill {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 10px;
      background: #e3f9e9;
      color: #00c853;
      margin-top: 4px;
    }
    .status-pill.pending { background: #fff3cd; color: #856404; }
    .status-pill.failed { background: #ffe5e5; color: var(--danger); }
  `],
})
export class DashboardComponent implements OnInit {
  private walletService = inject(WalletService);
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private router = inject(Router);

  wallet: WalletInfo | null = null;
  recentTransactions: TransactionResponse[] = [];
  recentContacts: ContactDisplay[] = [];
  loadingWallet = true;
  loadingHistory = true;
  showBalance = false;
  userName = this.authService.getFullName();
  userPhone = this.authService.getPhone();
  moneyInThisMonth = 0;
  moneyOutThisMonth = 0;

  private avatarColors = ['#5f259f', '#2563eb', '#ea580c', '#db2777', '#059669', '#7c3aed'];

  get initials(): string {
    return this.userName ? this.userName.charAt(0).toUpperCase() : '?';
  }

  get maskedWalletId(): string {
    const id = this.wallet?.walletId;
    return id ? '*****' + String(id).padStart(3, '0') : '*****';
  }

  ngOnInit() {
    this.walletService.getMyWallet().subscribe({
      next: (data) => { this.wallet = data; this.loadingWallet = false; },
      error: () => { this.loadingWallet = false; },
    });

    this.transactionService.getHistory().subscribe({
      next: (data) => {
        this.recentTransactions = data.slice(0, 5);
        this.loadingHistory = false;

        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        let inTotal = 0;
        let outTotal = 0;

        const contactsMap = new Map<string, string>();

        for (const txn of data) {
          const txnDate = new Date(txn.createdAt);
          const isThisMonth = txnDate.getMonth() === thisMonth && txnDate.getFullYear() === thisYear;
          const credit = this.isCredit(txn);

          if (isThisMonth) {
            if (credit) inTotal += txn.amount;
            else outTotal += txn.amount;
          }

          const otherPhone = txn.senderPhone === this.userPhone ? txn.receiverPhone : txn.senderPhone;
          const otherName = txn.senderPhone === this.userPhone ? txn.receiverName : txn.senderName;
          if (otherPhone && otherPhone !== this.userPhone && !contactsMap.has(otherPhone)) {
            contactsMap.set(otherPhone, otherName || otherPhone);
          }
        }

        this.moneyInThisMonth = inTotal;
        this.moneyOutThisMonth = outTotal;

        this.recentContacts = Array.from(contactsMap.entries())
          .slice(0, 6)
          .map(([phone, name], i) => ({
            phone,
            name,
            color: this.avatarColors[i % this.avatarColors.length],
          }));
      },
      error: () => { this.loadingHistory = false; },
    });
  }

  isCredit(txn: TransactionResponse): boolean {
    return txn.type === 'DEPOSIT' || txn.receiverPhone === this.userPhone;
  }

  maskPhone(phone: string): string {
    return phone.length >= 4 ? '****' + phone.slice(-4) : phone;
  }

  toggleBalance() {
    this.showBalance = !this.showBalance;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}