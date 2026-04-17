# Login System - Project README

## Project Structure
```
TEST PROJECT/
├── backend/          ← Spring Boot backend (Port 8080)
├── frontend/         ← React + Vite frontend (Port 5173/5174)
└── database/         ← SQL setup scripts
    └── setup.sql
```

## Quick Start

### 1. Database (MySQL)
Make sure MySQL is running, then execute the setup script:
```sql
SOURCE d:/TEST PROJECT/database/setup.sql;
```
This creates the `login_db` database and seeds 2 default users:
| Username   | Password     | Role     |
|------------|--------------|----------|
| admin      | admin123     | ADMIN    |
| customer1  | customer123  | CUSTOMER |

### 2. Backend (Spring Boot)
Requires Java 17. Open a terminal in `d:\TEST PROJECT\backend\` and run:
```bash
# If Maven is installed:
mvn spring-boot:run

# Using Maven wrapper (included):
./mvnw spring-boot:run
```
Backend starts at **http://localhost:8080**

API Endpoints:
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive a JWT token

### 3. Frontend (React)
Open a terminal in `d:\TEST PROJECT\frontend\` and run:
```bash
npm run dev
```
Frontend starts at **http://localhost:5173** (or 5174 if port is busy)

## Features
- **Login** with username & password
- **Register** as Admin or Customer
- **JWT Authentication** — token stored in localStorage
- **Role-based Dashboard** — different views for Admin vs Customer
- **Protected Routes** — dashboard requires login
- **Glassmorphism UI** — modern, premium dark design

## Tech Stack
| Layer    | Technology         |
|----------|--------------------|
| Frontend | React 18 + Vite    |
| Backend  | Spring Boot 3.2    |
| Database | MySQL 8            |
| Auth     | JWT (jjwt 0.11.5)  |
| Security | Spring Security 6  |
