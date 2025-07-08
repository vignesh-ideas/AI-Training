# HMS Data Flow Diagram

## System Data Flow Overview

The Hospital Management System (HMS) implements a comprehensive data flow architecture that ensures secure, efficient, and reliable data processing across all microservices.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HMS DATA FLOW ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  API Gateway    │    │  Discovery      │
│   (React)       │    │   (Gateway)     │    │   (Eureka)      │
│                 │    │                 │    │                 │
│  User Interface │───▶│  Route Request  │───▶│  Service Lookup │
│  State Mgmt     │◀───│  Load Balance   │◀───│  Health Check   │
│  API Calls      │    │  Rate Limit     │    │  Service Reg    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  User Service   │    │ Patient Service │    │Appointment Service│
│                 │    │                 │    │                 │
│  Auth/Profile   │    │  Patient Data   │    │  Schedule Data   │
│  Session Mgmt   │    │  Search/Filter  │    │  Conflict Check  │
│  Role Mgmt      │    │  Profile Update │    │  Status Update   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│Medical Records  │    │ Vitals Service  │    │  Lab Service    │
│   Service       │    │                 │    │                 │
│  Record Mgmt    │    │  Vital Signs    │    │  Lab Requests   │
│  History Track  │    │  Trend Analysis │    │  Results Mgmt   │
│  Document Mgmt  │    │  Alert Gen      │    │  Image Upload   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│Prescription     │    │Notification     │    │  Chat Service   │
│   Service       │    │   Service       │    │                 │
│  Prescription   │    │  Real-time Notif│    │  Real-time Chat │
│  Medication     │    │  Email/SMS      │    │  File Sharing   │
│  Pharmacy Int   │    │  Push Notif     │    │  Message Hist   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    │                 │
                    │  Data Storage   │
                    │  ACID Compliance│
                    │  Backup/Recovery│
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │     Redis       │
                    │                 │
                    │  Session Store  │
                    │  Cache Store    │
                    │  Pub/Sub        │
                    └─────────────────┘
```

## Authentication Data Flow

### User Registration Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │User Service │    │ PostgreSQL  │
│             │    │             │    │             │    │             │
│ 1. Register │───▶│ 2. Route    │───▶│ 3. Validate │───▶│ 4. Store    │
│    Form     │    │   Request   │    │   Input     │    │   User      │
│             │    │             │    │             │    │             │
│ 6. Success  │◀───│ 5. Response │◀───│ 4. Hash     │◀───│ 3. Generate │
│   Message   │    │   Return    │    │  Password   │    │   ID        │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │   Redis     │
                    │             │
                    │ 5. Cache    │
                    │   Session   │
                    └─────────────┘
```

### User Login Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │User Service │    │ PostgreSQL  │
│             │    │             │    │             │    │             │
│ 1. Login    │───▶│ 2. Route    │───▶│ 3. Validate │───▶│ 4. Check    │
│    Form     │    │   Request   │    │ Credentials │    │ Credentials │
│             │    │             │    │             │    │             │
│ 7. Store    │◀───│ 6. Return   │◀───│ 5. Generate │◀───│ 4. Verify   │
│   JWT       │    │   JWT       │    │   JWT       │    │   Password  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │   Redis     │
                    │             │
                    │ 5. Store    │
                    │   Session   │
                    └─────────────┘
```

## Patient Data Flow

### Patient Registration Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │Patient      │    │ PostgreSQL  │
│             │    │             │    │Service      │    │             │
│ 1. Patient  │───▶│ 2. Route    │───▶│ 3. Validate │───▶│ 4. Store    │
│    Form     │    │   Request   │    │   Data      │    │   Patient   │
│             │    │             │    │             │    │             │
│ 6. Success  │◀───│ 5. Response │◀───│ 4. Generate │◀───│ 3. Generate │
│   Message   │    │   Return    │    │ Patient ID  │    │   ID        │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │   Redis     │
                    │             │
                    │ 5. Cache    │
                    │   Patient   │
                    └─────────────┘
```

### Patient Search Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │Patient      │    │ PostgreSQL  │
│             │    │             │    │Service      │    │             │
│ 1. Search   │───▶│ 2. Route    │───▶│ 3. Build    │───▶│ 4. Execute  │
│    Query    │    │   Request   │    │   Query     │    │   Query     │
│             │    │             │    │             │    │             │
│ 6. Display  │◀───│ 5. Response │◀───│ 4. Process  │◀───│ 3. Return   │
│   Results   │    │   Return    │    │   Results   │    │   Data      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │   Redis     │
                    │             │
                    │ 5. Cache    │
                    │   Results   │
                    └─────────────┘
