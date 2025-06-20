package com.loanoptimizer.controller;

import com.loanoptimizer.dto.DebtRequest;
import com.loanoptimizer.dto.DebtResponse;
import com.loanoptimizer.service.DebtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/debts")
@Validated
public class DebtController {
    private final DebtService debtService;

    @Autowired
    public DebtController(DebtService debtService) {
        this.debtService = debtService;
    }

    @PostMapping
    public ResponseEntity<DebtResponse> createDebt(@Valid @RequestBody DebtRequest request) {
        DebtResponse resp = debtService.createDebt(request);
        return new ResponseEntity<>(resp, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DebtResponse>> listDebts(@RequestParam(value = "status", required = false) String status) {
        List<DebtResponse> debts = debtService.listDebts(Optional.ofNullable(status));
        return ResponseEntity.ok(debts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DebtResponse> getDebt(@PathVariable Long id) {
        DebtResponse resp = debtService.getDebt(id);
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DebtResponse> updateDebt(@PathVariable Long id, @Valid @RequestBody DebtRequest request) {
        DebtResponse resp = debtService.updateDebt(id, request);
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDebt(@PathVariable Long id) {
        debtService.deleteDebt(id);
        return ResponseEntity.noContent().build();
    }
} 