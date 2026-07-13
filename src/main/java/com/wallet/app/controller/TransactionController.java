package com.wallet.app.controller;

import com.wallet.app.dto.DepositRequest;
import com.wallet.app.dto.TransactionResponse;
import com.wallet.app.dto.TransferRequest;
import com.wallet.app.entity.Transaction;
import com.wallet.app.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(Authentication authentication,
                                                         @Valid @RequestBody DepositRequest request) {
        Transaction txn = transactionService.deposit(authentication.getName(), request);
        return ResponseEntity.ok(new TransactionResponse(txn));
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(Authentication authentication,
                                                          @Valid @RequestBody TransferRequest request) {
        Transaction txn = transactionService.transfer(authentication.getName(), request);
        return ResponseEntity.ok(new TransactionResponse(txn));
    }

    @GetMapping("/history")
    public ResponseEntity<List<TransactionResponse>> history(Authentication authentication) {
        List<Transaction> txns = transactionService.getHistory(authentication.getName());
        List<TransactionResponse> response = txns.stream()
                .map(TransactionResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}