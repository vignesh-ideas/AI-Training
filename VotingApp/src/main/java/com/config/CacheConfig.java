package com.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.github.benmanes.caffeine.cache.Caffeine;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    // Primary Cache (L1) - Fast, in-memory cache
    @Bean
    @Primary
    public CacheManager primaryCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(60, TimeUnit.SECONDS)
                .expireAfterAccess(30, TimeUnit.SECONDS)
                .recordStats());
        return cacheManager;
    }

    // Secondary Cache (L2) - Slower but larger cache
    @Bean("secondaryCacheManager")
    public CacheManager secondaryCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(5000)
                .expireAfterWrite(300, TimeUnit.SECONDS)
                .expireAfterAccess(180, TimeUnit.SECONDS)
                .recordStats());
        return cacheManager;
    }

    // User-specific cache
    @Bean("userCacheManager")
    public CacheManager userCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(2000)
                .expireAfterWrite(120, TimeUnit.SECONDS)
                .recordStats());
        return cacheManager;
    }

    // Candidate-specific cache
    @Bean("candidateCacheManager")
    public CacheManager candidateCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(100)
                .expireAfterWrite(30, TimeUnit.SECONDS)
                .recordStats());
        return cacheManager;
    }

    // Analytics cache for heavy computations
    @Bean("analyticsCacheManager")
    public CacheManager analyticsCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(100)
                .expireAfterWrite(600, TimeUnit.SECONDS)
                .recordStats());
        return cacheManager;
    }
} 