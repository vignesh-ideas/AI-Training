# REST API Specification: Loan/Debt Repayment Optimizer

This document defines the REST API endpoints for the backend, following best practices for Spring Boot and Spring Data JPA.

---

## 1. Users Module

### Create User
- **Endpoint:** `POST /api/users`
- **Description:** Register a new user.
- **Authentication/Authorization:** None
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "name": "string", // required
    "email": "string", // required
    "phone": "string", // optional
    "password": "string" // required
  }
  ```
- **Success Response:**
  - `201 Created`
  - Example:
    ```json
    { "id": 1, "name": "Amit", "email": "amit@email.com" }
    ```
- **Error Responses:**
  - `400 Bad Request` (validation error)
  - `409 Conflict` (email already exists)
- **Security Notes:** Input validation, password hashing, rate limiting on registration.

### Get User Profile
- **Endpoint:** `GET /api/users/me`
- **Description:** Get the authenticated user's profile.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`
- **Success Response:**
  - `200 OK`
  - Example:
    ```json
    { "id": 1, "name": "Amit", "email": "amit@email.com", "phone": "...", "income": 100000, ... }
    ```
- **Error Responses:**
  - `401 Unauthorized`
- **Security Notes:** JWT validation.

### Update User Profile
- **Endpoint:** `PUT /api/users/me`
- **Description:** Update the authenticated user's profile.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "name": "string", // optional
    "phone": "string", // optional
    "income": 100000, // optional
    "budget": 50000, // optional
    "emergency_fund": 20000, // optional
    "strategy_pref": "string" // optional
  }
  ```
- **Success Response:**
  - `200 OK` (updated user object)
- **Error Responses:**
  - `400 Bad Request`
  - `401 Unauthorized`
- **Security Notes:** Input validation.

---

## 2. Authentication Module

### Login
- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticate user and return JWT.
- **Authentication/Authorization:** None
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "string", // required
    "password": "string" // required
  }
  ```
- **Success Response:**
  - `200 OK`
  - Example:
    ```json
    { "token": "jwt-token-string" }
    ```
- **Error Responses:**
  - `401 Unauthorized` (invalid credentials)
- **Security Notes:** Rate limiting, account lockout on repeated failures.

---

## 3. Debts Module

### Add Debt
- **Endpoint:** `POST /api/debts`
- **Description:** Add a new debt/loan for the authenticated user.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "type": "string", // required
    "lender_name": "string", // optional
    "lender_contact": "string", // optional
    "balance": 10000, // required
    "apr": 12.5, // required
    "min_payment": 500, // required
    "due_date": "YYYY-MM-DD", // required
    "loan_term_months": 24, // optional
    "secured": true, // optional
    "status": "active" // optional
  }
  ```
- **Success Response:**
  - `201 Created` (debt object)
- **Error Responses:**
  - `400 Bad Request`
  - `401 Unauthorized`
- **Security Notes:** Input validation.

### List Debts
- **Endpoint:** `GET /api/debts`
- **Description:** List all debts for the authenticated user.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `status` (string, optional): Filter by status (e.g., active, closed)
- **Success Response:**
  - `200 OK` (array of debts)
- **Error Responses:**
  - `401 Unauthorized`

### Get Debt by ID
- **Endpoint:** `GET /api/debts/{id}`
- **Description:** Get details of a specific debt.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`
- **Path Parameters:**
  - `id` (integer): Debt ID
- **Success Response:**
  - `200 OK` (debt object)
- **Error Responses:**
  - `401 Unauthorized`
  - `404 Not Found`

### Update Debt
- **Endpoint:** `PUT /api/debts/{id}`
- **Description:** Update a specific debt.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Path Parameters:**
  - `id` (integer): Debt ID
- **Request Body:** (fields optional)
  ```json
  {
    "balance": 9000,
    "apr": 11.5,
    "min_payment": 400,
    "due_date": "YYYY-MM-DD",
    "status": "closed"
  }
  ```
- **Success Response:**
  - `200 OK` (updated debt object)
- **Error Responses:**
  - `400 Bad Request`
  - `401 Unauthorized`
  - `404 Not Found`

### Delete Debt
- **Endpoint:** `DELETE /api/debts/{id}`
- **Description:** Delete a specific debt.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`
- **Path Parameters:**
  - `id` (integer): Debt ID
- **Success Response:**
  - `204 No Content`
- **Error Responses:**
  - `401 Unauthorized`
  - `404 Not Found`

---

## 4. Repayment Plans Module

### Create Repayment Plan
- **Endpoint:** `POST /api/repayment-plans`
- **Description:** Create a new repayment plan for the user.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "strategy_type": "string", // required (e.g., avalanche, snowball)
    "start_date": "YYYY-MM-DD", // required
    "target_completion": "YYYY-MM-DD", // optional
    "monthly_budget": 5000, // optional
    "status": "active" // optional
  }
  ```
- **Success Response:**
  - `201 Created` (plan object)
