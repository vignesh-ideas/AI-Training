# Backend Implementation Task List

This is a living document for tracking backend development tasks for the Loan/Debt Repayment Optimizer project.

---

## BE-001: User Registration & Authentication
- **Title:** Implement user registration and JWT-based authentication
- **User Story:** As a new user, I want to register and securely log in so that I can access my account. (PRD §4)
- **Detailed Description:**
  - Implement endpoints for user registration (`POST /api/users`) and login (`POST /api/auth/login`).
  - Store user credentials securely (hashed passwords).
  - Issue JWT tokens on successful login.
  - Enforce input validation and rate limiting.
- **Dependencies:** users table (DATABASE_SCHEMA), API_SPEC endpoints
- **Complexity:** 3
- **Technical Requirements:**
  - Endpoints: `POST /api/users`, `POST /api/auth/login`
  - Data Model: users
- **Acceptance Criteria:**
  - Users can register and log in.
  - Passwords are hashed.
  - JWT is returned on login.
  - Invalid credentials are rejected.
  - Registration is rate-limited.
- **Suggested Approach/Notes:** Use Spring Security, BCrypt, JWT libraries.
- **Status:** Complete. Endpoints, validation, error handling, and tests implemented.

---

## BE-002: User Profile Management
- **Title:** Implement user profile retrieval and update
- **User Story:** As a user, I want to view and update my profile so that my information is current. (PRD §4)
- **Detailed Description:**
  - Implement endpoints to get and update the authenticated user's profile.
  - Support updating fields: name, phone, income, budget, emergency fund, strategy preference.
- **Dependencies:** BE-001, users table
- **Complexity:** 2
- **Technical Requirements:**
  - Endpoints: `GET /api/users/me`, `PUT /api/users/me`
  - Data Model: users
- **Acceptance Criteria:**
  - Authenticated users can view and update their profile.
  - Input validation is enforced.
- **Suggested Approach/Notes:** Use DTOs for update requests.
- **Status:** Complete. Endpoints, validation, and tests implemented.

---

## BE-003: Debt Management
- **Title:** Implement CRUD for debts/loans
- **User Story:** As a user, I want to add, view, update, and delete my debts so that I can manage all my loans in one place. (PRD §4)
- **Detailed Description:**
  - Implement endpoints for creating, listing, retrieving, updating, and deleting debts.
  - Support filtering by status.
- **Dependencies:** BE-001, debts table
- **Complexity:** 3
- **Technical Requirements:**
  - Endpoints: `POST /api/debts`, `GET /api/debts`, `GET /api/debts/{id}`, `PUT /api/debts/{id}`, `DELETE /api/debts/{id}`
  - Data Model: debts
- **Acceptance Criteria:**
  - Authenticated users can manage their debts.
  - Only the owner can modify/delete their debts.
  - Input validation and error handling are in place.
- **Suggested Approach/Notes:** Use JPA repositories, ownership checks.
- **Status:** Complete. Endpoints, validation, ownership checks, and tests implemented.

---

## BE-004: Repayment Plan Management
- **Title:** Implement CRUD for repayment plans
- **User Story:** As a user, I want to create and manage repayment plans so that I can optimize my debt payoff. (PRD §4)
- **Detailed Description:**
  - Implement endpoints for creating, listing, retrieving, updating, and deleting repayment plans.
- **Dependencies:** BE-001, repayment_plans table
- **Complexity:** 3
- **Technical Requirements:**
  - Endpoints: `POST /api/repayment-plans`, `GET /api/repayment-plans`, `GET /api/repayment-plans/{id}`, `PUT /api/repayment-plans/{id}`, `DELETE /api/repayment-plans/{id}`
  - Data Model: repayment_plans
- **Acceptance Criteria:**
  - Authenticated users can manage their repayment plans.
  - Only the owner can modify/delete their plans.
- **Suggested Approach/Notes:** Link plans to user and debts as per schema.
- **Status:** Complete. Endpoints, validation, ownership checks, and tests implemented.

---

## BE-005: Payment Schedule Retrieval
- **Title:** List payment schedules for a repayment plan
- **User Story:** As a user, I want to see my upcoming payments so that I can plan ahead. (PRD §4)
- **Detailed Description:**
  - Implement endpoint to list all scheduled payments for a given repayment plan.
- **Dependencies:** BE-004, payment_schedules table
- **Complexity:** 2
- **Technical Requirements:**
  - Endpoint: `GET /api/repayment-plans/{planId}/payment-schedules`
  - Data Model: payment_schedules
- **Acceptance Criteria:**
  - Authenticated users can view payment schedules for their plans.
- **Suggested Approach/Notes:** Use planId path parameter, filter by user.
- **Status:** Complete. Endpoint, validation, ownership checks, and tests implemented.

---

## BE-006: Transaction Management
- **Title:** Implement CRUD for payment transactions
- **User Story:** As a user, I want to record and view my debt payments so that I can track my progress. (PRD §4)
- **Detailed Description:**
  - Implement endpoints for listing and creating transactions.
  - Support filtering by debt and date range.
- **Dependencies:** BE-001, debts, transactions tables
- **Complexity:** 2
- **Technical Requirements:**
  - Endpoints: `GET /api/transactions`, `POST /api/transactions`
  - Data Model: transactions
- **Acceptance Criteria:**
  - Authenticated users can record and view their transactions.
  - Only the owner can add/view their transactions.
- **Suggested Approach/Notes:** Validate debt ownership before recording transaction.
- **Status:** Complete. Endpoints, validation, ownership checks, and tests implemented.

---

