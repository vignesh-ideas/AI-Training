package com.loanoptimizer.controller;

import com.loanoptimizer.dto.PaymentScheduleResponse;
import com.loanoptimizer.service.PaymentScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repayment-plans/{planId}/payment-schedules")
@Validated
public class PaymentScheduleController {
    private final PaymentScheduleService scheduleService;

    @Autowired
    public PaymentScheduleController(PaymentScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping
    public ResponseEntity<List<PaymentScheduleResponse>> getSchedules(@PathVariable Long planId) {
        List<PaymentScheduleResponse> schedules = scheduleService.getSchedulesForPlan(planId);
        return ResponseEntity.ok(schedules);
    }
} 