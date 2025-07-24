# 🚀 B2B SaaS Demo

A production-quality, demo-ready B2B SaaS application showcasing end-to-end ownership of architecture, backend, frontend, auth, billing-ready structure, dashboards, workflows, and clean code.

## 🎯 Project Overview

This is a generic, rebrandable B2B SaaS platform that can be adapted for various use cases:
- **Real Estate Operations** - Property deals, agent commissions, pipeline management
- **Agency Operations** - Client projects, team performance, revenue tracking
- **Financial Tracking** - Investment deals, portfolio management, performance metrics
- **Scheduling & Booking** - Appointment management, availability tracking, client interactions

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Query, Zustand
- **Backend**: NestJS (Fastify), TypeScript, Prisma ORM, PostgreSQL, JWT Auth
- **Database**: PostgreSQL with Prisma migrations & seed
- **Infrastructure**: Docker Compose for development
- **Testing**: Vitest/Jest, Supertest, React Testing Library
- **Documentation**: Swagger/OpenAPI

### Core Modules
- **Auth & RBAC** - JWT authentication with ADMIN/USER roles
- **Transactions/Deals** - CRUD operations with stage workflow (Prospect → Active → Closed)
- **Commissions/KPIs** - Auto-calculated metrics from deals
- **Calendar/Booking** - Availability management with mock integration layer
- **Billing Skeleton** - Stripe-ready endpoints and UI placeholders
- **Settings/Organization** - Profile management and plan limits
- **Audit Log** - Comprehensive audit trail on critical actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- npm or yarn

### 1. Clone & Setup
```bash
git clone <repository-url>
cd b2b-saas-demo
npm install
```

### 2. Environment Setup
```bash
# Copy environment file
cp env.example .env

# Edit .env with your configuration
# Key variables:
# - DATABASE_URL (auto-configured for Docker)
# - JWT_SECRET (generate a secure key)
# - NEXT_PUBLIC_API_URL (default: http://localhost:3001)
```

### 3. Start Database
```bash
npm run db:up
```

### 4. Database Setup
```bash
# Run migrations
npm run api:prisma:migrate

# Seed database with sample data
npm run api:prisma:seed
```

