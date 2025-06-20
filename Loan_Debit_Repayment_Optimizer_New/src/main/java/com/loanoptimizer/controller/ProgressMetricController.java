package com.loanoptimizer.controller;

import com.loanoptimizer.dto.ProgressMetricResponse;
import com.loanoptimizer.service.ProgressMetricService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/progress-metrics")
public class ProgressMetricController {
    private final ProgressMetricService progressMetricService;

    @Autowired
    public ProgressMetricController(ProgressMetricService progressMetricService) {
        this.progressMetricService = progressMetricService;
    }

    @GetMapping
    public ResponseEntity<List<ProgressMetricResponse>> getMetrics(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        List<ProgressMetricResponse> metrics = progressMetricService.getMetrics(type, from, to);
        return ResponseEntity.ok(metrics);
    }
} 