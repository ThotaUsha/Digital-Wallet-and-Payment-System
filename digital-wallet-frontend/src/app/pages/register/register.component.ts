import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-wrap">
      <div class="brand-section">
        <div class="logo-circle">💜</div>
        <h1>Create Account</h1>
        <p>Join Digital Wallet in seconds</p>
      </div>

      <div class="card form-card">
        <input class="input-field" type="text" placeholder="Full name"
               [(ngModel)]="fullName" name="fullName" />

        <input class="input-field" type="email" placeholder="Email address"
               [(ngModel)]="email" name="email" />

        <input class="input-field" type="tel" placeholder="Phone number (10 digits)"
               [(ngModel)]="phoneNumber" name="phoneNumber" maxlength="10" />

        <input class="input-field" type="password" placeholder="Password (min 6 characters)"
               [(ngModel)]="password" name="password" />

        <input class="input-field" type="password" placeholder="Set 4-digit transaction PIN"
               [(ngModel)]="pin" name="pin" maxlength="4" inputmode="numeric" />
        <p class="pin-hint">You'll use this PIN to confirm every money transfer.</p>

        @if (errorMessage) {
          <div class="error-text">{{ errorMessage }}</div>
        }

        <button class="btn-primary" (click)="onRegister()" [disabled]="loading">
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>

        <p class="switch-text">
          Already have an account? <a class="link-text" routerLink="/login">Login</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .register-wrap {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: linear-gradient(135deg, #5f259f 0%, #8341c9 100%);
    }
    .brand-section {
      text-align: center;
      color: white;
      padding: 48px 20px 32px;
    }
    .logo-circle {
      width: 56px;
      height: 56px;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin: 0 auto 14px;
    }
    .brand-section h1 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
    .brand-section p { font-size: 13px; opacity: 0.85; }
    .form-card {
      margin: 0 20px;
      border-radius: 24px 24px 0 0;
      flex: 1;
      padding: 32px 24px;
    }
    .switch-text { text-align: center; font-size: 13px; color: var(--text-muted); margin-top: 16px; }
    .pin-hint { font-size: 12px; color: var(--text-muted); margin: -10px 0 14px; }
  `],
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  fullName = '';
  email = '';
  phoneNumber = '';
  password = '';
  pin = '';
  loading = false;
  errorMessage = '';

  onRegister() {
    this.errorMessage = '';

    if (!this.fullName || !this.email || !this.phoneNumber || !this.password || !this.pin) {
      this.errorMessage = 'Please fill in all fields, including your PIN.';
      return;
    }
    if (!/^[0-9]{10}$/.test(this.phoneNumber)) {
      this.errorMessage = 'Phone number must be exactly 10 digits.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }
    if (!/^[0-9]{4}$/.test(this.pin)) {
      this.errorMessage = 'PIN must be exactly 4 digits.';
      return;
    }

    this.loading = true;
    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
      pin: this.pin,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Registration failed. Please try again.';
      },
    });
  }
}