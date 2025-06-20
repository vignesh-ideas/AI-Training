package com.loanoptimizer.repository;

import com.loanoptimizer.domain.Debt;
import com.loanoptimizer.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DebtRepository extends JpaRepository<Debt, Long> {
    List<Debt> findByUser(User user);
    List<Debt> findByUserAndStatus(User user, String status);
    Optional<Debt> findByIdAndUser(Long id, User user);
} 