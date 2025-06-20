package com.loanoptimizer.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.loanoptimizer.domain.ProgressMetric;

public class ProgressMetricResponse {
    private Long id;
    private String metricType;
    private BigDecimal value;
    private LocalDateTime recordedAt;
    private String notes;

    public static ProgressMetricResponse fromEntity(ProgressMetric metric) {
        ProgressMetricResponse resp = new ProgressMetricResponse();
        resp.id = metric.getId();
        resp.metricType = metric.getMetricType();
        resp.value = metric.getValue();
        resp.recordedAt = metric.getRecordedAt();
        resp.notes = metric.getNotes();
        return resp;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMetricType() { return metricType; }
    public void setMetricType(String metricType) { this.metricType = metricType; }
    public BigDecimal getValue() { return value; }
    public void setValue(BigDecimal value) { this.value = value; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
} 