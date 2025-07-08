# Hospital Management System (HMS)

A comprehensive Hospital Management System built with modern microservices architecture, featuring a React TypeScript frontend and Spring Boot backend services deployed on AWS cloud platform.

## 🏥 System Overview

The HMS is a full-featured healthcare management solution that provides comprehensive patient care, appointment scheduling, medical records management, and real-time communication capabilities. The system is designed for scalability, security, and accessibility compliance.

## ✨ Key Features

### 🔐 Authentication & User Management ✅ COMPLETED
- **Multi-role Authentication**: Support for Admin, Doctor, Nurse, Patient, Pharmacist, and Lab Technician roles
- **JWT Token Management**: Secure authentication with automatic token refresh
- **Role-based Access Control**: Granular permissions based on user roles
- **User Profile Management**: Complete profile editing and settings
- **Admin Dashboard**: Comprehensive user management for administrators

### 👥 Patient Management ✅ COMPLETED
- **Patient Registration**: Multi-step registration with comprehensive data collection
- **Patient Search & Filtering**: Advanced search with multiple criteria
- **Patient Dashboard**: Overview with statistics and quick actions
- **Medical History Timeline**: Visual timeline of patient medical history
- **Patient Analytics**: Statistical analysis and trend reporting

### 📅 Appointment Management ✅ COMPLETED
- **Appointment Scheduling**: Multi-step booking with conflict detection
- **Schedule Management**: Doctor availability and appointment management
- **Conflict Resolution**: Automatic detection and resolution of scheduling conflicts
- **Reminder System**: Automated appointment reminders
- **Status Tracking**: Real-time appointment status updates

### 📋 Medical Records ✅ COMPLETED
- **Digital Medical Records**: Complete CRUD operations for medical records
- **Document Management**: File upload and document organization
- **Search & Retrieval**: Advanced search capabilities
- **Audit Trail**: Comprehensive logging of all changes
- **Version Control**: Historical record tracking

### 💊 Healthcare Services ✅ COMPLETED
- **Vitals Monitoring**: Real-time vital signs tracking with alerts
- **Lab Results Management**: Digital lab results with image upload
- **Prescription Management**: Digital prescription system with medication tracking
- **Pharmacy Integration**: Seamless pharmacy workflow integration

### 💬 Communication ✅ COMPLETED
- **Real-time Chat**: Doctor-patient messaging system
- **Notification Center**: Centralized notification management
- **Email Notifications**: Automated email alerts and reminders
- **Push Notifications**: Mobile push notification support

### 📊 Analytics & Reporting ✅ COMPLETED
- **Patient Analytics**: Individual patient statistics and trends
- **Hospital Analytics**: Hospital-wide performance metrics
- **Report Generation**: PDF report generation for various data types
- **Data Export**: Export functionality for CSV, Excel, and PDF formats

### 🎨 User Experience ✅ COMPLETED
- **Responsive Design**: Mobile-first design for all devices
- **Accessibility**: WCAG 2.1 AA compliance with screen reader support
- **Internationalization**: Multi-language support (English implemented)
- **Modern UI**: Material-UI based interface with healthcare theming

## 🏗 Architecture

### Backend Microservices
```
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
```

### Frontend Features
```
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

## 🚀 Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Build Tool**: Maven
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Security**: Spring Security with JWT
- **API Documentation**: OpenAPI 3.0

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI v5)
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **WebSocket**: Socket.io
- **Build Tool**: Vite
- **Internationalization**: react-i18next
- **Accessibility**: WCAG 2.1 AA compliant

### Infrastructure
- **Cloud Platform**: AWS
- **Container Orchestration**: Amazon ECS with Fargate
- **Load Balancer**: AWS Application Load Balancer
- **Database**: Amazon RDS PostgreSQL
- **Cache**: Amazon ElastiCache Redis
- **Storage**: Amazon S3
- **Monitoring**: Amazon CloudWatch
- **CI/CD**: AWS CodePipeline

## 🏗 AWS Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AWS ALB       │    │   API Gateway   │    │  ECS Fargate    │
│   (Load Balancer│    │   (Spring)      │    │   Services      │
│                 │    │                 │    │                 │
│  SSL Termination│───▶│  Route Requests │───▶│  Microservices  │
│  Health Checks  │    │  Rate Limiting  │    │  Auto Scaling   │
│  Load Balancing │    │  Authentication │    │  Circuit Breaker│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   RDS           │    │   ElastiCache   │    │   CloudWatch    │
│   PostgreSQL    │    │     Redis       │    │   Monitoring    │
│                 │    │                 │    │                 │
│  Multi-AZ       │    │  Cluster Mode   │    │  Auto Scaling   │
│  Backup Enabled │    │  Replication    │    │  Alerting       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Project Status

### ✅ Completed Features (100%)

#### Backend Services (12/12)
- [x] User Service - Authentication and user management
- [x] Patient Service - Patient data management
- [x] Appointment Service - Appointment scheduling
- [x] Medical Records Service - Medical records management
- [x] Vitals Service - Vital signs monitoring
- [x] Lab Service - Laboratory investigations
- [x] Prescription Service - Prescription management
- [x] Notification Service - Real-time notifications
- [x] Chat Service - Real-time messaging
- [x] API Gateway - Request routing and security
- [x] Discovery Service - Service registration
- [x] Config Service - Configuration management

#### Frontend Features (25/25)
- [x] FE-001: User Authentication
- [x] FE-002: User Registration
- [x] FE-003: User Profile Management
- [x] FE-004: Admin User Management
- [x] FE-005: Patient Registration
- [x] FE-006: Patient Profile & Search
- [x] FE-007: Patient Dashboard
- [x] FE-008: Appointment Scheduling
- [x] FE-009: Appointment Management
- [x] FE-010: Doctor Schedule Management
- [x] FE-011: Medical Records Management
- [x] FE-012: Medical History Timeline
- [x] FE-013: Vitals Monitoring
- [x] FE-014: Lab Results Management
- [x] FE-015: Prescription Management
- [x] FE-016: Real-time Chat
- [x] FE-017: Notification Center
- [x] FE-018: Email Notifications
- [x] FE-019: Patient Analytics
- [x] FE-020: Hospital Analytics
- [x] FE-021: Report Generation
- [x] FE-022: Data Export
- [x] FE-023: Responsive Design
- [x] FE-024: Accessibility
- [x] FE-025: Internationalization

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 16+
- Docker
- AWS CLI (for deployment)

### Local Development

#### Backend Setup
```bash
# Clone the repository
git clone https://github.com/your-org/hms.git
cd hms

