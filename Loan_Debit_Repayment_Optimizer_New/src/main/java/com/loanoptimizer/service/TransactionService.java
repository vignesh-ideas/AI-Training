package com.loanoptimizer.service;

import com.loanoptimizer.domain.Transaction;
import com.loanoptimizer.domain.User;
import com.loanoptimizer.domain.Debt;
import com.loanoptimizer.dto.TransactionRequest;
import com.loanoptimizer.dto.TransactionResponse;
import com.loanoptimizer.repository.TransactionRepository;
import com.loanoptimizer.repository.UserRepository;
import com.loanoptimizer.repository.DebtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final DebtRepository debtRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository, DebtRepository debtRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.debtRepository = debtRepository;
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = (principal instanceof UserDetails)
                ? ((UserDetails) principal).getUsername()
                : principal.toString();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        User user = getCurrentUser();
        Debt debt = debtRepository.findById(request.getDebtId())
                .orElseThrow(() -> new IllegalArgumentException("Debt not found"));
        if (!debt.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Forbidden: Not your debt");
        }
        Transaction tx = new Transaction();
        tx.setUser(user);
        tx.setDebt(debt);
        tx.setTransactionDate(request.getTransactionDate());
        tx.setAmount(request.getAmount());
        tx.setTransactionType(request.getTransactionType());
        tx.setDescription(request.getDescription());
        tx.setStatus("pending");
        Transaction saved = transactionRepository.save(tx);
        return toResponse(saved);
    }

    public List<TransactionResponse> listTransactions(Optional<Long> debtId, Optional<LocalDate> fromDate, Optional<LocalDate> toDate) {
        User user = getCurrentUser();
        List<Transaction> txs;
        if (debtId.isPresent()) {
            Debt debt = debtRepository.findById(debtId.get())
                    .orElseThrow(() -> new IllegalArgumentException("Debt not found"));
            if (!debt.getUser().getId().equals(user.getId())) {
                throw new IllegalArgumentException("Forbidden: Not your debt");
            }
            txs = transactionRepository.findByUserAndDebt(user, debt);
        } else if (fromDate.isPresent() && toDate.isPresent()) {
            txs = transactionRepository.findByUserAndTransactionDateBetween(user, fromDate.get(), toDate.get());
        } else {
            txs = transactionRepository.findByUser(user);
        }
        return txs.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private TransactionResponse toResponse(Transaction t) {
        TransactionResponse resp = new TransactionResponse();
        resp.setId(t.getId());
        resp.setDebtId(t.getDebt().getId());
        resp.setTransactionDate(t.getTransactionDate());
        resp.setAmount(t.getAmount());
        resp.setTransactionType(t.getTransactionType());
        resp.setDescription(t.getDescription());
        resp.setStatus(t.getStatus());
        return resp;
    }
} 