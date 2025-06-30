package com.util;

import java.util.regex.Pattern;

public class SecurityUtil {
    
    // Patterns for input validation
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    private static final Pattern NAME_PATTERN = Pattern.compile("^[a-zA-Z\\s]{2,100}$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\d{10,15}$");
    private static final Pattern CANDIDATE_PATTERN = Pattern.compile("^[a-zA-Z0-9_-]{1,50}$");
    
    // HTML and script injection patterns
    private static final Pattern HTML_PATTERN = Pattern.compile("<[^>]*>", Pattern.CASE_INSENSITIVE);
    private static final Pattern SCRIPT_PATTERN = Pattern.compile("<script[^>]*>.*?</script>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
    private static final Pattern SQL_PATTERN = Pattern.compile("(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)", Pattern.CASE_INSENSITIVE);
    
    /**
     * Sanitize input to prevent XSS attacks
     */
    public static String sanitizeInput(String input) {
        if (input == null) return null;
        
        // Remove HTML tags
        input = HTML_PATTERN.matcher(input).replaceAll("");
        
        // Remove script tags
        input = SCRIPT_PATTERN.matcher(input).replaceAll("");
        
        // Escape special characters
        input = input.replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                    .replace("\"", "&quot;")
                    .replace("'", "&#x27;");
        
        return input.trim();
    }
    
    /**
     * Validate email format
     */
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
    
    /**
     * Validate name format
     */
    public static boolean isValidName(String name) {
        return name != null && NAME_PATTERN.matcher(name).matches();
    }
    
    /**
     * Validate phone number format
     */
    public static boolean isValidPhone(String phone) {
        return phone != null && PHONE_PATTERN.matcher(phone).matches();
    }
    
    /**
     * Validate candidate name format
     */
    public static boolean isValidCandidate(String candidate) {
        return candidate != null && CANDIDATE_PATTERN.matcher(candidate).matches();
    }
    
    /**
     * Check for SQL injection attempts
     */
    public static boolean containsSqlInjection(String input) {
        return input != null && SQL_PATTERN.matcher(input).find();
    }
    
    /**
     * Validate password strength
     */
    public static boolean isStrongPassword(String password) {
        if (password == null || password.length() < 8) return false;
        
        boolean hasDigit = password.matches(".*\\d.*");
        boolean hasLower = password.matches(".*[a-z].*");
        boolean hasUpper = password.matches(".*[A-Z].*");
        boolean hasSpecial = password.matches(".*[@#$%^&+=!].*");
        
        return hasDigit && hasLower && hasUpper && hasSpecial;
    }
} 