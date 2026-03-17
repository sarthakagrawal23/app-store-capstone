# PlayVault – Full Stack Play Store Platform

## Architecture

```
playvault/
├── backend/
│   ├── eureka-server/      → Service registry (port 8761)
│   ├── api-gateway/        → Single entry point (port 8080)
│   ├── auth-service/       → JWT auth, users (port 8081)
│   ├── app-service/        → App CRUD, categories (port 8082)
│   └── review-service/     → Reviews + downloads (port 8083)
└── frontend/               → Vite + React app (port 3000)
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.8+ |
| MySQL | 8.0+ |
| Node.js | 18+ |

---

## 1 — MySQL Setup

```sql
CREATE DATABASE auth_db;
CREATE DATABASE app_db;
CREATE DATABASE review_db;
```

Update the password in each service's `application.properties`:
```
spring.datasource.password=YOUR_PASSWORD
```

---

## 2 — Start Backend Services (in order)

Open a separate terminal for each:

```bash
# Terminal 1 – Eureka
cd backend/eureka-server
mvn spring-boot:run

# Terminal 2 – API Gateway
cd backend/api-gateway
mvn spring-boot:run

# Terminal 3 – Auth Service
cd backend/auth-service
mvn spring-boot:run

# Terminal 4 – App Service
cd backend/app-service
mvn spring-boot:run

# Terminal 5 – Review Service
cd backend/review-service
mvn spring-boot:run
```

Verify Eureka dashboard: http://localhost:8761
All 4 services (auth, app, review, gateway) should appear registered.

---

## 3 — Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

---

## API Endpoints (all via Gateway on port 8080)

### Auth
| Method | Path | Auth |
|--------|------|------|
| POST | /api/auth/register | No |
| POST | /api/auth/login | No |
| GET  | /api/auth/me | Yes |

### Apps
| Method | Path | Auth |
|--------|------|------|
| GET  | /api/apps | No |
| GET  | /api/apps/{id} | No |
| GET  | /api/categories | No |
| GET  | /api/apps/owner/my | OWNER |
| POST | /api/apps | OWNER |
| PUT  | /api/apps/{id} | OWNER |
| PATCH | /api/apps/{id}/toggle-visibility | OWNER |
| DELETE | /api/apps/{id} | OWNER |
| POST | /api/apps/{id}/download | USER |

### Reviews
| Method | Path | Auth |
|--------|------|------|
| GET  | /api/reviews/app/{appId} | No |
| GET  | /api/reviews/app/{appId}/avg | No |
| POST | /api/reviews/app/{appId} | USER |
| DELETE | /api/reviews/{id} | USER |

### Downloads
| Method | Path | Auth |
|--------|------|------|
| POST | /api/downloads/app/{appId}?appName= | USER |
| GET  | /api/downloads/my | USER |
| GET  | /api/downloads/check/{appId} | USER |

---

## Notes

- JWT secret must be **identical** across auth-service, app-service, review-service
- The Vite proxy routes `/api/*` to `http://localhost:8080` during development
