import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TransactionService } from '../../core/transaction.service';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="gradient-header small-header">
      <a routerLink="/dashboard" class="back-btn">← Back</a>
      <h2>Add Money</h2>
    </div>

    <div class="content-area">
      <div class="card">
        <p class="label">Amount</p>
        <div class="amount-input-wrap">
          <span class="rupee">₹</span>
          <input class="amount-input" type="number" placeholder="0"
                 [(ngModel)]="amount" name="amount" />
        </div>

        <div class="quick-amounts">
          @for (val of [100, 500, 1000, 2000]; track val) {
            <button class="chip" (click)="amount = val">₹{{ val }}</button>
          }
        </div>

        <p class="label" style="margin-top: 20px;">Note (optional)</p>
        <input class="input-field" type="text" placeholder="e.g. Salary, savings"
               [(ngModel)]="description" name="description" />

        @if (errorMessage) {
          <div class="error-text">{{ errorMessage }}</div>
        }
        @if (successMessage) {
          <div class="success-text">{{ successMessage }}</div>
        }

        <button class="btn-primary" (click)="onDeposit()" [disabled]="loading">
          {{ loading ? 'Processing...' : 'Add Money' }}
        </button>
      </div>
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
    .quick-amounts { display: flex; gap: 8px; flex-wrap: wrap; }
    .chip {
      background: #f0ebf8;
      color: var(--primary);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }
    .success-text { color: #00c853; font-size: 13px; margin: -8px 0 14px; font-weight: 600; }
  `],
})
export class DepositComponent {
  private transactionService = inject(TransactionService);
  private router = inject(Router);

  amount: number | null = null;
  description = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  onDeposit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'Please enter a valid amount.';
      return;
    }

    this.loading = true;
    this.transactionService.deposit({
      amount: this.amount,
      description: this.description || undefined,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Money added successfully!';
        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Deposit failed. Please try again.';
      },
    });
  }
}