-- Digital Wallet and Payment System - PostgreSQL Schema
-- NOTE: You do NOT need to run this manually. Spring Boot (Hibernate) will
-- auto-create these tables the first time you run the app, because
-- application.properties has: spring.jpa.hibernate.ddl-auto=update
-- This file is kept for documentation / your project report.

CREATE DATABASE wallet_db;

\c wallet_db;

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE wallets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    balance NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    version BIGINT,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    reference_id VARCHAR(40) NOT NULL UNIQUE,
    sender_id BIGINT REFERENCES users(id),
    receiver_id BIGINT REFERENCES users(id),
    amount NUMERIC(15,2) NOT NULL,
    type VARCHAR(20) NOT NULL,     -- DEPOSIT, WITHDRAWAL, TRANSFER, PAYMENT
    status VARCHAR(20) NOT NULL,   -- PENDING, SUCCESS, FAILED
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_sender ON transactions(sender_id);
CREATE INDEX idx_transactions_receiver ON transactions(receiver_id);
