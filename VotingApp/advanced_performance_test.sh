#!/bin/bash

# Advanced Performance Test Script for Voting App
# Tests all optimizations: caching, async, multi-threading, etc.

BASE_URL="http://localhost:8080"
ADMIN_CREDENTIALS="admin:admin"
TEST_USER_EMAIL="test@example.com"
TEST_USER_PASSWORD="password"

echo "=== Advanced Performance Test for Voting App ==="
echo "Base URL: $BASE_URL"
echo "Date: $(date)"
echo ""

# Function to measure response time with detailed output
measure_response_time() {
    local endpoint=$1
    local description=$2
    local method=${3:-GET}
    local data=${4:-""}
    local auth=${5:-""}
    
    echo "Testing: $description"
    echo "Endpoint: $method $endpoint"
    
    local curl_opts="-s -w \"%{time_total},%{http_code},%{size_download}\" -o /dev/null"
    
    if [ -n "$auth" ]; then
        curl_opts="$curl_opts -u $auth"
    fi
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl $curl_opts -X POST \
            -H "Content-Type: application/x-www-form-urlencoded" \
            -d "$data" \
            "$BASE_URL$endpoint")
    else
        response=$(curl $curl_opts "$BASE_URL$endpoint")
    fi
    
    # Parse response
    IFS=',' read -r time_total http_code size_download <<< "$response"
    
    echo "Response Time: ${time_total}s"
    echo "HTTP Code: $http_code"
    echo "Response Size: ${size_download} bytes"
    echo "---"
}

# Function to test cache performance
test_cache_performance() {
    echo "1. Testing Cache Performance"
    echo "First request (cache miss):"
    measure_response_time "/admin" "Admin Dashboard (Cache Miss)" "GET" "" "$ADMIN_CREDENTIALS"
    
    echo "Second request (cache hit):"
    measure_response_time "/admin" "Admin Dashboard (Cache Hit)" "GET" "" "$ADMIN_CREDENTIALS"
    
    echo "Third request (cache hit):"
    measure_response_time "/admin" "Admin Dashboard (Cache Hit)" "GET" "" "$ADMIN_CREDENTIALS"
    echo ""
}

# Function to test async endpoints
test_async_endpoints() {
    echo "2. Testing Async Endpoints"
    measure_response_time "/admin/analytics" "Async Analytics" "GET" "" "$ADMIN_CREDENTIALS"
    measure_response_time "/admin/metrics" "Async Performance Metrics" "GET" "" "$ADMIN_CREDENTIALS"
    measure_response_time "/candidate/statistics" "Async Vote Statistics" "GET"
    measure_response_time "/candidate/votes" "Async Vote Counts" "GET"
    echo ""
}

# Function to test pagination performance
test_pagination_performance() {
    echo "3. Testing Pagination Performance"
    measure_response_time "/admin/users?page=0&size=10" "Users Page 1" "GET" "" "$ADMIN_CREDENTIALS"
    measure_response_time "/admin/users?page=1&size=10" "Users Page 2" "GET" "" "$ADMIN_CREDENTIALS"
    measure_response_time "/admin/candidates?page=0&size=5" "Candidates Page 1" "GET" "" "$ADMIN_CREDENTIALS"
    echo ""
}

# Function to test concurrent voting
test_concurrent_voting() {
    echo "4. Testing Concurrent Voting Performance"
    
    # Test multiple voting requests
    for i in {1..5}; do
        echo "Voting request $i:"
        measure_response_time "/addcandidate" "Voting Request $i" "POST" "candidate=candidate1"
    done
    echo ""
}

# Function to test database query performance
test_database_performance() {
    echo "5. Testing Database Query Performance"
    measure_response_time "/admin" "Dashboard with DB Queries" "GET" "" "$ADMIN_CREDENTIALS"
    measure_response_time "/user" "User Dashboard" "GET" "" "$ADMIN_CREDENTIALS"
    echo ""
}

# Function to test monitoring endpoints
test_monitoring_endpoints() {
    echo "6. Testing Monitoring Endpoints"
    measure_response_time "/actuator/health" "Health Check"
    measure_response_time "/actuator/metrics" "Metrics"
    measure_response_time "/actuator/prometheus" "Prometheus Metrics"
    measure_response_time "/actuator/caches" "Cache Statistics"
    echo ""
}

# Function to test load with multiple concurrent requests
test_concurrent_load() {
    echo "7. Testing Concurrent Load (10 requests)"
    
    for i in {1..10}; do
        (
            response_time=$(curl -s -w "%{time_total}" -o /dev/null "$BASE_URL/")
            echo "Request $i: ${response_time}s"
        ) &
    done
    wait
    echo ""
}

# Function to test memory and connection pool
test_system_resources() {
    echo "8. Testing System Resource Usage"
    
    # Test multiple admin dashboard requests to stress the system
    echo "Stress testing admin dashboard (20 requests):"
    for i in {1..20}; do
        (
            curl -s -o /dev/null "$BASE_URL/admin" -u "$ADMIN_CREDENTIALS"
        ) &
    done
    wait
    echo "Stress test completed"
    echo ""
}

# Main test execution
main() {
    test_cache_performance
    test_async_endpoints
    test_pagination_performance
    test_concurrent_voting
    test_database_performance
    test_monitoring_endpoints
    test_concurrent_load
    test_system_resources
    
    echo "=== Performance Test Summary ==="
    echo "All tests completed. Check the response times above."
    echo "Key metrics to monitor:"
    echo "- Cache hit rates (should improve on subsequent requests)"
    echo "- Async endpoint response times (should be fast)"
    echo "- Concurrent request handling"
    echo "- Database query performance"
    echo ""
    echo "For detailed analysis, check:"
    echo "- /actuator/metrics for application metrics"
    echo "- /actuator/caches for cache statistics"
    echo "- Database slow query log"
    echo "- Application logs for performance insights"
}

# Run the tests
main 