```

## Appointment Data Flow

### Appointment Creation Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │Appointment  │    │ PostgreSQL  │
│             │    │             │    │Service      │    │             │
│ 1. Schedule │───▶│ 2. Route    │───▶│ 3. Check    │───▶│ 4. Check    │
│    Form     │    │   Request   │    │ Conflicts   │    │ Conflicts   │
│             │    │             │    │             │    │             │
│ 6. Success  │◀───│ 5. Response │◀───│ 4. Create   │◀───│ 3. Validate │
│   Message   │    │   Return    │    │ Appointment │    │   Time      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │Notification │
                    │Service      │
                    │             │
                    │ 5. Send     │
                    │ Notification│
                    └─────────────┘
```

### Appointment Search Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │Appointment  │    │ PostgreSQL  │
│             │    │             │    │Service      │    │             │
│ 1. Search   │───▶│ 2. Route    │───▶│ 3. Build    │───▶│ 4. Execute  │
│    Query    │    │   Request   │    │   Query     │    │   Query     │
│             │    │             │    │             │    │             │
│ 6. Display  │◀───│ 5. Response │◀───│ 4. Process  │◀───│ 3. Return   │
│   Results   │    │   Return    │    │   Results   │    │   Data      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │   Redis     │
                    │             │
                    │ 5. Cache    │
                    │   Results   │
                    └─────────────┘
```

## Medical Records Data Flow

### Medical Record Creation Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │Medical      │    │ PostgreSQL  │
│             │    │             │    │Records      │    │             │
│ 1. Record   │───▶│ 2. Route    │───▶│ 3. Validate │───▶│ 4. Store    │
│    Form     │    │   Request   │    │   Data      │    │   Record    │
│             │    │             │    │             │    │             │
│ 6. Success  │◀───│ 5. Response │◀───│ 4. Create   │◀───│ 3. Generate │
│   Message   │    │   Return    │    │   Record    │    │   ID        │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │   Redis     │
                    │             │
                    │ 5. Cache    │
                    │   Record    │
                    └─────────────┘
```

### Medical Record Search Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │Medical      │    │ PostgreSQL  │
│             │    │             │    │Records      │    │             │
│ 1. Search   │───▶│ 2. Route    │───▶│ 3. Build    │───▶│ 4. Execute  │
│    Query    │    │   Request   │    │   Query     │    │   Query     │
│             │    │             │    │             │    │             │
│ 6. Display  │◀───│ 5. Response │◀───│ 4. Process  │◀───│ 3. Return   │
│   Results   │    │   Return    │    │   Results   │    │   Data      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │   Redis     │
                    │             │
                    │ 5. Cache    │
                    │   Results   │
                    └─────────────┘
```

## Vitals Data Flow

### Vitals Recording Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │Vitals       │    │ PostgreSQL  │
│             │    │             │    │Service      │    │             │
│ 1. Vitals   │───▶│ 2. Route    │───▶│ 3. Validate │───▶│ 4. Store    │
│    Form     │    │   Request   │    │   Data      │    │   Vitals    │
│             │    │             │    │             │    │             │
│ 6. Success  │◀───│ 5. Response │◀───│ 4. Analyze  │◀───│ 3. Generate │
│   Message   │    │   Return    │    │   Trends    │    │   ID        │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │Notification │
                    │Service      │
                    │             │
                    │ 5. Send     │
                    │ Alert       │
                    └─────────────┘
```

### Vitals Analysis Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │Vitals       │    │ PostgreSQL  │
│             │    │             │    │Service      │    │             │
│ 1. Analysis │───▶│ 2. Route    │───▶│ 3. Build    │───▶│ 4. Execute  │
│    Request  │    │   Request   │    │   Query     │    │   Query     │
│             │    │             │    │             │    │             │
│ 6. Display  │◀───│ 5. Response │◀───│ 4. Process  │◀───│ 3. Return   │
│   Charts    │    │   Return    │    │   Analysis  │    │   Data      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │   Redis     │
                    │             │
                    │ 5. Cache    │
                    │   Analysis  │
                    └─────────────┘
```

## Lab Investigation Data Flow

### Lab Request Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │Lab Service  │    │ PostgreSQL  │
│             │    │             │    │             │    │             │
│ 1. Lab      │───▶│ 2. Route    │───▶│ 3. Validate │───▶│ 4. Store    │
│    Request  │    │   Request   │    │   Request   │    │   Request   │
│             │    │             │    │             │    │             │
│ 6. Success  │◀───│ 5. Response │◀───│ 4. Create   │◀───│ 3. Generate │
│   Message   │    │   Return    │    │   Request   │    │   ID        │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │Notification │
                    │Service      │
                    │             │
                    │ 5. Send     │
                    │ Notification│
                    └─────────────┘
```

