# SmartCargoSpace — Intelligent Container Matching & Fill My Container

## Purpose

Enhance the existing SmartCargoSpace MERN application with two intelligent logistics features:

1. **Intelligent Container Matching** — helps traders find the best available cargo capacity.
2. **Fill My Container** — helps logistics providers find the best combination of trader shipments to use their remaining container capacity.

These are enhancements to the existing application.

**DO NOT rebuild the project.**

**DO NOT migrate the project to another technology stack.**

---

# 1. Existing Technology Stack

The existing SmartCargoSpace application uses:

### Frontend
- React
- Vite
- TypeScript

### Backend
- Node.js
- Express
- TypeScript

### Database
- MongoDB
- Mongoose

### Authentication
- JWT
- bcryptjs

### Real-Time Communication
- Socket.IO

Reuse the existing:

- Authentication
- RBAC
- MongoDB models
- Mongoose schemas
- API architecture
- Booking flow
- Payment flow
- Socket.IO
- UI components
- Capacity protection
- Provider dashboard
- Trader dashboard

Do not create duplicate systems.

---

# 2. Antigravity Workflow

Before modifying the application:

## Phase 1 — Explore

Inspect the existing codebase.

Identify:

- Frontend structure
- Backend structure
- MongoDB models
- Mongoose schemas
- Controllers
- Routes
- Services
- Middleware
- Authentication
- Authorization
- CargoListing model
- Booking model
- ProviderProfile model
- TransportUnit model
- Trader dashboard
- Provider dashboard
- Cargo search
- Cargo details
- Existing booking flow
- Existing payment flow
- Existing capacity protection
- Existing Socket.IO implementation
- Existing tests

Do not make changes during exploration.

---

## Phase 2 — Plan

Create an implementation plan containing:

- Files to modify
- Files to create
- Database changes
- API changes
- Matching algorithm
- Optimization algorithm
- UI changes
- Testing strategy
- Demo data requirements

The implementation must fit naturally into the existing architecture.

Do not redesign unrelated parts of the application.

---

## Phase 3 — Execute

After the plan is reviewed/approved:

Implement the features.

Keep the existing application functional.

---

## Phase 4 — Verify

After implementation:

- Run TypeScript checks
- Run lint
- Run tests
- Run production builds
- Start frontend
- Start backend
- Test APIs
- Test trader matching
- Test provider optimization
- Test offer flow
- Test booking
- Test payment
- Test capacity protection
- Fix all critical errors

Do not assume generated code works without verification.

---

# 3. Product Concept

SmartCargoSpace should become a two-sided intelligent logistics marketplace.

## Trader Side

```text
Cargo Requirements
        ↓
Intelligent Matching
        ↓
Best Available Container
        ↓
Explainable Recommendation
        ↓
Book Space
        ↓
Payment
        ↓
Shipment