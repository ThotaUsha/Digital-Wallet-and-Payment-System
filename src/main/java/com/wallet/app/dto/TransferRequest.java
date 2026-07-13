package com.wallet.app.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;

public class TransferRequest {

    @NotBlank(message = "Receiver phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String receiverPhoneNumber;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    private String description;

    @NotBlank(message = "Transaction PIN is required")
    private String pin;

    public String getReceiverPhoneNumber() { return receiverPhoneNumber; }
    public void setReceiverPhoneNumber(String receiverPhoneNumber) { this.receiverPhoneNumber = receiverPhoneNumber; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
}