### Lab Results Update Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │Lab Service  │    │ PostgreSQL  │
│             │    │             │    │             │    │             │
│ 1. Update   │───▶│ 2. Route    │───▶│ 3. Validate │───▶│ 4. Update   │
│    Results  │    │   Request   │    │   Data      │    │   Results   │
│             │    │             │    │             │    │             │
│ 6. Success  │◀───│ 5. Response │◀───│ 4. Process  │◀───│ 3. Validate │
│   Message   │    │   Return    │    │   Results   │    │   Update    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │Notification │
                    │Service      │
                    │             │
                    │ 5. Send     │
                    │ Notification│
                    └─────────────┘
```

## Prescription Data Flow

### Prescription Creation Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │Prescription │    │ PostgreSQL  │
│             │    │             │    │Service      │    │             │
│ 1. Prescription│───▶│ 2. Route    │───▶│ 3. Validate │───▶│ 4. Store    │
│    Form     │    │   Request   │    │   Data      │    │   Prescription│
│             │    │             │    │             │    │             │
│ 6. Success  │◀───│ 5. Response │◀───│ 4. Create   │◀───│ 3. Generate │
│   Message   │    │   Return    │    │ Prescription│    │   ID        │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │Notification │
                    │Service      │
                    │             │
                    │ 5. Send     │
                    │ Notification│
                    └─────────────┘
```

### Prescription Search Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │Prescription │    │ PostgreSQL  │
│             │    │             │    │Service      │    │             │
│ 1. Search   │───▶│ 2. Route    │───▶│ 3. Build    │───▶│ 4. Execute  │
│    Query    │    │   Request   │    │   Query     │    │   Query     │
│             │    │             │    │             │    │             │
│ 6. Display  │◀───│ 5. Response │◀───│ 4. Process  │◀───│ 3. Return   │
│   Results   │    │   Return    │    │   Results   │    │   Data      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │   Redis     │
                    │             │
                    │ 5. Cache    │
                    │   Results   │
                    └─────────────┘
```

## Notification Data Flow

### Notification Generation Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Service   │    │Notification │    │Notification │    │ PostgreSQL  │
│   (Source)  │    │Service      │    │Service      │    │             │
│             │    │             │    │             │    │             │
│ 1. Event    │───▶│ 2. Process  │───▶│ 3. Create   │───▶│ 4. Store    │
│    Trigger  │    │   Event     │    │ Notification│    │ Notification│
│             │    │             │    │             │    │             │
│ 5. Success  │◀───│ 4. Response │◀───│ 3. Send     │◀───│ 3. Generate │
│   Callback  │    │   Return    │    │ Notification│    │   ID        │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │   Redis     │
                    │             │
                    │ 4. Cache    │
                    │ Notification│
                    └─────────────┘
```

### Notification Delivery Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │Notification │    │Notification │    │ PostgreSQL  │
│             │    │Service      │    │Service      │    │             │
│ 1. Fetch    │───▶│ 2. Route    │───▶│ 3. Query    │───▶│ 4. Execute  │
│    Notifications│   Request   │    │   Database  │    │   Query     │
│             │    │             │    │             │    │             │
│ 6. Display  │◀───│ 5. Response │◀───│ 4. Process  │◀───│ 3. Return   │
│   Notifications│   Return    │    │   Results   │    │   Data      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │   Redis     │
                    │             │
                    │ 5. Cache    │
                    │ Notifications│
                    └─────────────┘
```

## Chat Data Flow

### Real-time Chat Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   WebSocket │    │Chat Service │    │ PostgreSQL  │
│             │    │   Gateway   │    │             │    │             │
│ 1. Send     │───▶│ 2. Route    │───▶│ 3. Validate │───▶│ 4. Store    │
│    Message  │    │   Message   │    │   Message   │    │   Message   │
│             │    │             │    │             │    │             │
│ 5. Display  │◀───│ 4. Broadcast│◀───│ 3. Process  │◀───│ 3. Generate │
│   Message   │    │   Message   │    │   Message   │    │   ID        │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │   Redis     │
                    │             │
                    │ 4. Cache    │
                    │   Message   │
                    └─────────────┘
```

