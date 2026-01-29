# B2B SaaS Platform

A production-ready, demo-quality B2B SaaS application showcasing end-to-end architecture ownership. Features authentication, role-based access, deal pipeline management, commission tracking, calendar scheduling, and billing-ready infrastructure.

---

## 1. Project Overview

### The Problem

Building a B2B SaaS from scratch requires coordinating multiple complex systems: user authentication, organization management, business workflows, billing integration, and a polished frontend. Each piece must work together seamlessly while maintaining security and scalability.

### The Solution

This platform provides a complete, rebrandable B2B SaaS foundation. Real estate operations, agency management, financial tracking, or any deal-based workflow—the core patterns are implemented and ready to customize: multi-tenant organizations, deal pipelines with stage progression, automated commission calculations, and calendar scheduling.

### Why It Matters

- **Demonstrate expertise**: Showcase full-stack ownership of complex B2B systems
- **Accelerate development**: Skip months of foundational infrastructure work
- **Production patterns**: Role-based access, audit logging, and proper multi-tenancy
- **Billing ready**: Stripe-compatible endpoints and UI placeholders for monetization
- **Adaptable**: Generic patterns that fit real estate, agencies, finance, or custom domains

---

## 2. Real-World Use Cases

| Industry | Application |
|----------|-------------|
| **Real Estate** | Property deals, agent commissions, pipeline management |
| **Agency Operations** | Client projects, team performance, revenue tracking |
| **Financial Services** | Investment deals, portfolio management, performance metrics |
| **Recruiting** | Candidate pipelines, placement commissions, client management |
| **Professional Services** | Engagement tracking, resource scheduling, billing preparation |
| **Sales Organizations** | Deal flow, territory management, commission calculations |

---

## 3. Core Features

| Feature | Business Value |
|---------|----------------|
| **JWT Authentication** | Secure login with role-based access (Admin/User) |
| **Multi-Tenant Organizations** | Complete data isolation between companies |
| **Deal Pipeline** | Stage workflow (Prospect → Active → Closed) with full CRUD |
| **Commission Tracking** | Auto-calculated metrics from closed deals |
| **Calendar & Booking** | Availability management with scheduling placeholders |
| **Billing Skeleton** | Stripe-ready endpoints and subscription UI |
| **Audit Logging** | Comprehensive trail of critical business actions |
| **KPI Dashboard** | Performance snapshots and analytics views |

---

## 4. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                       B2B SaaS Platform                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐   │
│  │     Next.js Frontend        │  │      NestJS Backend         │   │
│  │                             │  │                             │   │
│  │  • App Router (Next.js 14)  │  │  • Auth & RBAC (JWT)        │   │
│  │  • Tailwind + shadcn/ui    │  │  • Deals & Pipeline         │   │
│  │  • React Query + Zustand   │  │  • Commissions & KPIs       │   │
│  │  • Dashboard & Analytics   │  │  • Calendar & Scheduling    │   │
│  └──────────────┬──────────────┘  └──────────────┬──────────────┘   │
│                 │                                │                  │
│                 └────────────────┬───────────────┘                  │
│                                  │                                  │
│  ┌───────────────────────────────▼───────────────────────────────┐  │
│  │                    Shared Infrastructure                       │  │
│  │                                                                │  │
│  │  • PostgreSQL (Prisma ORM)  • Docker Compose                  │  │
│  │  • Swagger/OpenAPI          • Vitest/Jest Testing             │  │
│  └────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14, TypeScript | App Router with server components |
| **Styling** | Tailwind CSS, shadcn/ui | Utility-first design with Radix primitives |
| **State** | React Query, Zustand | Server and client state management |
| **Backend** | NestJS (Fastify), TypeScript | High-performance API framework |
| **Database** | PostgreSQL, Prisma | Type-safe ORM with migrations |
| **Auth** | JWT, bcrypt | Secure authentication and password hashing |
| **Testing** | Vitest, Jest, Supertest, React Testing Library | Comprehensive test coverage |
| **Documentation** | Swagger/OpenAPI | Interactive API documentation |
| **Infrastructure** | Docker Compose | Development environment orchestration |

---

## 6. How the System Works

### Authentication & Authorization Flow

```
Login Request → Validate Credentials → Issue JWT → Role-Based Access
```

1. **Login**: User submits email and password
2. **Validate**: bcrypt compares password hash
3. **Issue**: JWT token generated with user ID and role
4. **Access**: Guards check token and role on protected endpoints
5. **Refresh**: Token refresh mechanism for extended sessions

### Deal Pipeline Flow

```
Create Deal → Prospect Stage → Active Stage → Closed Stage → Commission
```

1. **Create**: New deal entered with value and metadata
2. **Progress**: Move through stages based on business workflow
3. **Track**: Each stage change logged in audit trail
4. **Close**: Mark deal as won or lost with final amount
5. **Calculate**: Commission automatically computed for assigned user

### Commission Calculation Flow

```
Deal Closes → Calculate Commission → Create Entry → Update KPI Snapshot
```

