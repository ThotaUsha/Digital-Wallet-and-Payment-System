# Digital Wallet Frontend (Angular 21)

## What this is
A PhonePe-style UI for the Digital Wallet system — login, register, dashboard
with balance card, add money, send money, and transaction history.

## Prerequisites
- Node.js and npm (already confirmed installed)
- Angular CLI 21 (already confirmed installed: `ng version`)
- Your backend must be running on http://localhost:8080

## Setup

1. Open a terminal (cmd) in this folder
2. Install dependencies:
   ```
   npm install
   ```
   This will take a few minutes the first time.

3. Start the app:
   ```
   ng serve
   ```

4. Open your browser to:
   ```
   http://localhost:4200
   ```

## Important
Make sure your Spring Boot backend (Eclipse) is running BEFORE you open the
frontend, or login/register will fail with connection errors.

## Pages
- `/login` — Login page
- `/register` — Create account
- `/dashboard` — Balance + quick actions + recent activity
- `/deposit` — Add money
- `/transfer` — Send money to another user
- `/history` — Full transaction history
