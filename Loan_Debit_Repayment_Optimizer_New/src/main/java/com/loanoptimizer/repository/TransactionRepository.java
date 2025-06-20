package com.loanoptimizer.repository;

import com.loanoptimizer.domain.Transaction;
import com.loanoptimizer.domain.User;
import com.loanoptimizer.domain.Debt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);
    List<Transaction> findByUserAndDebt(User user, Debt debt);
    List<Transaction> findByUserAndTransactionDateBetween(User user, LocalDate from, LocalDate to);
} 