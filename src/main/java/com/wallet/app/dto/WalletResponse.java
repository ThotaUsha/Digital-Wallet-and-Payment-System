package com.wallet.app.dto;

import java.math.BigDecimal;

public class WalletResponse {
    private Long walletId;
    private String ownerName;
    private String ownerEmail;
    private BigDecimal balance;
    private String currency;

    public WalletResponse() {}

    public WalletResponse(Long walletId, String ownerName, String ownerEmail, BigDecimal balance, String currency) {
        this.walletId = walletId;
        this.ownerName = ownerName;
        this.ownerEmail = ownerEmail;
        this.balance = balance;
        this.currency = currency;
    }

    public Long getWalletId() { return walletId; }
    public void setWalletId(Long walletId) { this.walletId = walletId; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}