## BE-007: Notifications
- **Title:** Implement notification listing and status update
- **User Story:** As a user, I want to receive and manage notifications so that I never miss a payment. (PRD §4)
- **Detailed Description:**
  - Implement endpoints to list notifications and mark them as read.
- **Dependencies:** BE-001, notifications table
- **Complexity:** 2
- **Technical Requirements:**
  - Endpoints: `GET /api/notifications`, `PUT /api/notifications/{id}/read`
  - Data Model: notifications
- **Acceptance Criteria:**
  - Authenticated users can view and mark notifications as read.
- **Suggested Approach/Notes:** Consider background job for notification delivery.
- **Status:** Complete. Endpoints, validation, ownership checks, and tests implemented.

---

## BE-008: Simulation Engine
- **Title:** Implement debt payoff simulation endpoint
- **User Story:** As a user, I want to simulate different repayment scenarios so that I can make informed decisions. (PRD §4, Impact Simulator)
- **Detailed Description:**
  - Implement endpoint to run payoff simulations based on user input.
- **Dependencies:** BE-001, debts, simulations table
- **Complexity:** 5
- **Technical Requirements:**
  - Endpoint: `POST /api/simulations`
  - Data Model: simulations
- **Acceptance Criteria:**
  - Authenticated users can run simulations and receive results.
  - Simulation logic matches business rules.
- **Suggested Approach/Notes:** Use service layer for simulation logic, return results in JSON.
- **Status:** Complete. Endpoints, service, entity, repository, and tests implemented.

---

## BE-009: Progress Metrics
- **Title:** Implement progress metrics retrieval
- **User Story:** As a user, I want to track my progress and see my Debt Stress Score improve over time. (PRD §4, Debt Stress Score)
- **Detailed Description:**
  - Implement endpoint to list progress metrics, filterable by type and date.
- **Dependencies:** BE-001, progress_metrics table
- **Complexity:** 2
- **Technical Requirements:**
  - Endpoint: `GET /api/progress-metrics`
  - Data Model: progress_metrics
- **Acceptance Criteria:**
  - Authenticated users can view their progress metrics.
- **Suggested Approach/Notes:** Calculate Debt Stress Score as per business rules.
- **Status:** Complete. Endpoints, service, entity, repository, DTO, and tests implemented.

---

## BE-010: Security & Access Control
- **Title:** Enforce authentication, authorization, and data scoping
- **User Story:** As a user, I want my data to be secure and private. (PRD §7)
- **Detailed Description:**
  - Enforce JWT authentication on all endpoints except registration/login.
  - Ensure users can only access their own data.
  - Implement input validation and error handling.
- **Dependencies:** All modules
- **Complexity:** 3
- **Technical Requirements:**
  - All endpoints, Spring Security
- **Acceptance Criteria:**
  - Unauthorized access is blocked.
  - Data is scoped to authenticated user.
  - Input validation and error responses are consistent.
- **Suggested Approach/Notes:** Use global exception handler, method-level security annotations.
- **Status:** Complete. All endpoints protected, user data scoping enforced via security context, and tests updated.

---

## BE-011: Error Handling & Validation
- **Title:** Implement global error handling and input validation
- **User Story:** As a user, I want clear error messages so that I can fix issues quickly. (PRD §7)
- **Detailed Description:**
  - Implement global exception handling for REST API.
  - Standardize error response format.
  - Validate all incoming requests.
- **Dependencies:** All modules
- **Complexity:** 2
- **Technical Requirements:**
  - All endpoints
- **Acceptance Criteria:**
  - Errors are returned in a consistent format.
  - Invalid input is rejected with clear messages.
- **Suggested Approach/Notes:** Use @ControllerAdvice, Bean Validation (JSR-380).
- **Status:** Complete. Global exception handler, validation, and consistent error responses implemented.

---

## BE-012: Documentation & Code Quality
- **Title:** Maintain API documentation and code quality standards
- **User Story:** As a developer, I want clear documentation so that I can build and maintain the system efficiently.
- **Detailed Description:**
  - Maintain up-to-date API documentation (OpenAPI/Swagger).
  - Enforce code quality via reviews and static analysis.
- **Dependencies:** All modules
- **Complexity:** 1
- **Technical Requirements:**
  - OpenAPI/Swagger, code review tools
- **Acceptance Criteria:**
  - API docs are accurate and accessible.
  - Code passes static analysis and review.
- **Suggested Approach/Notes:** Use springdoc-openapi, SonarQube.
- **Status:** Complete. OpenAPI/Swagger UI integrated, API docs are live, and code quality practices are in place.

---

# Backend Implementation Summary

All planned backend tasks for the Loan/Debt Repayment Optimizer have been completed:

- **User Registration & Authentication:** Secure registration, login, JWT, password hashing.
- **User Profile Management:** View and update profile, input validation.
- **Debt Management:** CRUD for debts, ownership checks, validation.
- **Repayment Plan Management:** CRUD for plans, user scoping, validation.
- **Payment Schedule Retrieval:** List payment schedules for plans.
- **Transaction Management:** Record and view transactions, ownership checks.
- **Notifications:** List and mark notifications as read.
- **Simulation Engine:** Simulate debt payoff strategies, persist and retrieve results.
- **Progress Metrics:** Track and retrieve user progress metrics.
- **Security & Access Control:** JWT auth, user data scoping, method-level security.
- **Error Handling & Validation:** Global exception handler, consistent error responses, validation.
- **Documentation & Code Quality:** Live OpenAPI/Swagger docs, code quality practices.

The backend is now production-ready, fully tested, and documented. 🎉 