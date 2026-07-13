# Digital Wallet Backend (Spring Boot)

## What this is
REST API backend for the Digital Wallet and Payment System — handles registration,
login (JWT), wallet balances, deposits, transfers, and transaction history.

## Prerequisites
- Java 17+
- Maven (or use the included `mvnw` if present)
- PostgreSQL running locally

## Setup

1. **Create the database** (open `psql` or pgAdmin):
   ```
   CREATE DATABASE wallet_db;
   ```
   You do NOT need to run schema.sql manually — Hibernate creates the tables
   automatically on first run.

2. **Set your DB password** in `src/main/resources/application.properties`
   if it isn't `postgres`:
   ```
   spring.datasource.password=YOUR_PASSWORD
   ```

3. **Run the app**:
   ```
   mvn spring-boot:run
   ```
   It starts on http://localhost:8080

## API Endpoints

| Method | Endpoint | Auth? | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Create account + wallet |
| POST | /api/auth/login | No | Returns JWT token |
| GET | /api/wallet/me | Yes | Get my wallet balance |
| POST | /api/transactions/deposit | Yes | Add money to wallet |
| POST | /api/transactions/transfer | Yes | Send money to another user |
| GET | /api/transactions/history | Yes | List my transactions |

For endpoints marked "Yes", add header: `Authorization: Bearer <token>`

## Test it with curl

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"pass123","phoneNumber":"9876543210"}'

# Login (copy the "token" from the response)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Deposit (replace YOUR_TOKEN)
curl -X POST http://localhost:8080/api/transactions/deposit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"amount":500,"description":"Initial deposit"}'
```
