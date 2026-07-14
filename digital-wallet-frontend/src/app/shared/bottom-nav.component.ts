import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bottom-nav">
      <a routerLink="/dashboard" class="nav-item" [class.active]="active === 'home'">
        <div class="nav-icon">⌂</div>
        <span>Home</span>
      </a>
      <a routerLink="/transfer" class="nav-item" [class.active]="active === 'send'">
        <div class="nav-icon">↑</div>
        <span>Send Money</span>
      </a>
      <a routerLink="/deposit" class="nav-item" [class.active]="active === 'add'">
        <div class="nav-icon-fab">+</div>
        <span>Add Money</span>
      </a>
      <a routerLink="/history" class="nav-item" [class.active]="active === 'history'">
        <div class="nav-icon">≡</div>
        <span>History</span>
      </a>
      <a routerLink="/profile" class="nav-item" [class.active]="active === 'profile'">
        <div class="nav-icon">◎</div>
        <span>Profile</span>
      </a>
    </div>
  `,
  styles: [`
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      max-width: 480px;
      background: white;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 8px 4px calc(8px + env(safe-area-inset-bottom));
      box-shadow: 0 -4px 20px rgba(95, 37, 159, 0.1);
      z-index: 100;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      text-decoration: none;
      color: #9a94a8;
      font-size: 10px;
      font-weight: 600;
      flex: 1;
      padding: 4px 0;
    }
    .nav-item.active { color: var(--primary); }
    .nav-icon {
      font-size: 18px;
      line-height: 1;
      margin-bottom: 2px;
    }
    .nav-icon-fab {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #5f259f 0%, #8341c9 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: 700;
      margin-top: -20px;
      box-shadow: 0 4px 12px rgba(95,37,159,0.4);
    }
  `],
})
export class BottomNavComponent {
  @Input() active: 'home' | 'send' | 'add' | 'history' | 'profile' = 'home';
}