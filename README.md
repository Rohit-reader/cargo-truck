# SmartCargoSpace — MERN Prototype

SmartCargoSpace is a digital logistics marketplace that connects small exporters and importers with logistics service providers that have unused cargo capacity in partially filled containers (LCL).

---

## 🚀 Key Features Implemented

1. **Trader Flow**:
   - Trader self-registration & login.
   - Search cargo listings by Origin, Destination, Transport Mode, Date, Weight (KG), Volume (CBM).
   - Filter & sort by price, departure date, rating, and available capacity.
   - Detailed container breakdown & provider score inspection.
   - 4-step booking flow (Consignment details -> Pickup info -> Price summary -> Simulated Payment).
   - Atomic container capacity reservation (overbooking protection).
   - Post-booking confirmation with tracking reference.
   - Visual Shipment Tracking timeline (`Confirmed` -> `Pickup Scheduled` -> `Picked Up` -> `In Transit` -> `Arrived` -> `Delivered`).
   - Real-time Socket.IO chat linked to booking.

2. **Provider Flow**:
   - Provider onboarding with transport modes selection.
   - Document upload for admin verification (Business Reg, GST, Transport License).
   - Provider Dashboard with utilization charts (Recharts), earnings, active listings, and ratings.
   - Container Space Management: Publish new available capacity.
   - Order & Shipment Manager: Update delivery timeline status.

3. **Admin Flow**:
   - Admin authentication.
   - Provider Applications queue: Review documents, Approve, Reject with reason, or Suspend providers.
   - Monitor active cargo listings, bookings, payments, and system audit logs.
   - Platform analytics: Gross freight volume, revenue (5% fee), route performance.

4. **Security & Validation**:
   - Password hashing via `bcryptjs`.
   - JWT authentication & Role-Based Access Control (`TRADER`, `PROVIDER`, `ADMIN`).
   - Resource ownership checks (Traders access own bookings, Providers modify own listings).
   - Zod request body validation across all REST endpoints.
   - Light theme ONLY design system with no raw underscores in visible UI text.

---

## 🔑 Demo Login Credentials

You can test all roles using 1-click Quick Demo buttons in the top navbar or on the Login page:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Trader** | `trader@smartcargo.com` | `trader123` | Apex Global Exports (Exporter) |
| **Approved Provider** | `provider@smartcargo.com` | `provider123` | Chennai Ocean Logistics (Approved) |
| **Pending Provider** | `pending_provider@smartcargo.com` | `provider123` | Express Cargo Lines (Under Review) |
| **Admin** | `admin@smartcargo.com` | `admin123` | System Administrator |

---

## 🛠️ How to Run the Application

### Prerequisites
- Node.js (v18+)
- MongoDB Server running locally on `mongodb://127.0.0.1:27017`

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
*The backend connects to MongoDB, seeds demo users & sample cargo routes automatically, and listens on `http://localhost:5000`.*

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```
*The frontend Vite dev server will start on `http://localhost:5173`.*

---

## 📁 Repository Structure
```
cargo-truck/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── controllers/     # Auth, Cargo, Booking, Payment, Provider, Admin, Chat
│   │   ├── middleware/      # JWT Auth, RBAC, Ownership, Zod Validation, Multer Upload
│   │   ├── models/          # Mongoose Schemas (User, ProviderProfile, CargoListing, Booking, Payment, Conversation, Message, AuditLog)
│   │   ├── routes/          # Express API Routers
│   │   ├── seed/            # Seed data script
│   │   ├── socket/          # Socket.IO Real-time Chat
│   │   ├── validators/      # Zod validation schemas
│   │   └── server.ts        # Express server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, CapacityProgressBar, CargoCard, ShipmentTimeline, ChatWindow, Badge
│   │   ├── context/         # AuthContext, SocketContext
│   │   ├── pages/           # LandingPage, SearchCargoPage, BookingFlowPage, Dashboards, Admin Portal
│   │   ├── services/        # Axios API client
│   │   ├── types/           # TypeScript interfaces
│   │   ├── App.tsx          # Router layout
│   │   └── index.css        # Tailwind directives & light theme styling
│   ├── package.json
│   └── vite.config.ts
├── PRD.md
└── prompt.md
```
