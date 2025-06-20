# Database Schema: Loan/Debt Repayment Optimizer

This schema is designed for PostgreSQL and follows the data models/entities described in the PRD. It is normalized for clarity and efficiency.

---

## Table: users
| Column Name         | Data Type        | Constraints                                   |
|--------------------|-----------------|-----------------------------------------------|
| id                 | SERIAL          | PRIMARY KEY                                   |
| name               | VARCHAR(100)    | NOT NULL                                      |
| email              | VARCHAR(255)    | NOT NULL, UNIQUE                              |
| phone              | VARCHAR(20)     |                                               |
| password_hash      | VARCHAR(255)    | NOT NULL                                      |
| income             | NUMERIC(12,2)   |                                               |
| budget             | NUMERIC(12,2)   |                                               |
| emergency_fund     | NUMERIC(12,2)   |                                               |
| strategy_pref      | VARCHAR(50)     |                                               |
| notification_settings | JSONB         |                                               |
| created_at         | TIMESTAMP       | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |
| updated_at         | TIMESTAMP       | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |

**Relationships:**
- One-to-many with debts, repayment_plans, transactions, notifications, simulations, progress_metrics

---

## Table: debts
| Column Name         | Data Type        | Constraints                                   |
|--------------------|-----------------|-----------------------------------------------|
| id                 | SERIAL          | PRIMARY KEY                                   |
| user_id            | INTEGER         | NOT NULL, FOREIGN KEY REFERENCES users(id)     |
| type               | VARCHAR(50)     | NOT NULL                                      |
| lender_name        | VARCHAR(100)    |                                               |
| lender_contact     | VARCHAR(100)    |                                               |
| balance            | NUMERIC(12,2)   | NOT NULL                                      |
| apr                | NUMERIC(5,2)    | NOT NULL                                      |
| min_payment        | NUMERIC(12,2)   | NOT NULL                                      |
| due_date           | DATE            | NOT NULL                                      |
| loan_term_months   | INTEGER         |                                               |
| secured            | BOOLEAN         | NOT NULL, DEFAULT FALSE                       |
| status             | VARCHAR(20)     | NOT NULL, DEFAULT 'active'                    |
| created_at         | TIMESTAMP       | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |
| updated_at         | TIMESTAMP       | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |

**Relationships:**
- Many-to-one with users
- One-to-many with payment_schedules, transactions

---

## Table: repayment_plans
| Column Name         | Data Type        | Constraints                                   |
|--------------------|-----------------|-----------------------------------------------|
| id                 | SERIAL          | PRIMARY KEY                                   |
| user_id            | INTEGER         | NOT NULL, FOREIGN KEY REFERENCES users(id)     |
| strategy_type      | VARCHAR(20)     | NOT NULL                                      |
| start_date         | DATE            | NOT NULL                                      |
| target_completion  | DATE            |                                               |
| monthly_budget     | NUMERIC(12,2)   |                                               |
| status             | VARCHAR(20)     | NOT NULL, DEFAULT 'active'                    |
| created_at         | TIMESTAMP       | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |
| updated_at         | TIMESTAMP       | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |

**Relationships:**
- Many-to-one with users
- One-to-many with payment_schedules

---

## Table: payment_schedules
| Column Name         | Data Type        | Constraints                                   |
|--------------------|-----------------|-----------------------------------------------|
| id                 | SERIAL          | PRIMARY KEY                                   |
| plan_id            | INTEGER         | NOT NULL, FOREIGN KEY REFERENCES repayment_plans(id) |
| debt_id            | INTEGER         | NOT NULL, FOREIGN KEY REFERENCES debts(id)     |
| payment_date       | DATE            | NOT NULL                                      |
| payment_amount     | NUMERIC(12,2)   | NOT NULL                                      |
| principal_amount   | NUMERIC(12,2)   | NOT NULL                                      |
| interest_amount    | NUMERIC(12,2)   | NOT NULL                                      |
| status             | VARCHAR(20)     | NOT NULL, DEFAULT 'scheduled'                 |
| created_at         | TIMESTAMP       | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |
| updated_at         | TIMESTAMP       | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |

**Relationships:**
- Many-to-one with repayment_plans, debts

---

## Table: transactions
| Column Name         | Data Type        | Constraints                                   |
|--------------------|-----------------|-----------------------------------------------|
| id                 | SERIAL          | PRIMARY KEY                                   |
| user_id            | INTEGER         | NOT NULL, FOREIGN KEY REFERENCES users(id)     |
| debt_id            | INTEGER         | NOT NULL, FOREIGN KEY REFERENCES debts(id)     |
| transaction_date   | DATE            | NOT NULL                                      |
| amount             | NUMERIC(12,2)   | NOT NULL                                      |
| transaction_type   | VARCHAR(20)     | NOT NULL                                      |
| description        | TEXT            |                                               |
| status             | VARCHAR(20)     | NOT NULL, DEFAULT 'pending'                   |
| created_at         | TIMESTAMP       | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |
| updated_at         | TIMESTAMP       | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |

**Relationships:**
- Many-to-one with users, debts

---

## Table: notifications
| Column Name         | Data Type        | Constraints                                   |
|--------------------|-----------------|-----------------------------------------------|
| id                 | SERIAL          | PRIMARY KEY                                   |
| user_id            | INTEGER         | NOT NULL, FOREIGN KEY REFERENCES users(id)     |
| type               | VARCHAR(20)     | NOT NULL                                      |
| message            | TEXT            | NOT NULL                                      |
| delivery_method    | VARCHAR(20)     | NOT NULL                                      |
| status             | VARCHAR(20)     | NOT NULL, DEFAULT 'sent'                      |
| sent_at            | TIMESTAMP       |                                               |
| read_at            | TIMESTAMP       |                                               |
| created_at         | TIMESTAMP       | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |

**Relationships:**
- Many-to-one with users

---

## Table: simulations
| Column Name         | Data Type        | Constraints                                   |
|--------------------|-----------------|-----------------------------------------------|
| id                 | SERIAL          | PRIMARY KEY                                   |
| user_id            | INTEGER         | NOT NULL, FOREIGN KEY REFERENCES users(id)     |
| scenario_type      | VARCHAR(50)     | NOT NULL                                      |
| parameters         | JSONB           |                                               |
| results            | JSONB           |                                               |
| created_at         | TIMESTAMP       | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |

**Relationships:**
- Many-to-one with users

---

## Table: progress_metrics
| Column Name         | Data Type        | Constraints                                   |
|--------------------|-----------------|-----------------------------------------------|
| id                 | SERIAL          | PRIMARY KEY                                   |
| user_id            | INTEGER         | NOT NULL, FOREIGN KEY REFERENCES users(id)     |
| metric_type        | VARCHAR(50)     | NOT NULL                                      |
| value              | NUMERIC(12,2)   | NOT NULL                                      |
| date               | DATE            | NOT NULL                                      |
| trend              | VARCHAR(20)     |                                               |
| created_at         | TIMESTAMP       | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |

**Relationships:**
- Many-to-one with users

---

# Indexing Recommendations
- Add indexes on foreign key columns (e.g., user_id, debt_id, plan_id) for faster joins and lookups.
- Add index on email in users for quick authentication.
- Add index on payment_date in payment_schedules for schedule queries.

---