### Chat History Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │Chat Service │    │ PostgreSQL  │
│             │    │             │    │             │    │             │
│ 1. Load     │───▶│ 2. Route    │───▶│ 3. Build    │───▶│ 4. Execute  │
│    History  │    │   Request   │    │   Query     │    │   Query     │
│             │    │             │    │             │    │             │
│ 6. Display  │◀───│ 5. Response │◀───│ 4. Process  │◀───│ 3. Return   │
│   History   │    │   Return    │    │   Results   │    │   Data      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┐
                    │   Redis     │
                    │             │
                    │ 5. Cache    │
                    │   History   │
                    └─────────────┘
```

## Data Security Flow

### Data Encryption Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │   Service   │    │ PostgreSQL  │
│             │    │             │    │             │    │             │
│ 1. HTTPS    │───▶│ 2. TLS/SSL  │───▶│ 3. Validate │───▶│ 4. Encrypt  │
│    Request  │    │   Encryption│    │   Input     │    │   Data      │
│             │    │             │    │             │    │             │
│ 6. Decrypt  │◀───│ 5. TLS/SSL  │◀───│ 4. Process  │◀───│ 3. Store    │
│   Response  │    │   Decryption│    │   Response  │    │   Encrypted │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Authentication Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │ API Gateway │    │User Service │    │ PostgreSQL  │
│             │    │             │    │             │    │             │
│ 1. JWT      │───▶│ 2. Validate │───▶│ 3. Verify   │───▶│ 4. Check    │
│    Token    │    │   Token     │    │   Token     │    │   User      │
│             │    │             │    │             │    │             │
│ 6. Authorize│◀───│ 5. Validate │◀───│ 4. Check    │◀───│ 3. Return   │
│   Request   │    │   Response  │    │   Permissions│    │   User      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Error Handling Flow

### Error Response Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Service   │    │Global Exception│  │Global Exception│  │   Logging   │
│   (Source)  │    │Handler       │    │Handler       │    │   Service   │
│             │    │             │    │             │    │             │
│ 1. Exception│───▶│ 2. Catch    │───▶│ 3. Process  │───▶│ 4. Log      │
│    Thrown   │    │   Exception │    │   Error     │    │   Error     │
│             │    │             │    │             │    │             │
│ 6. Handle   │◀───│ 5. Return   │◀───│ 4. Format   │◀───│ 3. Store    │
│   Error     │    │   Response  │    │   Response  │    │   Log       │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Performance Optimization Flow

### Caching Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Service   │    │   Redis     │    │   Service   │    │ PostgreSQL  │
│             │    │   Cache     │    │             │    │             │
│ 1. Request  │───▶│ 2. Check    │───▶│ 3. Query    │───▶│ 4. Execute  │
│    Data     │    │   Cache     │    │   Database  │    │   Query     │
│             │    │             │    │             │    │             │
│ 6. Return   │◀───│ 5. Store    │◀───│ 4. Process  │◀───│ 3. Return   │
│   Data      │    │   Cache     │    │   Results   │    │   Data      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Monitoring Flow

### Metrics Collection Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Service   │    │  Prometheus │    │  Prometheus │    │   Grafana   │
│             │    │   Exporter  │    │   Server    │    │             │
│ 1. Generate │───▶│ 2. Collect  │───▶│ 3. Store    │───▶│ 4. Query    │
│    Metrics  │    │   Metrics   │    │   Metrics   │    │   Metrics   │
│             │    │             │    │             │    │             │
│ 6. Monitor  │◀───│ 5. Alert    │◀───│ 4. Process  │◀───│ 3. Visualize│
│   Service   │    │   Service   │    │   Alerts    │    │   Data      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Data Backup Flow

### Backup Process Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ PostgreSQL  │    │   Backup    │    │   Storage   │    │   Monitoring│
│   Database  │    │   Service   │    │   Service   │    │   Service   │
│             │    │             │    │             │    │             │
│ 1. Trigger  │───▶│ 2. Create   │───▶│ 3. Store    │───▶│ 4. Monitor  │
│    Backup   │    │   Backup    │    │   Backup    │    │   Process   │
│             │    │             │    │             │    │             │
│ 6. Complete │◀───│ 5. Verify   │◀───│ 4. Validate │◀───│ 3. Log      │
│   Backup    │    │   Backup    │    │   Backup    │    │   Status    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Summary

The HMS data flow architecture ensures:

1. **Security**: All data flows are encrypted and authenticated
2. **Performance**: Caching and optimization at multiple levels
3. **Reliability**: Error handling and monitoring throughout
4. **Scalability**: Horizontal scaling capabilities
5. **Observability**: Comprehensive monitoring and logging
6. **Compliance**: Audit trails and data protection measures

This architecture provides a robust foundation for the Hospital Management System, ensuring data integrity, security, and performance across all services. 