### 5. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
# Backend only: cd apps/api && npm run start:dev
# Frontend only: cd apps/web && npm run dev
```

### 6. Access Applications
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/docs
- **Database**: localhost:5432 (PostgreSQL)

## 🔐 Seed Credentials

The seed script creates two users for testing:

### Admin User
- **Email**: admin@demo.com
- **Password**: admin123
- **Role**: ADMIN
- **Access**: Full system access, user management, billing

### Regular User
- **Email**: user@demo.com
- **Password**: user123
- **Role**: USER
- **Access**: Deal management, commissions, calendar

## 📊 Demo Data

The seed script creates:
- **1 Organization**: Demo Organization
- **3 Plans**: FREE, PRO, ENTERPRISE
- **10 Sample Deals**: Various stages and amounts
- **Commission Entries**: Auto-calculated for closed deals
- **Calendar Slots**: Sample availability
- **Audit Logs**: Sample activity tracking
- **KPI Snapshots**: Monthly performance data

## 🎬 Loom Demo Script

### 1. Login Flow (2 minutes)
- **Start**: Show the clean login page
- **Admin Login**: Use admin@demo.com / admin123
- **User Login**: Switch to user@demo.com / user123
- **Highlight**: JWT token handling, role-based access

### 2. Dashboard KPIs (3 minutes)
- **Overview**: Show the main dashboard with key metrics
- **Metrics Displayed**:
  - Total Deals (current month)
  - Closed Revenue (current month)
  - Average Commission %
  - Pipeline by Stage
- **Charts**: Revenue trends, deal stage breakdown
- **Recent Activity**: Audit log feed

### 3. Deal Management (4 minutes)
- **Create Deal**: Show the deal creation form
- **Stage Transitions**: Move a deal through stages
  - Prospect → Active → Closed
- **Commission Calculation**: Show auto-calculation when deal closes
- **KPI Updates**: Demonstrate real-time metric updates
- **Validation**: Show stage transition rules

### 4. Commission Tracking (2 minutes)
- **Commission Summary**: Show total commissions, averages
- **By User**: Display commission breakdown by team member
- **Auto-calculation**: Explain commission rate application
- **Historical Data**: Show commission trends

### 5. Plan Limits & Billing (3 minutes)
- **Current Plan**: Show PRO plan details
- **Plan Limits**: Demonstrate maxDeals enforcement
- **Upgrade CTA**: Show upgrade prompts when limits exceeded
- **Billing Placeholders**: Show Stripe-ready endpoints
- **Plan Features**: Highlight feature differences

### 6. Calendar Integration (2 minutes)
- **Availability Slots**: Show calendar management
- **Booking Status**: Demonstrate booked vs available slots
- **Integration Ready**: Explain Google Calendar adapter pattern
- **Future OAuth**: Show OAuth integration structure

### 7. Audit Log (2 minutes)
- **Activity Tracking**: Show comprehensive audit trail
- **Action Recording**: Demonstrate automatic logging
- **Filtering**: Show audit log filtering options
- **Security**: Highlight compliance and security benefits

### 8. Code Architecture Tour (3 minutes)
- **Backend Structure**: Show `apps/api/src/modules/*`
  - Auth module with JWT strategy
  - Deals module with stage workflow
  - Commissions with auto-calculation
  - Multi-tenant architecture
- **Frontend Structure**: Show `apps/web/app/*`
  - App Router implementation
  - Component organization
  - State management with Zustand
  - API integration with React Query
- **Shared DTOs**: Show `packages/dtos/*`
  - Type safety across frontend/backend
  - Zod validation schemas
  - Class-validator decorators

### 9. Closing (1 minute)
- **Summary**: "This demo was fully designed, architected and implemented by me end-to-end"
- **Key Highlights**:
  - Production-ready architecture
  - Comprehensive feature set
  - Clean, maintainable code
  - Scalable design patterns
  - Security best practices

## 🛠️ Development

### Available Scripts

#### Root Level
```bash
npm run dev          # Start both frontend and backend
npm run build        # Build all applications
npm run lint         # Lint all code
npm run test         # Run all tests
npm run typecheck    # Type check all code
npm run db:up        # Start PostgreSQL
npm run db:down      # Stop PostgreSQL
npm run db:reset     # Reset database and seed
```

#### Backend (apps/api)
```bash
npm run start:dev    # Start development server
npm run build        # Build for production
npm run start:prod   # Start production server
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run prisma:migrate # Run database migrations
npm run prisma:seed  # Seed database
npm run prisma:studio # Open Prisma Studio
```

#### Frontend (apps/web)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code
```

### Project Structure
```
b2b-saas-demo/
├── apps/
│   ├── api/                 # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/     # Feature modules
│   │   │   ├── prisma/      # Database service
│   │   │   └── main.ts      # Application entry
│   │   └── prisma/          # Database schema & migrations
│   └── web/                 # Next.js Frontend
│       ├── src/
│       │   ├── app/         # App Router pages
│       │   ├── components/  # Reusable components
│       │   ├── hooks/       # Custom hooks
│       │   └── lib/         # Utilities
│       └── public/          # Static assets
├── packages/
│   └── dtos/                # Shared DTOs & schemas
├── docker-compose.yml       # PostgreSQL setup
├── turbo.json              # Monorepo configuration
└── package.json            # Root dependencies
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/b2b_saas_demo"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3001
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### Database Configuration
- **Host**: localhost
- **Port**: 5432
- **Database**: b2b_saas_demo
- **Username**: postgres
- **Password**: postgres

## 🧪 Testing

### Backend Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend Tests
```bash
# Component tests
npm run test

# E2E tests (if configured)
npm run test:e2e
```

## 🚀 Deployment

### Production Build
```bash
# Build all applications
npm run build

# Start production servers
npm run start
```

### Docker Deployment
```bash
# Build Docker images
docker-compose -f docker-compose.prod.yml up -d

# Or individual services
docker build -t b2b-saas-api ./apps/api
docker build -t b2b-saas-web ./apps/web
```

## 🔌 Extensibility

### Adding New Features
1. **Backend**: Create new module in `apps/api/src/modules/`
2. **Frontend**: Add pages in `apps/web/src/app/`
3. **Shared Types**: Update `packages/dtos/`
4. **Database**: Add models to Prisma schema

### Stripe Integration
- Billing endpoints are ready for Stripe integration
- Update environment variables with Stripe keys
- Implement webhook handlers
- Add payment processing logic

### Google Calendar Integration
- Calendar adapter pattern is in place
- Add OAuth configuration
- Implement Google Calendar API calls
- Update calendar sync logic

### Custom Workflows
- Deal stages can be customized
- Commission calculation rules can be modified
- Audit logging can be extended
- Role-based permissions can be enhanced

## 📈 Performance

### Optimizations
- **Frontend**: React Query for caching, code splitting
- **Backend**: Fastify for performance, connection pooling
- **Database**: Indexed queries, efficient relationships
- **Caching**: Redis ready for session storage

### Monitoring
- **Health Checks**: Database and API health endpoints
- **Logging**: Structured logging with correlation IDs
- **Metrics**: Ready for Prometheus/Grafana integration
- **Error Tracking**: Sentry-ready error handling

## 🔒 Security

### Implemented Security
- **Authentication**: JWT with secure token handling
- **Authorization**: Role-based access control
- **Validation**: Input validation with Zod/class-validator
- **Multi-tenancy**: Organization-level data isolation
- **Audit Logging**: Comprehensive activity tracking

### Security Best Practices
- **HTTPS**: Ready for SSL/TLS configuration
- **Rate Limiting**: API rate limiting implemented
- **CORS**: Proper CORS configuration
- **Helmet**: Security headers with Fastify Helmet
- **Password Hashing**: bcrypt for password security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or issues:
1. Check the API documentation at `/docs`
2. Review the code comments
3. Check the test files for usage examples
4. Open an issue with detailed information

---

**Built with ❤️ using modern web technologies** 