package com.wallet.app.service;

import com.wallet.app.dto.DepositRequest;
import com.wallet.app.dto.TransferRequest;
import com.wallet.app.entity.Transaction;
import com.wallet.app.entity.User;
import com.wallet.app.entity.Wallet;
import com.wallet.app.exception.ApiException;
import com.wallet.app.repository.TransactionRepository;
import com.wallet.app.repository.UserRepository;
import com.wallet.app.repository.WalletRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TransactionService(TransactionRepository transactionRepository,
                               WalletRepository walletRepository,
                               UserRepository userRepository,
                               PasswordEncoder passwordEncoder) {
        this.transactionRepository = transactionRepository;
        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Transaction deposit(String userEmail, DepositRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ApiException("Wallet not found", HttpStatus.NOT_FOUND));

        wallet.setBalance(wallet.getBalance().add(request.getAmount()));
        walletRepository.save(wallet);

        Transaction txn = new Transaction();
        txn.setReferenceId(generateReference());
        txn.setReceiver(user);
        txn.setAmount(request.getAmount());
        txn.setType(Transaction.TransactionType.DEPOSIT);
        txn.setStatus(Transaction.TransactionStatus.SUCCESS);
        txn.setDescription(request.getDescription() != null ? request.getDescription() : "Wallet deposit");

        return transactionRepository.save(txn);
    }

    @Transactional
    public Transaction transfer(String senderEmail, TransferRequest request) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new ApiException("Sender not found", HttpStatus.NOT_FOUND));
        User receiver = userRepository.findByPhoneNumber(request.getReceiverPhoneNumber())
                .orElseThrow(() -> new ApiException("No user found with that phone number", HttpStatus.NOT_FOUND));

        if (sender.getId().equals(receiver.getId())) {
            throw new ApiException("Cannot transfer to your own account", HttpStatus.BAD_REQUEST);
        }

        if (!passwordEncoder.matches(request.getPin(), sender.getTransactionPin())) {
            throw new ApiException("Incorrect PIN", HttpStatus.UNAUTHORIZED);
        }

        Wallet senderWallet = walletRepository.findByUserId(sender.getId())
                .orElseThrow(() -> new ApiException("Sender wallet not found", HttpStatus.NOT_FOUND));
        Wallet receiverWallet = walletRepository.findByUserId(receiver.getId())
                .orElseThrow(() -> new ApiException("Receiver wallet not found", HttpStatus.NOT_FOUND));

        if (senderWallet.getBalance().compareTo(request.getAmount()) < 0) {
            throw new ApiException("Insufficient balance", HttpStatus.BAD_REQUEST);
        }

        senderWallet.setBalance(senderWallet.getBalance().subtract(request.getAmount()));
        receiverWallet.setBalance(receiverWallet.getBalance().add(request.getAmount()));
        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        Transaction txn = new Transaction();
        txn.setReferenceId(generateReference());
        txn.setSender(sender);
        txn.setReceiver(receiver);
        txn.setAmount(request.getAmount());
        txn.setType(Transaction.TransactionType.TRANSFER);
        txn.setStatus(Transaction.TransactionStatus.SUCCESS);
        txn.setDescription(request.getDescription() != null ? request.getDescription() : "Wallet transfer");

        return transactionRepository.save(txn);
    }

    public List<Transaction> getHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        return transactionRepository.findBySenderIdOrReceiverIdOrderByCreatedAtDesc(user.getId(), user.getId());
    }

    private String generateReference() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }
}