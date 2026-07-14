import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { BottomNavComponent } from '../../shared/bottom-nav.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, BottomNavComponent],
  template: `
    <div class="gradient-header small-header">
      <a routerLink="/dashboard" class="back-btn">← Back</a>
      <h2>Profile</h2>
    </div>

    <div class="content-area">
      <div class="card profile-card">
        <div class="profile-avatar">{{ initials }}</div>
        <h3>{{ userName }}</h3>
        <p class="profile-email">{{ userEmail }}</p>
      </div>

      <div class="card info-card">
        <div class="info-row">
          <span class="info-label">Phone Number</span>
          <span class="info-value">{{ userPhone }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value">{{ userEmail }}</span>
        </div>
      </div>

      <button class="btn-primary logout-btn" (click)="onLogout()">Logout</button>
    </div>

    <app-bottom-nav active="profile"></app-bottom-nav>
  `,
  styles: [`
    .small-header { padding: 20px 20px 24px; }
    .back-btn { color: white; text-decoration: none; font-size: 13px; opacity: 0.9; }
    .small-header h2 { font-size: 20px; font-weight: 700; margin-top: 8px; }
    .content-area { padding: 20px; margin-top: -8px; padding-bottom: 90px; }

    .profile-card { text-align: center; margin-bottom: 16px; }
    .profile-avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, #5f259f 0%, #8341c9 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
      margin: 0 auto 12px;
    }
    .profile-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
    .profile-email { font-size: 13px; color: var(--text-muted); }

    .info-card { margin-bottom: 20px; }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0ebf8;
    }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-size: 13px; color: var(--text-muted); font-weight: 600; }
    .info-value { font-size: 13px; font-weight: 600; }

    .logout-btn { background: #ffe5e5; color: var(--danger); }
  `],
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  userName = this.authService.getFullName();
  userEmail = this.authService.getEmail();
  userPhone = this.authService.getPhone();

  get initials(): string {
    return this.userName ? this.userName.charAt(0).toUpperCase() : '?';
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}