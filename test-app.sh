#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Twitter-Like Auth App - Test Suite${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Configuration
BACKEND_URL="http://localhost:5001/api/v1"
FRONTEND_URL="http://localhost:3000"
TEST_EMAIL="testuser$(date +%s)@example.com"
TEST_USERNAME="testuser$(date +%s)"
TEST_PASSWORD="SecurePass123!"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_endpoint() {
    local test_name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=$5
    
    echo -e "${YELLOW}Testing: ${test_name}${NC}"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BACKEND_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BACKEND_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" == "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} - Status: $status_code"
        echo "Response: $body" | jq . 2>/dev/null || echo "Response: $body"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} - Expected: $expected_status, Got: $status_code"
        echo "Response: $body"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# ==========================================
# PHASE 1: HEALTH CHECKS
# ==========================================
echo -e "${BLUE}[PHASE 1] Health Checks${NC}\n"

# Test backend health
echo -e "${YELLOW}Checking backend health...${NC}"
backend_health=$(curl -s http://localhost:5001/api/v1/health 2>&1)
if echo "$backend_health" | grep -q 'status'; then
    echo -e "${GREEN}✓ Backend is running${NC}"
    echo "Response: $backend_health" | jq . 2>/dev/null || echo "Response: $backend_health"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ Backend is NOT responding${NC}"
    echo "Response: $backend_health"
    ((TESTS_FAILED++))
    exit 1
fi

# Test frontend health
echo -e "${YELLOW}Checking frontend HTML...${NC}"
frontend_health=$(curl -s -I http://localhost:3000 | grep "200\|301\|302")
if [ ! -z "$frontend_health" ]; then
    echo -e "${GREEN}✓ Frontend is running${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ Frontend is NOT responding${NC}"
    ((TESTS_FAILED++))
fi
echo ""

# ==========================================
# PHASE 2: INPUT/OUTPUT VALIDATION
# ==========================================
echo -e "${BLUE}[PHASE 2] Input/Output Validation${NC}\n"

# Test 1: Signup with valid data
echo -e "${YELLOW}Test 1: Valid Signup${NC}"
SIGNUP_PAYLOAD=$(cat <<EOF
{
  "email": "$TEST_EMAIL",
  "username": "$TEST_USERNAME",
  "password": "$TEST_PASSWORD",
  "firstName": "John",
  "lastName": "Doe"
}
EOF
)
test_endpoint "Valid Signup" "POST" "/auth/signup" "$SIGNUP_PAYLOAD" "201"

# Extract tokens from signup
SIGNUP_RESPONSE=$(curl -s -X POST "$BACKEND_URL/auth/signup" \
    -H "Content-Type: application/json" \
    -d "$SIGNUP_PAYLOAD")

ACCESS_TOKEN=$(echo "$SIGNUP_RESPONSE" | jq -r '.data.tokens.accessToken // empty' 2>/dev/null)
REFRESH_TOKEN=$(echo "$SIGNUP_RESPONSE" | jq -r '.data.tokens.refreshToken // empty' 2>/dev/null)

if [ ! -z "$ACCESS_TOKEN" ]; then
    echo -e "${GREEN}✓ Tokens extracted successfully${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠ Tokens not available (using login response tokens)${NC}"
    # Try to extract from the test_endpoint response instead
fi
echo ""

# Test 2: Signup with duplicate email (should fail)
echo -e "${YELLOW}Test 2: Duplicate Email (Error Handling)${NC}"
test_endpoint "Duplicate Email" "POST" "/auth/signup" "$SIGNUP_PAYLOAD" "409"

# Test 3: Signup with invalid email format
echo -e "${YELLOW}Test 3: Invalid Email Format${NC}"
INVALID_EMAIL_PAYLOAD=$(cat <<EOF
{
  "email": "invalid-email",
  "username": "testuser999",
  "password": "$TEST_PASSWORD"
}
EOF
)
test_endpoint "Invalid Email Format" "POST" "/auth/signup" "$INVALID_EMAIL_PAYLOAD" "400"

# Test 4: Signup with weak password
echo -e "${YELLOW}Test 4: Weak Password (Missing Uppercase)${NC}"
WEAK_PASSWORD_PAYLOAD=$(cat <<EOF
{
  "email": "weakpass@example.com",
  "username": "weakuser123",
  "password": "weakpass123!"
}
EOF
)
test_endpoint "Weak Password" "POST" "/auth/signup" "$WEAK_PASSWORD_PAYLOAD" "400"

# Test 5: Login with valid credentials
echo -e "${YELLOW}Test 5: Valid Login${NC}"
LOGIN_PAYLOAD=$(cat <<EOF
{
  "email": "$TEST_EMAIL",
  "password": "$TEST_PASSWORD"
}
EOF
)

LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "$LOGIN_PAYLOAD")

LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | jq -r '.success' 2>/dev/null)
if [ "$LOGIN_STATUS" == "true" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: 200"
    # Extract tokens from login
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.tokens.accessToken // empty' 2>/dev/null)
    REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.tokens.refreshToken // empty' 2>/dev/null)
    echo "Tokens extracted for protected endpoint tests"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((TESTS_FAILED++))
fi
echo ""

# Test 6: Login with invalid password
echo -e "${YELLOW}Test 6: Invalid Password (Error Handling)${NC}"
INVALID_LOGIN_PAYLOAD=$(cat <<EOF
{
  "email": "$TEST_EMAIL",
  "password": "WrongPassword123!"
}
EOF
)
test_endpoint "Invalid Password" "POST" "/auth/login" "$INVALID_LOGIN_PAYLOAD" "401"

# Test 7: Login with non-existent user
echo -e "${YELLOW}Test 7: Non-existent User${NC}"
NONEXIST_LOGIN_PAYLOAD=$(cat <<EOF
{
  "email": "nonexistent@example.com",
  "password": "$TEST_PASSWORD"
}
EOF
)
test_endpoint "Non-existent User" "POST" "/auth/login" "$NONEXIST_LOGIN_PAYLOAD" "401"

echo ""

# ==========================================
# PHASE 3: PROTECTED ENDPOINTS
# ==========================================
echo -e "${BLUE}[PHASE 3] Protected Endpoints (JWT Validation)${NC}\n"

if [ ! -z "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
    # Test 8: Get profile with valid token
    echo -e "${YELLOW}Test 8: Get Profile (Valid Token)${NC}"
    PROFILE_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BACKEND_URL/auth/profile" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    PROFILE_STATUS=$(echo "$PROFILE_RESPONSE" | tail -n1)
    PROFILE_BODY=$(echo "$PROFILE_RESPONSE" | sed '$d')
    
    if [ "$PROFILE_STATUS" == "200" ]; then
        echo -e "${GREEN}✓ PASS${NC} - Status: $PROFILE_STATUS"
        echo "$PROFILE_BODY" | jq . 2>/dev/null || echo "$PROFILE_BODY"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} - Expected: 200, Got: $PROFILE_STATUS"
        ((TESTS_FAILED++))
    fi
    echo ""
    
    # Test 9: Get profile without token
    echo -e "${YELLOW}Test 9: Get Profile (Missing Token)${NC}"
    test_endpoint "Missing Authorization Header" "GET" "/auth/profile" "" "401"
    
    # Test 10: Refresh token
    echo -e "${YELLOW}Test 10: Token Refresh${NC}"
    REFRESH_PAYLOAD=$(cat <<EOF
{
  "refreshToken": "$REFRESH_TOKEN"
}
EOF
)
    REFRESH_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/auth/refresh" \
        -H "Content-Type: application/json" \
        -d "$REFRESH_PAYLOAD")
    
    REFRESH_STATUS=$(echo "$REFRESH_RESPONSE" | tail -n1)
    REFRESH_BODY=$(echo "$REFRESH_RESPONSE" | sed '$d')
    
    if [ "$REFRESH_STATUS" == "200" ]; then
        echo -e "${GREEN}✓ PASS${NC} - New tokens generated"
        echo "$REFRESH_BODY" | jq .data.tokens 2>/dev/null | head -3
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((TESTS_FAILED++))
    fi
    echo ""
else
    echo -e "${RED}⚠ Skipping protected endpoint tests (no valid token)${NC}\n"
fi

# ==========================================
# PHASE 4: ERROR HANDLING & EDGE CASES
# ==========================================
echo -e "${BLUE}[PHASE 4] Error Handling & Edge Cases${NC}\n"

# Test 11: Empty payload
echo -e "${YELLOW}Test 11: Empty Payload (400 - Missing Fields)${NC}"
test_endpoint "Empty Signup" "POST" "/auth/signup" "{}" "400"

# Test 12: Missing required field
echo -e "${YELLOW}Test 12: Missing Email${NC}"
MISSING_EMAIL_PAYLOAD=$(cat <<EOF
{
  "username": "noemail123",
  "password": "$TEST_PASSWORD"
}
EOF
)
test_endpoint "Missing Email Field" "POST" "/auth/signup" "$MISSING_EMAIL_PAYLOAD" "400"

# Test 13: Username too short
echo -e "${YELLOW}Test 13: Username Too Short${NC}"
SHORT_USERNAME_PAYLOAD=$(cat <<EOF
{
  "email": "short@example.com",
  "username": "ab",
  "password": "$TEST_PASSWORD"
}
EOF
)
test_endpoint "Short Username" "POST" "/auth/signup" "$SHORT_USERNAME_PAYLOAD" "400"

echo ""

# ==========================================
# SUMMARY
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"

TOTAL=$((TESTS_PASSED + TESTS_FAILED))
PASS_RATE=$((TESTS_PASSED * 100 / TOTAL))

echo -e "Pass Rate: ${PASS_RATE}% ($TESTS_PASSED/$TOTAL)"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
