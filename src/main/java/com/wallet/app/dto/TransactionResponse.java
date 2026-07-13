package com.wallet.app.dto;

import com.wallet.app.entity.Transaction;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {
    private Long id;
    private String referenceId;
    private String senderName;
    private String senderPhone;
    private String receiverName;
    private String receiverPhone;
    private BigDecimal amount;
    private String type;
    private String status;
    private String description;
    private LocalDateTime createdAt;

    public TransactionResponse() {
    }

    public TransactionResponse(Transaction txn) {
        this.id = txn.getId();
        this.referenceId = txn.getReferenceId();
        this.senderName = txn.getSender() != null ? txn.getSender().getFullName() : null;
        this.senderPhone = txn.getSender() != null ? txn.getSender().getPhoneNumber() : null;
        this.receiverName = txn.getReceiver() != null ? txn.getReceiver().getFullName() : null;
        this.receiverPhone = txn.getReceiver() != null ? txn.getReceiver().getPhoneNumber() : null;
        this.amount = txn.getAmount();
        this.type = txn.getType().name();
        this.status = txn.getStatus().name();
        this.description = txn.getDescription();
        this.createdAt = txn.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderPhone() { return senderPhone; }
    public void setSenderPhone(String senderPhone) { this.senderPhone = senderPhone; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public String getReceiverPhone() { return receiverPhone; }
    public void setReceiverPhone(String receiverPhone) { this.receiverPhone = receiverPhone; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}