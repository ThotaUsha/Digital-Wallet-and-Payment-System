package com.wallet.app.service;

import com.wallet.app.config.JwtUtil;
import com.wallet.app.dto.*;
import com.wallet.app.entity.User;
import com.wallet.app.entity.Wallet;
import com.wallet.app.repository.UserRepository;
import com.wallet.app.repository.WalletRepository;
import com.wallet.app.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, WalletRepository walletRepository,
                        PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("Email is already registered", HttpStatus.CONFLICT);
        }
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new ApiException("Phone number is already registered", HttpStatus.CONFLICT);
        }

        User user = new User(
                request.getFullName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getPhoneNumber(),
                passwordEncoder.encode(request.getPin())
        );
        user = userRepository.save(user);

        Wallet wallet = new Wallet(user);
        walletRepository.save(wallet);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getFullName(), user.getEmail(), user.getPhoneNumber());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getFullName(), user.getEmail(), user.getPhoneNumber());
    }
}