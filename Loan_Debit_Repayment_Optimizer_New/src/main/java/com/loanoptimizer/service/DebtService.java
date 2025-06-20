package com.loanoptimizer.service;

import com.loanoptimizer.domain.Debt;
import com.loanoptimizer.domain.User;
import com.loanoptimizer.dto.DebtRequest;
import com.loanoptimizer.dto.DebtResponse;
import com.loanoptimizer.repository.DebtRepository;
import com.loanoptimizer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DebtService {
    private final DebtRepository debtRepository;
    private final UserRepository userRepository;

    @Autowired
    public DebtService(DebtRepository debtRepository, UserRepository userRepository) {
        this.debtRepository = debtRepository;
        this.userRepository = userRepository;
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
    public DebtResponse createDebt(DebtRequest request) {
        User user = getCurrentUser();
        Debt debt = toDebt(request);
        debt.setUser(user);
        Debt saved = debtRepository.save(debt);
        return toDebtResponse(saved);
    }

    public List<DebtResponse> listDebts(Optional<String> status) {
        User user = getCurrentUser();
        List<Debt> debts = status.isPresent()
                ? debtRepository.findByUserAndStatus(user, status.get())
                : debtRepository.findByUser(user);
        return debts.stream().map(this::toDebtResponse).collect(Collectors.toList());
    }

    public DebtResponse getDebt(Long id) {
        User user = getCurrentUser();
        Debt debt = debtRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Debt not found or forbidden"));
        return toDebtResponse(debt);
    }

    @Transactional
    public DebtResponse updateDebt(Long id, DebtRequest request) {
        User user = getCurrentUser();
        Debt debt = debtRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Debt not found or forbidden"));
        updateDebtFromRequest(debt, request);
        Debt saved = debtRepository.save(debt);
        return toDebtResponse(saved);
    }

    @Transactional
    public void deleteDebt(Long id) {
        User user = getCurrentUser();
        Debt debt = debtRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Debt not found or forbidden"));
        debtRepository.delete(debt);
    }

    private Debt toDebt(DebtRequest req) {
        Debt d = new Debt();
        d.setType(req.getType());
        d.setLenderName(req.getLenderName());
        d.setLenderContact(req.getLenderContact());
        d.setBalance(req.getBalance());
        d.setApr(req.getApr());
        d.setMinPayment(req.getMinPayment());
        d.setDueDate(req.getDueDate());
        d.setLoanTermMonths(req.getLoanTermMonths());
        d.setSecured(req.getSecured() != null ? req.getSecured() : false);
        d.setStatus(req.getStatus() != null ? req.getStatus() : "active");
        return d;
    }

    private void updateDebtFromRequest(Debt d, DebtRequest req) {
        if (req.getType() != null) d.setType(req.getType());
        if (req.getLenderName() != null) d.setLenderName(req.getLenderName());
        if (req.getLenderContact() != null) d.setLenderContact(req.getLenderContact());
        if (req.getBalance() != null) d.setBalance(req.getBalance());
        if (req.getApr() != null) d.setApr(req.getApr());
        if (req.getMinPayment() != null) d.setMinPayment(req.getMinPayment());
        if (req.getDueDate() != null) d.setDueDate(req.getDueDate());
        if (req.getLoanTermMonths() != null) d.setLoanTermMonths(req.getLoanTermMonths());
        if (req.getSecured() != null) d.setSecured(req.getSecured());
        if (req.getStatus() != null) d.setStatus(req.getStatus());
    }

    private DebtResponse toDebtResponse(Debt d) {
        DebtResponse resp = new DebtResponse();
        resp.setId(d.getId());
        resp.setType(d.getType());
        resp.setLenderName(d.getLenderName());
        resp.setLenderContact(d.getLenderContact());
        resp.setBalance(d.getBalance());
        resp.setApr(d.getApr());
        resp.setMinPayment(d.getMinPayment());
        resp.setDueDate(d.getDueDate());
        resp.setLoanTermMonths(d.getLoanTermMonths());
        resp.setSecured(d.getSecured());
        resp.setStatus(d.getStatus());
        return resp;
    }
} 