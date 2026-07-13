package com.wallet.app.service;

import com.wallet.app.entity.User;
import com.wallet.app.entity.Wallet;
import com.wallet.app.exception.ApiException;
import com.wallet.app.repository.UserRepository;
import com.wallet.app.repository.WalletRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final UserRepository userRepository;

    public WalletService(WalletRepository walletRepository, UserRepository userRepository) {
        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
    }

    public Wallet getWalletByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        return walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ApiException("Wallet not found", HttpStatus.NOT_FOUND));
    }
}
