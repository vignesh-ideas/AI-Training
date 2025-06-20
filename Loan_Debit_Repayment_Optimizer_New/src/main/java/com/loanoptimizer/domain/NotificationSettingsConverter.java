package com.loanoptimizer.domain;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = false)
public class NotificationSettingsConverter implements AttributeConverter<String, String> {
    @Override
    public String convertToDatabaseColumn(String attribute) {
        // Always ensure valid JSON string for PostgreSQL jsonb
        return (attribute == null || attribute.isBlank()) ? "{}" : attribute;
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        return (dbData == null || dbData.isBlank()) ? "{}" : dbData;
    }
} 