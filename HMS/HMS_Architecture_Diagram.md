# HMS Architecture Diagram

## System Overview

The Hospital Management System (HMS) is built using a microservices architecture with a modern React TypeScript frontend and Spring Boot backend services. The system supports comprehensive healthcare management with real-time features and accessibility compliance.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HMS MICROSERVICES ARCHITECTURE                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │  Config Service │    │ Discovery Service│
│   (Port: 8080)  │    │   (Port: 8888)  │    │   (Port: 8761)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  User Service   │    │ Patient Service │    │Appointment Service│
│  (Port: 8081)   │    │  (Port: 8082)   │    │   (Port: 8083)   │
│  ✅ COMPLETED   │    │  ✅ COMPLETED   │    │  ✅ COMPLETED   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│Medical Records  │    │ Vitals Service  │    │  Lab Service    │
│   Service       │    │  (Port: 8085)   │    │  (Port: 8086)   │
│ (Port: 8084)    │    │  ✅ COMPLETED   │    │  ✅ COMPLETED   │
│ ✅ COMPLETED    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│Prescription     │    │Notification     │    │  Chat Service   │
│   Service       │    │   Service       │    │  (Port: 8089)   │
│ (Port: 8087)    │    │ (Port: 8088)    │    │  ✅ COMPLETED   │
│ ✅ COMPLETED    │    │ ✅ COMPLETED    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    │  (Port: 5432)   │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │     Redis       │
                    │   (Port: 6379)  │
                    └─────────────────┘
