import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TransactionService } from '../../core/transaction.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="gradient-header small-header">
      <a routerLink="/dashboard" class="back-btn">← Back</a>
      <h2>Send Money</h2>
    </div>

    <div class="content-area">
      @if (!showPinStep) {
        <div class="card">
          <p class="label">Recipient's Phone Number</p>
          <input class="input-field" type="tel" placeholder="10-digit mobile number"
                 [(ngModel)]="receiverPhoneNumber" name="receiverPhoneNumber" maxlength="10" inputmode="numeric" />

          <p class="label">Amount</p>
          <div class="amount-input-wrap">
            <span class="rupee">₹</span>
            <input class="amount-input" type="number" placeholder="0"
                   [(ngModel)]="amount" name="amount" />
          </div>

          <p class="label" style="margin-top: 4px;">Note (optional)</p>
          <input class="input-field" type="text" placeholder="e.g. Dinner split, rent"
                 [(ngModel)]="description" name="description" />

          @if (errorMessage) {
            <div class="error-text">{{ errorMessage }}</div>
          }

          <button class="btn-primary" (click)="proceedToPin()">
            Proceed to Pay
          </button>
        </div>
      } @else {
        <div class="card pin-card">
          <div class="pin-summary">
            <p class="pin-summary-label">Paying</p>
            <p class="pin-summary-amount">₹{{ amount | number: '1.2-2' }}</p>
            <p class="pin-summary-to">to {{ receiverPhoneNumber }}</p>
          </div>

          <p class="label pin-label">Enter your 4-digit PIN to confirm</p>
          <div class="pin-boxes">
            <input class="pin-box" type="password" maxlength="1" inputmode="numeric"
                   [(ngModel)]="pinDigits[0]" name="pin0" #p0
                   (input)="onPinInput(0, $event)" />
            <input class="pin-box" type="password" maxlength="1" inputmode="numeric"
                   [(ngModel)]="pinDigits[1]" name="pin1" #p1
                   (input)="onPinInput(1, $event)" />
            <input class="pin-box" type="password" maxlength="1" inputmode="numeric"
                   [(ngModel)]="pinDigits[2]" name="pin2" #p2
                   (input)="onPinInput(2, $event)" />
            <input class="pin-box" type="password" maxlength="1" inputmode="numeric"
                   [(ngModel)]="pinDigits[3]" name="pin3" #p3
                   (input)="onPinInput(3, $event)" />
          </div>

          @if (errorMessage) {
            <div class="error-text" style="text-align:center;">{{ errorMessage }}</div>
          }
          @if (successMessage) {
            <div class="success-text" style="text-align:center;">{{ successMessage }}</div>
          }

          <button class="btn-primary" (click)="onTransfer()" [disabled]="loading">
            {{ loading ? 'Processing...' : 'Confirm & Pay' }}
          </button>

          <button class="link-btn" (click)="showPinStep = false">Cancel</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .small-header { padding: 20px 20px 24px; }
    .back-btn { color: white; text-decoration: none; font-size: 13px; opacity: 0.9; }
    .small-header h2 { font-size: 20px; font-weight: 700; margin-top: 8px; }
    .content-area { padding: 20px; margin-top: -8px; }
    .label { font-size: 13px; color: var(--text-muted); margin-bottom: 8px; font-weight: 600; }
    .amount-input-wrap {
      display: flex;
      align-items: center;
      border: 1.5px solid #e5e1ee;
      border-radius: 12px;
      padding: 4px 16px;
      background: #fafafd;
      margin-bottom: 16px;
    }
    .rupee { font-size: 24px; font-weight: 700; color: var(--primary); margin-right: 8px; }
    .amount-input {
      border: none;
      background: transparent;
      font-size: 28px;
      font-weight: 700;
      outline: none;
      width: 100%;
      padding: 12px 0;
    }
    .success-text { color: #00c853; font-size: 13px; margin: -8px 0 14px; font-weight: 600; }
    .pin-card { text-align: center; }
    .pin-summary { margin-bottom: 24px; }
    .pin-summary-label { font-size: 13px; color: var(--text-muted); }
    .pin-summary-amount { font-size: 32px; font-weight: 800; color: var(--primary); margin: 4px 0; }
    .pin-summary-to { font-size: 13px; color: var(--text-muted); }
    .pin-label { text-align: center; }
    .pin-boxes { display: flex; justify-content: center; gap: 12px; margin-bottom: 20px; }
    .pin-box {
      width: 52px;
      height: 56px;
      text-align: center;
      font-size: 24px;
      font-weight: 700;
      border: 1.5px solid #e5e1ee;
      border-radius: 12px;
      background: #fafafd;
      outline: none;
    }
    .pin-box:focus { border-color: var(--primary); background: white; }
    .link-btn {
      background: none;
      color: var(--text-muted);
      font-size: 13px;
      padding: 12px;
      width: 100%;
      margin-top: 8px;
    }
  `],
})
export class TransferComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  receiverPhoneNumber = '';
  amount: number | null = null;
  description = '';
  pinDigits: string[] = ['', '', '', ''];
  showPinStep = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    const prefill = this.route.snapshot.queryParamMap.get('phone');
    if (prefill) this.receiverPhoneNumber = prefill;
  }

  proceedToPin() {
    this.errorMessage = '';

    if (!/^[0-9]{10}$/.test(this.receiverPhoneNumber)) {
      this.errorMessage = 'Please enter a valid 10-digit phone number.';
      return;
    }
    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'Please enter a valid amount.';
      return;
    }

    this.showPinStep = true;
  }

  onPinInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value && index < 3) {
      const next = document.querySelectorAll('.pin-box')[index + 1] as HTMLInputElement;
      next?.focus();
    }
  }

  onTransfer() {
    this.errorMessage = '';
    this.successMessage = '';

    const pin = this.pinDigits.join('');
    if (pin.length !== 4) {
      this.errorMessage = 'Please enter all 4 digits of your PIN.';
      return;
    }

    this.loading = true;
    this.transactionService.transfer({
      receiverPhoneNumber: this.receiverPhoneNumber,
      amount: this.amount!,
      description: this.description || undefined,
      pin,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Money sent successfully!';
        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      },
      error: (err) => {
        this.loading = false;
        this.pinDigits = ['', '', '', ''];
        this.errorMessage = err?.error?.message || 'Transfer failed. Please try again.';
      },
    });
  }
}