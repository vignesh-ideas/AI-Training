#!/bin/bash

# Performance Test Script for Voting App
# This script tests the performance of various endpoints

BASE_URL="http://localhost:8080"
ADMIN_CREDENTIALS="admin:admin"

echo "=== Voting App Performance Test ==="
echo "Base URL: $BASE_URL"
echo "Date: $(date)"
echo ""

# Function to measure response time
measure_response_time() {
    local endpoint=$1
    local description=$2
    local method=${3:-GET}
    local data=${4:-""}
    
    echo "Testing: $description"
    echo "Endpoint: $method $endpoint"
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response_time=$(curl -s -w "%{time_total}" -o /dev/null -X POST \
            -H "Content-Type: application/x-www-form-urlencoded" \
            -d "$data" \
            "$BASE_URL$endpoint")
    else
        response_time=$(curl -s -w "%{time_total}" -o /dev/null "$BASE_URL$endpoint")
    fi
    
    echo "Response Time: ${response_time}s"
    echo "---"
}

# Test public endpoints
echo "1. Testing Public Endpoints"
measure_response_time "/" "Home Page"
measure_response_time "/signin" "Sign In Page"
measure_response_time "/register" "Register Page"
measure_response_time "/about" "About Page"

echo ""

# Test admin endpoints (with authentication)
echo "2. Testing Admin Endpoints"
measure_response_time "/admin" "Admin Dashboard" "GET" "" "$ADMIN_CREDENTIALS"
measure_response_time "/admin/users?page=0&size=10" "Admin Users Page" "GET" "" "$ADMIN_CREDENTIALS"
measure_response_time "/admin/candidates?page=0&size=10" "Admin Candidates Page" "GET" "" "$ADMIN_CREDENTIALS"

echo ""

# Test user registration
echo "3. Testing User Registration"
measure_response_time "/createuser" "User Registration" "POST" "name=TestUser&email=test@example.com&password=password&phone=1234567890"

echo ""

# Test voting endpoint (requires user authentication)
echo "4. Testing Voting Endpoint"
measure_response_time "/addcandidate" "Voting" "POST" "candidate=candidate1"

echo ""

# Test performance monitoring endpoints
echo "5. Testing Monitoring Endpoints"
measure_response_time "/actuator/health" "Health Check"
measure_response_time "/actuator/metrics" "Metrics"
measure_response_time "/actuator/prometheus" "Prometheus Metrics"

echo ""
echo "=== Performance Test Complete ==="
echo "Check the response times above to identify slow endpoints."
echo "For detailed analysis, use tools like Apache JMeter or Gatling." 