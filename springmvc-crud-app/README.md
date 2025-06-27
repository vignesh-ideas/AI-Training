# Legacy Spring MVC to Spring Boot 3 Backend Migration

This project is a modernized backend for a student CRUD application, migrated from a legacy Spring MVC architecture to **Spring Boot 3** and **Java 21**. It is now a pure REST API, ready to be used with any frontend (e.g., React, Angular, Vue).

---

## 🚀 Technology Stack
- **Java 21**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **PostgreSQL**
- **JUnit 5 & Mockito** (unit testing)
- **Swagger/OpenAPI** (API documentation)

---

## 📁 Project Structure
```
src/main/java/com/ideas2it/legacyappconversion/
  ├── MvcCrudApp.java                # Spring Boot main class
  ├── controller/
  │     └── AppController.java       # REST API endpoints
  ├── service/
  │     └── StudentServiceImpl.java # Business logic
  ├── dao/
  │     └── StudentDaoImpl.java     # Data access (JPA)
  ├── model/
  │     └── Student.java            # JPA entity
  └── config/
        └── CorsConfig.java         # Global CORS config

src/test/java/com/ideas2it/legacyappconversion/
  ├── TestProvider.java              # Test data utility
  ├── controller/AppControllerTest.java
  ├── service/StudentServiceImplTest.java
  ├── dao/StudentDaoImplTest.java
  └── model/StudentTest.java
```

---

## ⚙️ Setup & Run

### 1. **Database (PostgreSQL)**
- Ensure PostgreSQL is running and create the database:
  ```sh
  psql -U postgres -c "CREATE DATABASE schooldb;"
  ```
- (Optional) Update `src/main/resources/application.yml` for custom DB credentials.

### 2. **Build & Run**
```sh
mvn clean install
mvn spring-boot:run
```

### 3. **API Documentation**
- Visit [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) for interactive API docs.

---

## 🧪 Testing
Run all unit tests:
```sh
mvn test
```

---

## 🌐 API Endpoints
- `GET    /api/students`         — List all students
- `GET    /api/students/{id}`    — Get student by ID
- `POST   /api/students`         — Create new student
- `PUT    /api/students/{id}`    — Update student
- `DELETE /api/students/{id}`    — Delete student

---

## 📝 Notes
- CORS is enabled for all origins (see `CorsConfig.java`).
- No view layer: this is a pure backend for use with any frontend (e.g., React).
- For production, update database credentials and CORS settings as needed.

---

## 👤 Author
- Migration & modernization by [Your Name/Team]