1. **Trigger**: Deal status changes to Closed/Won
2. **Calculate**: Apply commission percentage to deal value
3. **Record**: Create commission entry linked to deal and user
4. **Aggregate**: Update monthly KPI snapshot with new totals
5. **Display**: Dashboard reflects updated metrics

---

## 7. Setup & Run

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/b2b-saas-demo.git
cd b2b-saas-demo

# Install dependencies
npm install

# Configure environment
cp env.example .env

# Start PostgreSQL
npm run db:up

# Run migrations and seed
npm run api:prisma:migrate
npm run api:prisma:seed

# Start development servers
npm run dev
```

### Environment Configuration

```bash
# Backend (.env)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/b2b_saas_demo"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3001

# Frontend (.env.local)
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Next.js dashboard |
| **Backend API** | http://localhost:3001 | NestJS REST API |
| **API Documentation** | http://localhost:3001/docs | Swagger UI |
| **Database** | localhost:5432 | PostgreSQL |

---

## 8. API & Usage

### Seed Credentials

| User | Email | Password | Role |
|------|-------|----------|------|
| **Admin** | admin@demo.com | admin123 | ADMIN |
| **User** | user@demo.com | user123 | USER |

### Authentication

```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@demo.com", "password": "admin123"}'
```

### Deal Management

```bash
# List deals
curl http://localhost:3001/deals \
  -H "Authorization: Bearer $TOKEN"

# Create deal
curl -X POST http://localhost:3001/deals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Enterprise Deal",
    "value": 50000,
    "stage": "PROSPECT",
    "clientName": "Acme Corp"
  }'

# Update deal stage
curl -X PATCH http://localhost:3001/deals/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"stage": "ACTIVE"}'
```

### Commissions & KPIs

```bash
# Get user commissions
curl http://localhost:3001/commissions \
  -H "Authorization: Bearer $TOKEN"

# Get KPI snapshot
curl http://localhost:3001/kpis/monthly \
  -H "Authorization: Bearer $TOKEN"
```

---

## 9. Scalability & Production Readiness

### Current Architecture Strengths

| Aspect | Implementation |
|--------|----------------|
| **Multi-Tenancy** | Organization-level data isolation via Prisma middleware |
| **Performance** | Fastify adapter for high-throughput API handling |
| **Type Safety** | End-to-end TypeScript with shared DTOs |
| **Testing** | Unit, integration, and E2E test infrastructure |
| **Documentation** | Swagger UI for all API endpoints |
| **Audit Trail** | Comprehensive logging of business-critical actions |

### Production Enhancements (Recommended)

| Enhancement | Purpose |
|-------------|---------|
| **Redis Caching** | Session storage and API response caching |
| **Rate Limiting** | Protect against API abuse |
| **Stripe Integration** | Complete payment processing for billing |
| **Email Service** | Transactional emails for invitations and alerts |
| **Error Tracking** | Sentry for production monitoring |
| **CI/CD Pipeline** | GitHub Actions for automated testing and deployment |

---

## 10. Screenshots & Demo

### Suggested Visuals

- [ ] Login page with role selection
- [ ] Dashboard with KPI cards and charts
- [ ] Deal pipeline board with drag-and-drop
- [ ] Commission report with filtering
- [ ] Calendar availability management
- [ ] Settings page with organization management

---

## Project Structure

```
b2b-saas-demo/
├── apps/
│   ├── api/                 # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/    # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── deals/
│   │   │   │   ├── commissions/
│   │   │   │   ├── calendar/
│   │   │   │   └── billing/
│   │   │   └── prisma/     # Database service
│   │   └── prisma/         # Schema & migrations
│   └── web/                 # Next.js Frontend
│       ├── src/
│       │   ├── app/        # App Router pages
│       │   ├── components/ # Reusable components
│       │   ├── hooks/      # Custom hooks
│       │   └── lib/        # Utilities
│       └── public/
├── packages/
│   └── dtos/               # Shared DTOs & schemas
├── docker-compose.yml
├── turbo.json
└── package.json
```

---

## Demo Data

The seed script creates:

- **1 Organization**: Demo Organization
- **3 Plans**: FREE, PRO, ENTERPRISE
- **10 Sample Deals**: Various stages and amounts
- **Commission Entries**: Auto-calculated for closed deals
- **Calendar Slots**: Sample availability windows
- **Audit Logs**: Sample activity tracking
- **KPI Snapshots**: Monthly performance data

---

## Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run build            # Build all applications
npm run lint             # Lint all code
npm run test             # Run all tests
npm run typecheck        # Type check all code

# Database
npm run db:up            # Start PostgreSQL
npm run db:down          # Stop PostgreSQL
npm run db:reset         # Reset database and seed
npm run api:prisma:studio # Open Prisma Studio

# Backend
npm run api:prisma:migrate # Run migrations
npm run api:prisma:seed    # Seed database
npm run test:e2e           # Run E2E tests
```

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

*Enterprise-grade B2B SaaS architecture, ready for your domain.*