# Build the project
mvn clean install

# Run tests
mvn test

# Start services (requires Docker)
docker-compose up -d
```

#### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### AWS Deployment

#### Infrastructure Setup
```bash
# Deploy infrastructure using CloudFormation
aws cloudformation create-stack \
  --stack-name hms-infrastructure \
  --template-body file://infrastructure/main.yaml \
  --capabilities CAPABILITY_IAM

# Deploy services
./deploy.sh production
```

#### Environment Configuration
```bash
# Set environment variables
export AWS_REGION=us-east-1
export AWS_PROFILE=hms-production

# Configure secrets
aws secretsmanager create-secret \
  --name hms/db-password \
  --secret-string "your-secure-password"
```

## 🔧 Configuration

### Environment Variables
```bash
# Backend Configuration
SPRING_PROFILES_ACTIVE=production
DB_HOST=hms-postgres.region.rds.amazonaws.com
REDIS_HOST=hms-redis.region.cache.amazonaws.com

# Frontend Configuration
VITE_API_BASE_URL=https://api.hms.example.com
VITE_WS_URL=wss://api.hms.example.com
```

### Security Configuration
- JWT token expiration: 24 hours
- Password policy: Minimum 8 characters with complexity
- Rate limiting: 100 requests per minute per IP
- CORS: Configured for production domains

## 📊 Monitoring & Observability

### CloudWatch Metrics
- Application response times
- Error rates and availability
- Database performance metrics
- Cache hit/miss ratios
- Custom business metrics

### Logging
- Centralized logging with CloudWatch Logs
- Structured JSON logging
- Log retention: 30 days
- Real-time log streaming

### Alerting
- High CPU/Memory utilization
- High error rates
- Database connection issues
- Service health checks

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Multi-factor authentication ready
- Session management with Redis

### Data Security
- Encryption at rest and in transit
- Database encryption enabled
- S3 bucket encryption
- VPC isolation

### Network Security
- Security groups and NACLs
- WAF integration
- DDoS protection
- VPN access for administrators

## 📈 Performance & Scalability

### Auto Scaling
- ECS services auto-scale based on CPU/Memory
- RDS read replicas for read scaling
- ElastiCache cluster mode for Redis
- CloudFront CDN for static assets

### Performance Optimization
- Database connection pooling
- Redis caching for sessions and data
- CDN for static assets
- Optimized database queries

## 🧪 Testing

### Backend Testing
```bash
# Unit tests
mvn test

# Integration tests
mvn test -Dtest=*IntegrationTest

# Performance tests
mvn test -Dtest=*PerformanceTest
```

### Frontend Testing
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📚 Documentation

- [API Documentation](docs/API_SPEC.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Frontend Specification](docs/FRONTEND_SPEC.md)
- [Architecture Diagram](HMS_Architecture_Diagram.md)
- [Deployment Architecture](HMS_Deployment_Architecture.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed
- Ensure accessibility compliance
- Test on multiple devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- [Documentation](docs/)
- [Issue Tracker](https://github.com/your-org/hms/issues)
- [Discussions](https://github.com/your-org/hms/discussions)

### Contact
- **Development Team**: dev@hms.example.com
- **Technical Support**: support@hms.example.com
- **Security Issues**: security@hms.example.com

## 🏥 Healthcare Compliance

The HMS system is designed with healthcare compliance in mind:
- **HIPAA Compliance**: Data encryption and access controls
- **Audit Logging**: Comprehensive audit trails
- **Data Retention**: Configurable retention policies
- **Access Controls**: Role-based permissions

## 🚀 Roadmap

### Phase 2 Features (Planned)
- [ ] Machine Learning for predictive analytics
- [ ] IoT device integration
- [ ] Mobile applications (iOS/Android)
- [ ] AI-powered chatbot
- [ ] Advanced analytics dashboard
- [ ] Multi-tenant architecture

### Technology Upgrades
- [ ] Kubernetes migration
- [ ] Service mesh implementation
- [ ] Event streaming with Apache Kafka
- [ ] GraphQL API implementation

---

**Status**: ✅ Production Ready  
**Last Updated**: December 2024  
**Version**: 1.0.0 