- **Error Responses:**
  - `400 Bad Request`
  - `401 Unauthorized`

### List Repayment Plans
- **Endpoint:** `GET /api/repayment-plans`
- **Description:** List all repayment plans for the user.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`
- **Success Response:**
  - `200 OK` (array of plans)
- **Error Responses:**
  - `401 Unauthorized`

### Get Repayment Plan by ID
- **Endpoint:** `GET /api/repayment-plans/{id}`
- **Description:** Get details of a specific repayment plan.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`
- **Path Parameters:**
  - `id` (integer): Plan ID
- **Success Response:**
  - `200 OK` (plan object)
- **Error Responses:**
  - `401 Unauthorized`
  - `404 Not Found`

### Update Repayment Plan
- **Endpoint:** `PUT /api/repayment-plans/{id}`
- **Description:** Update a specific repayment plan.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Path Parameters:**
  - `id` (integer): Plan ID
- **Request Body:** (fields optional)
  ```json
  {
    "strategy_type": "string",
    "target_completion": "YYYY-MM-DD",
    "monthly_budget": 6000,
    "status": "inactive"
  }
  ```
- **Success Response:**
  - `200 OK` (updated plan object)
- **Error Responses:**
  - `400 Bad Request`
  - `401 Unauthorized`
  - `404 Not Found`

### Delete Repayment Plan
- **Endpoint:** `DELETE /api/repayment-plans/{id}`
- **Description:** Delete a specific repayment plan.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`
- **Path Parameters:**
  - `id` (integer): Plan ID
- **Success Response:**
  - `204 No Content`
- **Error Responses:**
  - `401 Unauthorized`
  - `404 Not Found`

---

## 5. Payment Schedules Module

### List Payment Schedules for a Plan
- **Endpoint:** `GET /api/repayment-plans/{planId}/payment-schedules`
- **Description:** List all scheduled payments for a repayment plan.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`
- **Path Parameters:**
  - `planId` (integer): Repayment Plan ID
- **Success Response:**
  - `200 OK` (array of payment schedules)
- **Error Responses:**
  - `401 Unauthorized`
  - `404 Not Found`

---

## 6. Transactions Module

### List Transactions
- **Endpoint:** `GET /api/transactions`
- **Description:** List all payment transactions for the user.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `debt_id` (integer, optional): Filter by debt
  - `from_date` (date, optional): Start date
  - `to_date` (date, optional): End date
- **Success Response:**
  - `200 OK` (array of transactions)
- **Error Responses:**
  - `401 Unauthorized`

### Add Transaction
- **Endpoint:** `POST /api/transactions`
- **Description:** Record a new payment transaction.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "debt_id": 1, // required
    "transaction_date": "YYYY-MM-DD", // required
    "amount": 1000, // required
    "transaction_type": "payment", // required
    "description": "string" // optional
  }
  ```
- **Success Response:**
  - `201 Created` (transaction object)
- **Error Responses:**
  - `400 Bad Request`
  - `401 Unauthorized`

---

## 7. Notifications Module

### List Notifications
- **Endpoint:** `GET /api/notifications`
- **Description:** List all notifications for the user.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `status` (string, optional): Filter by status (e.g., sent, read)
- **Success Response:**
  - `200 OK` (array of notifications)
- **Error Responses:**
  - `401 Unauthorized`

### Mark Notification as Read
- **Endpoint:** `PUT /api/notifications/{id}/read`
- **Description:** Mark a notification as read.
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`
- **Path Parameters:**
  - `id` (integer): Notification ID
- **Success Response:**
  - `200 OK` (updated notification object)
- **Error Responses:**
  - `401 Unauthorized`
  - `404 Not Found`

---

## 8. Simulations Module

### Run Payoff Simulation
- **Endpoint:** `POST /api/simulations`
- **Description:** Run a debt payoff simulation (e.g., impact of extra payment).
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "scenario_type": "string", // required
    "parameters": { ... } // required, scenario-specific
  }
  ```
- **Success Response:**
  - `200 OK` (simulation results)
- **Error Responses:**
  - `400 Bad Request`
  - `401 Unauthorized`

---

## 9. Progress Metrics Module

### List Progress Metrics
- **Endpoint:** `GET /api/progress-metrics`
- **Description:** List user's progress metrics (e.g., Debt Stress Score over time).
- **Authentication/Authorization:** JWT Required
- **Request Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `metric_type` (string, optional): Filter by metric type
  - `from_date` (date, optional)
  - `to_date` (date, optional)
- **Success Response:**
  - `200 OK` (array of metrics)
- **Error Responses:**
  - `401 Unauthorized`

---

# Common Error Response Example
```json
{
  "timestamp": "2024-06-01T12:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for field 'email'",
  "path": "/api/users"
}
```

# Security Notes
- All endpoints (except registration and login) require JWT authentication.
- Input validation and output encoding are enforced.
- Rate limiting and account lockout for authentication endpoints.
- Sensitive operations (e.g., delete, update) require ownership checks.
- All data access is scoped to the authenticated user. 