package com.wallet.app.dto;

public class AuthResponse {
    private String token;
    private String fullName;
    private String email;
    private String phoneNumber;

    public AuthResponse() {
    }

    public AuthResponse(String token, String fullName, String email, String phoneNumber) {
        this.token = token;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
}