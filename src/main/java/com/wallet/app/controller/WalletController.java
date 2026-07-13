package com.wallet.app.controller;

import com.wallet.app.dto.WalletResponse;
import com.wallet.app.entity.Wallet;
import com.wallet.app.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping("/me")
    public ResponseEntity<WalletResponse> getMyWallet(Authentication authentication) {
        Wallet wallet = walletService.getWalletByEmail(authentication.getName());
        WalletResponse response = new WalletResponse(
                wallet.getId(),
                wallet.getUser().getFullName(),
                wallet.getUser().getEmail(),
                wallet.getBalance(),
                wallet.getCurrency()
        );
        return ResponseEntity.ok(response);
    }
}