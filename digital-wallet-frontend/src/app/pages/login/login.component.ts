import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-wrap">
      <div class="brand-section">
        <div class="logo-circle">💜</div>
        <h1>Digital Wallet</h1>
        <p>Fast. Secure. Simple payments.</p>
      </div>

      <div class="card form-card">
        <h2>Login</h2>

        <input class="input-field" type="email" placeholder="Email address"
               [(ngModel)]="email" name="email" />

        <input class="input-field" type="password" placeholder="Password"
               [(ngModel)]="password" name="password" />

        @if (errorMessage) {
          <div class="error-text">{{ errorMessage }}</div>
        }

        <button class="btn-primary" (click)="onLogin()" [disabled]="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

        <p class="switch-text">
          New here? <a class="link-text" routerLink="/register">Create an account</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-wrap {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: linear-gradient(135deg, #5f259f 0%, #8341c9 100%);
    }
    .brand-section {
      text-align: center;
      color: white;
      padding: 60px 20px 40px;
    }
    .logo-circle {
      width: 64px;
      height: 64px;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      margin: 0 auto 16px;
    }
    .brand-section h1 { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
    .brand-section p { font-size: 13px; opacity: 0.85; }
    .form-card {
      margin: 0 20px;
      border-radius: 24px 24px 0 0;
      flex: 1;
      padding: 32px 24px;
    }
    .form-card h2 { font-size: 20px; margin-bottom: 20px; font-weight: 700; }
    .switch-text { text-align: center; font-size: 13px; color: var(--text-muted); margin-top: 16px; }
  `],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  onLogin() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.loading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Login failed. Please check your credentials.';
      },
    });
  }
}