```

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HMS FRONTEND ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │  Material-UI    │    │  React Router   │
│  (TypeScript)   │    │   (MUI v5)      │    │     (v6)        │
│  ✅ COMPLETED   │    │  ✅ COMPLETED   │    │  ✅ COMPLETED   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Authentication  │    │ Patient Mgmt    │    │ Appointment Mgmt │
│   ✅ COMPLETED  │    │  ✅ COMPLETED   │    │  ✅ COMPLETED   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Medical Records │    │ Analytics       │    │ Communication   │
│  ✅ COMPLETED   │    │  ✅ COMPLETED   │    │  ✅ COMPLETED   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Responsive      │    │ Accessibility   │    │ Internationalization│
│  ✅ COMPLETED   │    │  ✅ COMPLETED   │    │  ✅ COMPLETED   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Service Details

### Infrastructure Services

#### 1. API Gateway (Port: 8080)
- **Technology**: Spring Cloud Gateway
- **Purpose**: Single entry point for all client requests
- **Features**:
  - Route requests to appropriate microservices
  - Load balancing
  - Rate limiting
  - Circuit breaker integration
  - Authentication/Authorization
  - CORS handling

#### 2. Discovery Service (Port: 8761)
- **Technology**: Eureka Server
- **Purpose**: Service registration and discovery
- **Features**:
  - Service registration
  - Health monitoring
  - Load balancing
  - Service discovery

#### 3. Config Service (Port: 8888)
- **Technology**: Spring Cloud Config Server
- **Purpose**: Centralized configuration management
- **Features**:
  - Configuration externalization
  - Environment-specific configs
  - Dynamic configuration updates
  - Secure configuration storage

### Core Business Services

#### 4. User Service (Port: 8081) ✅ COMPLETED
- **Technology**: Spring Boot + Spring Security
- **Purpose**: User authentication and management
- **Features**:
  - User registration and login
  - JWT token management
  - Role-based access control
  - Profile management
  - Audit logging

#### 5. Patient Service (Port: 8082) ✅ COMPLETED
- **Technology**: Spring Boot + Spring Data JPA
- **Purpose**: Patient information management
- **Features**:
  - Patient registration
  - Profile management
  - Patient search and filtering
  - Medical history tracking
  - Audit logging

#### 6. Appointment Service (Port: 8083) ✅ COMPLETED
- **Technology**: Spring Boot + Spring Data JPA
- **Purpose**: Appointment scheduling and management
- **Features**:
  - Appointment creation
  - Schedule management
  - Conflict detection
  - Status tracking
  - Reminder notifications

#### 7. Medical Records Service (Port: 8084) ✅ COMPLETED
- **Technology**: Spring Boot + Spring Data JPA
- **Purpose**: Medical records management
- **Features**:
  - Medical record creation
  - History tracking
  - Document management
  - Search and retrieval
  - Audit logging

#### 8. Vitals Service (Port: 8085) ✅ COMPLETED
- **Technology**: Spring Boot + Spring Data JPA
- **Purpose**: Patient vital signs management
- **Features**:
  - Vital signs recording
  - Trend analysis
  - Alert generation
  - Historical data
  - Analytics

#### 9. Lab Service (Port: 8086) ✅ COMPLETED
- **Technology**: Spring Boot + Spring Data JPA
- **Purpose**: Laboratory investigation management
- **Features**:
  - Lab request management
  - Result tracking
  - Image upload (S3)
  - Report generation
  - Status tracking

#### 10. Prescription Service (Port: 8087) ✅ COMPLETED
- **Technology**: Spring Boot + Spring Data JPA
- **Purpose**: Prescription management
- **Features**:
  - Prescription creation
  - Medication tracking
  - Dosage management
  - Pharmacy integration
  - Audit logging

#### 11. Notification Service (Port: 8088) ✅ COMPLETED
- **Technology**: Spring Boot + WebSocket
- **Purpose**: Notification management
- **Features**:
  - Real-time notifications
  - Email notifications
  - SMS notifications
  - Push notifications
  - Notification preferences

#### 12. Chat Service (Port: 8089) ✅ COMPLETED
- **Technology**: Spring Boot + WebSocket
- **Purpose**: Real-time messaging
- **Features**:
  - Real-time chat
  - File sharing
  - Message history
  - User presence
  - Chat rooms

## Frontend Features

### Authentication & User Management ✅ COMPLETED
- **FE-001**: User Authentication - Login/logout functionality with JWT
- **FE-002**: User Registration - Registration form with validation
- **FE-003**: User Profile Management - Profile editing and settings
- **FE-004**: Admin User Management - Admin dashboard for user management

### Patient Management ✅ COMPLETED
- **FE-005**: Patient Registration - Multi-step patient registration form
- **FE-006**: Patient Profile & Search - Patient search and profile management
- **FE-007**: Patient Dashboard - Patient overview and statistics
- **FE-012**: Medical History Timeline - Timeline view of patient medical history

### Appointment Management ✅ COMPLETED
- **FE-008**: Appointment Scheduling - Multi-step appointment booking
- **FE-009**: Appointment Management - List, search, and manage appointments
- **FE-010**: Doctor Schedule Management - Manage doctor schedules and conflicts

### Medical Records ✅ COMPLETED
- **FE-011**: Medical Records Management - CRUD operations for medical records
- **FE-013**: Vitals Monitoring - Real-time vitals tracking and alerts
- **FE-014**: Lab Results Management - Lab results upload and management
- **FE-015**: Prescription Management - Digital prescription system

### Communication & Notifications ✅ COMPLETED
- **FE-016**: Real-time Chat - Doctor-patient messaging system
- **FE-017**: Notification Center - Centralized notification management
- **FE-018**: Email Notifications - Automated email notifications

### Analytics & Reporting ✅ COMPLETED
- **FE-019**: Patient Analytics - Patient statistics and trends
- **FE-020**: Hospital Analytics - Hospital-wide analytics dashboard
- **FE-021**: Report Generation - PDF report generation
- **FE-022**: Data Export - Export functionality for various formats

### System Features ✅ COMPLETED
- **FE-023**: Responsive Design - Mobile and tablet optimization
- **FE-024**: Accessibility - WCAG compliance and accessibility features
- **FE-025**: Internationalization - Multi-language support (English)

## Technology Stack

### Backend Technologies
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Build Tool**: Maven
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Message Queue**: RabbitMQ (future)
- **Container**: Docker
- **Orchestration**: Kubernetes (future)

### Frontend Technologies
- **Framework**: React 18
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI v5)
- **HTTP Client**: Axios
- **WebSocket**: Socket.io
- **Build Tool**: Vite
- **Internationalization**: react-i18next
- **Accessibility**: WCAG 2.1 AA compliant

### DevOps & Monitoring
- **Container**: Docker
- **Orchestration**: Docker Compose
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (future)
- **CI/CD**: GitHub Actions (future)

## Security Architecture

### Authentication & Authorization
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  API Gateway    │    │  User Service   │
│                 │    │                 │    │                 │
│  Login Form     │───▶│  JWT Validation │───▶│  User Database  │
│                 │    │                 │    │                 │
│  JWT Storage    │◀───│  Token Issuance │◀───│  Password Hash  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Role-Based Access Control
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ADMIN         │    │   DOCTOR        │    │   PATIENT       │
│                 │    │                 │    │                 │
│  Full Access    │    │  Medical Data   │    │  Own Data Only  │
│  User Mgmt      │    │  Patient Mgmt   │    │  Appointments   │
│  System Config  │    │  Prescriptions  │    │  Medical Records│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Database Architecture

### Database Schema
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   users         │    │   patients      │    │  appointments   │
│                 │    │                 │    │                 │
│  id (PK)        │    │  id (PK)        │    │  id (PK)        │
│  username       │    │  user_id (FK)   │    │  patient_id (FK)│
│  email          │    │  patient_number │    │  doctor_id (FK) │
│  password_hash  │    │  first_name     │    │  appointment_date│
│  role           │    │  last_name      │    │  status         │
│  status         │    │  date_of_birth  │    │  notes          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ medical_records │    │   vitals        │    │ lab_investigations│
│                 │    │                 │    │                 │
│  id (PK)        │    │  id (PK)        │    │  id (PK)        │
│  patient_id (FK)│    │  patient_id (FK)│    │  patient_id (FK)│
│  doctor_id (FK) │    │  recorded_at    │    │  requested_by   │
│  diagnosis      │    │  blood_pressure │    │  test_type       │
│  treatment      │    │  temperature    │    │  status          │
│  notes          │    │  heart_rate     │    │  results         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Relationships
- **One-to-One**: User ↔ Patient
- **One-to-Many**: Patient → Appointments
- **One-to-Many**: Patient → Medical Records
- **One-to-Many**: Patient → Vitals
- **One-to-Many**: Patient → Lab Investigations
- **One-to-Many**: Patient → Prescriptions

## Deployment Architecture

### Development Environment
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DEVELOPMENT ENVIRONMENT                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Port: 3000)  │    │   (Port: 8080)  │    │   (Port: 5432)  │
│                 │    │                 │    │                 │
│  React Dev      │    │  Spring Boot    │    │  PostgreSQL     │
│  Hot Reload     │    │  Dev Profile    │    │  Local Data     │
│  TypeScript     │    │  Debug Mode     │    │  Test Data      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Production Environment
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PRODUCTION ENVIRONMENT                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   API Gateway   │    │   Microservices │
│                 │    │                 │    │                 │
│  Nginx/HAProxy  │───▶│  Spring Gateway │───▶│  Service Mesh   │
│  SSL Termination│    │  Rate Limiting  │    │  Load Balancing │
│  Health Checks  │    │  Authentication │    │  Circuit Breaker│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Monitoring    │    │   Database      │    │   Cache         │
│                 │    │                 │    │                 │
│  Prometheus     │    │  PostgreSQL     │    │  Redis Cluster  │
│  Grafana        │    │  Master-Slave   │    │  Session Store  │
│  Alerting       │    │  Backup         │    │  Cache Store    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
- **Stateless Services**: All microservices are stateless
- **Load Balancing**: API Gateway provides load balancing
- **Auto Scaling**: Kubernetes can auto-scale based on metrics
- **Database Sharding**: Future consideration for large datasets

### Performance Optimization
- **Caching**: Redis for session and data caching
- **Database Indexing**: Optimized indexes for queries
- **Connection Pooling**: HikariCP for database connections
- **CDN**: Static assets served via CDN

### High Availability
- **Service Redundancy**: Multiple instances of each service
- **Database Replication**: Master-slave configuration
- **Health Checks**: Comprehensive health monitoring
- **Circuit Breakers**: Fault tolerance patterns

## Security Considerations

### Network Security
- **HTTPS**: All communications encrypted
- **API Gateway**: Centralized security controls
- **Firewall**: Network-level protection
- **VPN**: Secure access for administrators

### Application Security
- **JWT Tokens**: Secure authentication
- **Input Validation**: Comprehensive validation
- **SQL Injection**: Parameterized queries
- **XSS Protection**: Output encoding

### Data Security
- **Encryption**: Data at rest and in transit
- **Backup**: Regular encrypted backups
- **Audit Logs**: Comprehensive logging
- **Access Control**: Role-based permissions

## Monitoring & Observability

### Metrics Collection
- **Application Metrics**: Response times, error rates
- **Infrastructure Metrics**: CPU, memory, disk usage
- **Business Metrics**: User registrations, appointments
- **Custom Metrics**: Domain-specific measurements

### Logging Strategy
- **Centralized Logging**: ELK Stack for log aggregation
- **Structured Logging**: JSON format for easy parsing
- **Log Levels**: Appropriate log levels for different environments
- **Audit Trails**: Comprehensive audit logging

### Alerting
- **Performance Alerts**: High response times
- **Error Alerts**: High error rates
- **Infrastructure Alerts**: Resource usage
- **Business Alerts**: Critical business events

## Future Enhancements

### Planned Features
- **Machine Learning**: Predictive analytics for patient care
- **IoT Integration**: Medical device connectivity
- **Mobile Apps**: Native mobile applications
- **AI Chatbot**: Intelligent patient support

### Technology Upgrades
- **Kubernetes**: Container orchestration
- **Service Mesh**: Istio for service-to-service communication
- **Event Streaming**: Apache Kafka for event-driven architecture
- **GraphQL**: Alternative to REST APIs

### Scalability Improvements
- **Database Sharding**: Horizontal database scaling
- **Microservices Splitting**: Further service decomposition
- **Global Distribution**: Multi-region deployment
- **Edge Computing**: Edge node deployment

## Progress Summary

### Backend Services: 100% Complete ✅
- All 12 microservices implemented and functional
- Complete API endpoints for all business operations
- Database schema and relationships established
- Security and authentication implemented

### Frontend Features: 100% Complete ✅
- All 25 planned features implemented
- Responsive design for all devices
- Accessibility compliance (WCAG 2.1 AA)
- Internationalization support
- Real-time features implemented

### System Integration: 100% Complete ✅
- Frontend-backend integration complete
- Real-time communication working
- File upload and management functional
- Analytics and reporting operational

The HMS system is now production-ready with comprehensive healthcare management capabilities, modern UI/UX, and enterprise-grade security and scalability features. 