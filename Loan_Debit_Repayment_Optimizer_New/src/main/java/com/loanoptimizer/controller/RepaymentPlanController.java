package com.loanoptimizer.controller;

import com.loanoptimizer.dto.RepaymentPlanRequest;
import com.loanoptimizer.dto.RepaymentPlanResponse;
import com.loanoptimizer.service.RepaymentPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/repayment-plans")
@Validated
public class RepaymentPlanController {
    private final RepaymentPlanService planService;

    @Autowired
    public RepaymentPlanController(RepaymentPlanService planService) {
        this.planService = planService;
    }

    @PostMapping
    public ResponseEntity<RepaymentPlanResponse> createPlan(@Valid @RequestBody RepaymentPlanRequest request) {
        RepaymentPlanResponse resp = planService.createPlan(request);
        return new ResponseEntity<>(resp, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RepaymentPlanResponse>> listPlans(@RequestParam(value = "status", required = false) String status) {
        List<RepaymentPlanResponse> plans = planService.listPlans(Optional.ofNullable(status));
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RepaymentPlanResponse> getPlan(@PathVariable Long id) {
        RepaymentPlanResponse resp = planService.getPlan(id);
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RepaymentPlanResponse> updatePlan(@PathVariable Long id, @Valid @RequestBody RepaymentPlanRequest request) {
        RepaymentPlanResponse resp = planService.updatePlan(id, request);
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }
} 