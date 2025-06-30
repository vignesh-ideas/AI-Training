package com.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final ConcurrentHashMap<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> lastRequestTime = new ConcurrentHashMap<>();

    @Bean
    public OncePerRequestFilter rateLimitingFilter() {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request, 
                                          HttpServletResponse response, 
                                          FilterChain filterChain) 
                    throws ServletException, IOException {
                
                String clientIp = getClientIpAddress(request);
                String key = clientIp + ":" + request.getRequestURI();
                
                // Rate limiting: max 100 requests per minute per IP
                long currentTime = System.currentTimeMillis();
                AtomicInteger count = requestCounts.computeIfAbsent(key, k -> new AtomicInteger(0));
                Long lastTime = lastRequestTime.get(key);
                
                if (lastTime != null && currentTime - lastTime > 60000) {
                    // Reset counter after 1 minute
                    count.set(0);
                }
                
                if (count.incrementAndGet() > 100) {
                    response.setStatus(429); // Too Many Requests
                    response.getWriter().write("Rate limit exceeded. Please try again later.");
                    return;
                }
                
                lastRequestTime.put(key, currentTime);
                
                // Brute force protection for login attempts
                if (request.getRequestURI().equals("/dologin")) {
                    HttpSession session = request.getSession(false);
                    if (session != null) {
                        Integer loginAttempts = (Integer) session.getAttribute("loginAttempts");
                        if (loginAttempts == null) {
                            loginAttempts = 0;
                        }
                        
                        if (loginAttempts >= 5) {
                            long lockoutTime = (Long) session.getAttribute("lockoutTime");
                            if (lockoutTime == 0) {
                                lockoutTime = System.currentTimeMillis();
                                session.setAttribute("lockoutTime", lockoutTime);
                            }
                            
                            if (System.currentTimeMillis() - lockoutTime < 300000) { // 5 minutes
                                response.setStatus(429);
                                response.getWriter().write("Account temporarily locked due to too many failed attempts.");
                                return;
                            } else {
                                // Reset after lockout period
                                session.setAttribute("loginAttempts", 0);
                                session.setAttribute("lockoutTime", 0L);
                            }
                        }
                    }
                }
                
                filterChain.doFilter(request, response);
            }
            
            private String getClientIpAddress(HttpServletRequest request) {
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
                    return xForwardedFor.split(",")[0];
                }
                String xRealIp = request.getHeader("X-Real-IP");
                if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
                    return xRealIp;
                }
                return request.getRemoteAddr();
            }
        };
    }
} 