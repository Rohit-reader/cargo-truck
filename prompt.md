# SmartCargoSpace — MERN Prototype Implementation Prompt

## Reference

There is an existing Product Requirements Document for this project.

**Read and use the existing PRD as the primary product specification.**

Do not redesign the business concept.

Build a fast, polished, working prototype of the SmartCargoSpace application based on that PRD.

The goal is to demonstrate the complete core business flow rather than implement every enterprise-level feature.

---

# 1. Technology Stack

Use exactly this stack.

## Frontend

* React
* Vite
* TypeScript
* React Router
* Axios
* Tailwind CSS
* Lucide React
* Recharts
* React Hook Form
* Zod
* Socket.IO Client

## Backend

* Node.js
* Express 5
* TypeScript
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Zod
* Socket.IO
* Multer
* Helmet
* CORS
* express-rate-limit

## Database

MongoDB.

Use Mongoose models and validation.

---

# 2. Prototype Priority

Prioritize a working end-to-end prototype over excessive abstraction.

The most important flow is:

Trader Registration
→ Login
→ Search Available Cargo
→ View Container
→ Select Cargo Space
→ Enter Cargo Details
→ Book Space
→ Payment
→ Booking Confirmation
→ Provider Receives Booking
→ Chat
→ Shipment Status
→ Delivery

The second important flow is:

Provider Registration
→ Submit Verification
→ Admin Review
→ Admin Approval
→ Provider Dashboard
→ Add Container
→ Publish Available Cargo Space
→ Receive Booking

The third important flow is:

Admin Login
→ Provider Applications
→ Review
→ Approve / Reject
→ Monitor Containers
→ Monitor Bookings
→ Monitor Payments

---

# 3. UI Design Direction

Create a modern logistics SaaS interface.

## Theme

Use a **light theme only**.

Do NOT implement dark mode.

Use:

* White backgrounds
* Very light gray page backgrounds
* Navy or dark blue primary text
* Blue primary actions
* Green success states
* Amber warning states
* Red error states
* Soft borders
* Subtle shadows
* Rounded cards
* Clean typography

The interface should feel like a professional logistics marketplace.

Avoid:

* Excessive gradients
* Neon colors
* Gaming-style UI
* Excessive animations
* Dark dashboards
* Overly decorative backgrounds

---

# 4. Frontend Language Rules

This is extremely important.

Never use underscores between words in visible frontend text.

Correct:

* Available Cargo
* Book Space
* Provider Dashboard
* My Bookings
* Shipment Tracking
* Payment History
* Search Cargo
* Available Capacity
* Transport Mode

Incorrect:

* available_cargo
* book_space
* provider_dashboard
* my_bookings
* shipment_tracking
* payment_history

Use natural human-readable labels everywhere in the UI.

Backend API names and JavaScript property names may use camelCase.

---

# 5. Navigation

Create role-based navigation.

## Trader

```text
Dashboard
Find Cargo
My Bookings
Shipment Tracking
Messages
Payments
Profile
```

## Provider

```text
Dashboard
My Cargo Space
Containers
Bookings
Shipments
Messages
Payments
Verification
Profile
```

## Admin

```text
Dashboard
Provider Applications
Traders
Providers
Cargo Space
Bookings
Payments
Disputes
Analytics
Audit Logs
```

Do not show navigation items that the current role cannot access.

---

# 6. Landing Page

Create a professional landing page.

Hero:

**Find Space. Ship Smarter.**

Subtitle:

**Book unused cargo capacity from verified logistics providers.**

Primary button:

**Find Cargo Space**

Secondary button:

**Become a Logistics Provider**

Include:

* How It Works
* Available Transport Modes
* Why SmartCargoSpace
* Verified Providers
* Popular Routes
* Platform Statistics
* FAQ

Keep the landing page visually clean and conversion-focused.

---

# 7. Authentication

Implement real authentication.

Roles:

```text
TRADER
PROVIDER
ADMIN
```

Registration options:

```text
Trader Registration
Provider Registration
```

Admin should not have public registration.

---

# 8. Better Authorization

Do NOT rely on frontend role checks alone.

Implement authorization on the backend.

Use:

## Authentication

JWT-based authentication.

## Password Security

Use bcryptjs.

## Authorization

Implement RBAC middleware.

Example conceptual middleware:

```text
authenticate
requireRole("ADMIN")
requireRole("PROVIDER")
requireRole("TRADER")
```

But also implement resource ownership checks.

For example:

A trader can only access their own bookings.

A provider can only modify their own cargo listings.

An admin can access all authorized resources.

A trader must not be able to call a provider endpoint simply by changing the URL.

A provider must not be able to access another provider's containers.

---

# 9. Authorization Matrix

Implement this authorization model.

| Feature              | Trader | Provider | Admin |
| -------------------- | -----: | -------: | ----: |
| Register             |    Yes |      Yes |    No |
| Login                |    Yes |      Yes |   Yes |
| Search Cargo         |    Yes |      Yes |   Yes |
| View Cargo           |    Yes |      Yes |   Yes |
| Book Cargo           |    Yes |       No |   Yes |
| Make Payment         |    Yes |       No |   Yes |
| View Own Bookings    |    Yes |      Yes |   Yes |
| Create Cargo Listing |     No |      Yes |   Yes |
| Edit Own Cargo       |     No |      Yes |   Yes |
| Approve Provider     |     No |       No |   Yes |
| Reject Provider      |     No |       No |   Yes |
| View All Users       |     No |       No |   Yes |
| View All Payments    |     No |       No |   Yes |
| Chat                 |    Yes |      Yes |   Yes |
| Update Shipment      |     No |      Yes |   Yes |

---

# 10. Token Security

Prefer secure authentication handling.

Do not store passwords anywhere in plaintext.

Do not put secrets in frontend source code.

Use environment variables.

Implement:

```text
JWT_SECRET
MONGODB_URI
```

If using cookies, use:

```text
httpOnly
secure
sameSite
```

For a prototype, maintain a clear and consistent authentication strategy.

Do not mix multiple authentication approaches unnecessarily.

---

# 11. Trader Registration

Create a simple registration page.

Fields:

* Full Name
* Company Name
* Email
* Phone
* Password
* City
* State
* Country
* Trader Type

Trader Type:

```text
Exporter
Importer
Both
```

Optional:

* GST Number
* Import Export Code

Do not require inspection for traders.

After registration:

```text
Registration Successful
→ Login
→ Trader Dashboard
```

---

# 12. Provider Registration

Create a separate provider onboarding flow.

Fields:

* Company Name
* Contact Person
* Email
* Phone
* Business Address
* City
* State
* Country
* Transport Modes

Transport modes:

```text
Road
Rail
Sea
Air
Multimodal
```

Documents can be uploaded using Multer.

Prototype document types:

```text
Business Registration
GST Certificate
PAN
Transport License
Address Proof
```

Provider status:

```text
Pending
Under Review
Approved
Rejected
Suspended
```

Initially:

```text
Pending
```

---

# 13. Admin Provider Approval

Admin dashboard should have:

**Provider Applications**

Each application should show:

* Company Name
* Contact Person
* Transport Modes
* Registration Date
* Document Status
* Verification Status

Actions:

```text
View
Approve
Reject
Request More Information
```

Only approved providers can publish cargo capacity.

---

# 14. Provider Dashboard

Create a polished provider dashboard.

Statistics:

```text
Active Cargo Space
Total Bookings
Pending Bookings
Revenue
Utilization Rate
Customer Rating
```

Include:

* Recent bookings
* Active cargo listings
* Shipment status
* Revenue chart

Use Recharts for one or two meaningful charts.

Do not overcrowd the dashboard.

---

# 15. Cargo Space Management

Provider should be able to create available cargo capacity.

Form:

```text
Transport Mode
Container Type
Container Number
Origin
Destination
Departure Date
Estimated Arrival
Total Weight Capacity
Available Weight
Total Volume
Available Volume
Price
Accepted Cargo Type
```

Container types:

```text
20 FT
40 FT
40 FT High Cube
Other
```

After creation:

```text
Available
```

---

# 16. Cargo Search

This is the most important trader screen.

Create a large search panel.

Fields:

```text
From
To
Transport Mode
Departure Date
Weight
Volume
```

Button:

**Search Cargo**

Results should display cargo cards.

Each card:

```text
Chennai → Dubai

Sea

Departure:
15 Sep 2026

Available:
12,000 KG

Available Volume:
32 CBM

Provider:
Chennai Ocean Logistics

Rating:
4.8

Price:
₹XX / KG

Verified Provider
```

Buttons:

```text
View Details
Book Space
Chat
```

---

# 17. Search Filters

Provide filters:

```text
Transport Mode
Departure Date
Price
Available Weight
Available Volume
Provider Rating
Distance
```

Sort:

```text
Lowest Price
Earliest Departure
Highest Rated
Most Available Space
```

---

# 18. Cargo Details Page

Display:

## Route

```text
Chennai
↓
Dubai
```

## Transport Information

* Transport Mode
* Departure
* Estimated Arrival
* Pickup Location
* Destination

## Capacity

* Container Type
* Total Capacity
* Available Weight
* Available Volume

## Provider

* Provider Name
* Verified badge
* Rating
* Completed shipments
* Data Quality Score

## Pricing

Show:

```text
Base Freight
Platform Fee
Taxes
Total
```

Primary CTA:

**Book Space**

Secondary CTA:

**Chat With Provider**

---

# 19. Booking Flow

Create a multi-step booking flow.

### Step 1

Cargo Details:

* Cargo Type
* Description
* Weight
* Volume
* Number of Packages
* Dimensions

### Step 2

Pickup Details:

* Pickup Address
* Pickup Date
* Special Instructions

### Step 3

Price Summary:

```text
Base Freight
Platform Fee
Taxes
Total
```

### Step 4

Confirmation:

```text
Cargo
Route
Provider
Capacity
Total Price
```

Button:

**Proceed to Payment**

---

# 20. Capacity Protection

Prevent overbooking.

Example:

```text
Available:
5,000 KG

Trader requests:
4,000 KG
```

After reservation:

```text
Available:
1,000 KG
```

Backend must validate available capacity.

Do not rely on frontend validation.

For the prototype, implement an atomic MongoDB update or transaction where practical.

The system must reject a booking if sufficient capacity no longer exists.

---

# 21. Payment Prototype

Create a payment abstraction.

For the prototype, support a simulated payment mode if real payment credentials are unavailable.

The UI should still look like a real payment flow.

Payment states:

```text
Payment Pending
Payment Successful
Payment Failed
Refunded
```

Do not fake a successful backend payment merely because the frontend button was clicked.

Payment success should be represented by a backend-controlled state.

Keep the payment service structured so Razorpay or another gateway can be connected later.

---

# 22. Booking Confirmation

After successful payment:

Display:

**Booking Confirmed**

Show:

```text
Booking Number
Provider
Route
Cargo
Weight
Container
Departure
Amount Paid
Payment Status
Booking Status
```

Button:

**View Shipment**

Button:

**Chat With Provider**

---

# 23. Trader Dashboard

Create:

```text
Welcome back

Active Bookings
Upcoming Shipments
Completed Shipments
Total Spent
Unread Messages
```

Recent bookings table:

```text
Booking
Route
Provider
Date
Amount
Status
Action
```

Use human-readable status badges.

---

# 24. Provider Booking Management

Provider can see:

```text
New Bookings
Confirmed Bookings
Active Shipments
Completed Shipments
Cancelled Bookings
```

Actions:

```text
View
Confirm
Update Shipment
Chat
```

---

# 25. Shipment Tracking

Create a visual shipment timeline.

Example:

```text
Booking Confirmed
       ↓
Cargo Pickup Scheduled
       ↓
Cargo Picked Up
       ↓
In Transit
       ↓
Arrived at Destination
       ↓
Delivered
```

Provider can update the shipment state.

Trader can only view the shipment state.

---

# 26. Chat

Use Socket.IO.

Implement:

```text
Trader ↔ Provider
```

Chat should be linked to a booking.

UI:

```text
Conversation List
Message Area
Message Input
Send Button
```

Include:

* Timestamp
* Read state
* Unread count
* Online indicator

Users must only access conversations belonging to their authorized bookings.

---

# 27. Admin Dashboard

Create a professional admin dashboard.

Statistics:

```text
Total Traders
Total Providers
Pending Applications
Approved Providers
Active Cargo Space
Active Bookings
Total Payments
Platform Revenue
```

Charts:

* Booking volume
* Revenue
* Popular routes
* Cargo utilization

---

# 28. Admin Provider Verification

Create:

**Provider Applications**

Table:

```text
Company
Transport Mode
Submitted
Verification
Data Quality
Status
Action
```

Admin can:

```text
View
Approve
Reject
Suspend
```

Only admins can perform these actions.

---

# 29. Demo Data

The prototype must work immediately after setup.

Create seed/demo data.

Create:

### Admin

```text
admin@smartcargo.com
```

### Trader

```text
trader@smartcargo.com
```

### Approved Provider

```text
provider@smartcargo.com
```

Create realistic sample cargo listings:

```text
Chennai → Dubai
Chennai → Singapore
Chennai → Colombo
Chennai → Mumbai
Coimbatore → Chennai
Bangalore → Chennai
```

Include:

* Different transport modes
* Different prices
* Different capacity
* Different departure dates
* Different providers

Do not expose demo passwords in the production application UI.

Document demo credentials only in the development README.

---

# 30. API Design

Use REST APIs.

Authentication:

```text
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

Cargo:

```text
GET /api/cargo
GET /api/cargo/:id
POST /api/cargo
PUT /api/cargo/:id
DELETE /api/cargo/:id
```

Bookings:

```text
POST /api/bookings
GET /api/bookings
GET /api/bookings/:id
POST /api/bookings/:id/cancel
```

Payments:

```text
POST /api/payments/create
POST /api/payments/verify
```

Providers:

```text
POST /api/providers/register
GET /api/providers/profile
POST /api/providers/documents
```

Admin:

```text
GET /api/admin/providers
POST /api/admin/providers/:id/approve
POST /api/admin/providers/:id/reject
GET /api/admin/bookings
GET /api/admin/payments
GET /api/admin/analytics
```

---

# 31. Backend Validation

Every important API request must be validated using Zod.

Validate:

* Registration
* Login
* Cargo creation
* Cargo search
* Booking
* Payment
* Provider application
* Admin actions

Return consistent error responses.

Example:

```json
{
  "success": false,
  "message": "Insufficient cargo capacity"
}
```

---

# 32. Security

Implement:

* bcrypt password hashing
* JWT authentication
* Role-based authorization
* Resource ownership checks
* Helmet
* CORS
* Rate limiting
* Input validation
* Secure file upload validation
* Environment variables
* Centralized error handling

Never trust:

* Frontend role
* Frontend price
* Frontend capacity
* Frontend payment status
* User supplied provider ID

The backend must independently validate these values.

---

# 33. Database Models

Create only the models required for the prototype.

```text
User
TraderProfile
ProviderProfile
ProviderDocument
TransportUnit
CargoListing
Booking
Payment
Conversation
Message
Notification
Review
AuditLog
```

Do not over-engineer the schema.

---

# 34. Frontend State

Use a simple architecture.

Use:

* React Context for authentication where appropriate
* TanStack Query if needed for server state
* Local state for simple UI state

Do not introduce Redux unless genuinely necessary.

---

# 35. Error Handling

Every page must handle:

```text
Loading
Success
Empty
Error
```

Example empty state:

**No cargo space found**

Subtitle:

**Try changing your route, date or cargo requirements.**

Button:

**Modify Search**

---

# 36. Responsive Design

The application must work on:

```text
Desktop
Tablet
Mobile
```

On mobile:

* Sidebar becomes a drawer
* Tables become cards or horizontally scrollable
* Search form stacks vertically
* Booking summary remains readable
* Chat works properly

---

# 37. Visual Quality

Do not produce a generic CRUD dashboard.

Use:

* Good spacing
* Consistent typography
* Clear hierarchy
* Professional cards
* Status badges
* Meaningful icons
* Good empty states
* Proper form validation
* Toast notifications
* Confirmation dialogs

Use Lucide icons.

Avoid random emoji as UI icons.

---

# 38. Prototype Simplifications

Do NOT spend excessive time implementing:

* Real government API integrations
* Real customs integration
* Complex insurance
* Full GPS tracking
* Complex warehouse management
* Multi-currency settlement
* Enterprise accounting
* Advanced AI

These can remain future extensions.

The prototype must instead make the core marketplace flow excellent.

---

# 39. Demo Experience

The application must be demo-ready.

A judge should be able to understand the product within 30 seconds.

The main story should be:

**A small exporter needs only 2,000 KG of space.**

They search:

```text
Chennai → Dubai
2,000 KG
Sea
```

The application shows partially filled containers.

The trader selects one.

They see:

```text
12,000 KG Available
```

They book:

```text
2,000 KG
```

The system updates:

```text
10,000 KG Available
```

The trader completes payment.

The booking becomes:

```text
Confirmed
```

The provider sees the booking.

The trader and provider chat.

The provider updates shipment status.

The trader tracks the shipment.

This entire flow must work without manually editing the database.

---

# 40. Development Rules for Antigravity

Before writing code:

1. Read the existing PRD.
2. Inspect the current project.
3. Determine whether frontend and backend already exist.
4. Do not overwrite working code unnecessarily.
5. Identify missing dependencies.
6. Create a short implementation plan.

Then implement in milestones.

Do not generate the entire application blindly in one pass.

After each major milestone:

```text
Run the application
Check for errors
Fix errors
Continue
```

---

# 41. Implementation Order

Use this order:

```text
1. Project setup
2. MongoDB connection
3. User model
4. Authentication
5. Authorization
6. Trader registration
7. Provider registration
8. Admin approval
9. Cargo listings
10. Search
11. Cargo details
12. Booking
13. Payment prototype
14. Booking confirmation
15. Provider dashboard
16. Trader dashboard
17. Shipment tracking
18. Chat
19. Admin dashboard
20. Reviews
21. Notifications
22. Seed data
23. UI polish
24. Security audit
25. End-to-end testing
```

---

# 42. Final Verification

Before considering the prototype complete, test:

### Trader

```text
Register
Login
Search Cargo
View Cargo
Book Cargo
Pay
View Booking
Chat
Track Shipment
```

### Provider

```text
Register
Submit Verification
Login
View Approval Status
Create Cargo
View Booking
Update Shipment
Chat
```

### Admin

```text
Login
View Applications
Approve Provider
Reject Provider
View Cargo
View Bookings
View Payments
View Analytics
```

### Authorization

Test that:

```text
Trader cannot access admin APIs.

Trader cannot modify provider cargo.

Provider cannot access another provider's cargo.

Provider cannot approve itself.

Provider cannot access another provider's bookings.

Admin can access authorized administrative resources.

Unauthenticated users cannot access protected APIs.
```

### Booking

Test:

```text
Enough capacity → booking succeeds.

Insufficient capacity → booking rejected.

Two users booking the final capacity → only valid booking succeeds.

Payment failure → booking remains unpaid.

Cancelled booking → capacity is restored.
```

---

# 43. Final Requirement

Do not stop at creating static UI screens.

The prototype must have a working connection:

```text
React
   ↓
Axios
   ↓
Express API
   ↓
Authentication Middleware
   ↓
Authorization Middleware
   ↓
Controller
   ↓
Service
   ↓
Mongoose
   ↓
MongoDB
```

For real-time chat:

```text
React
   ↕
Socket.IO
   ↕
Express / Node
   ↕
MongoDB
```

Every major screen must use real backend data or seeded database data.

Do not hardcode the main dashboard numbers or cargo listings.

The final result should be a **working MERN logistics marketplace prototype**, not merely a UI mockup.

---

# 44. Completion Message

When implementation is complete, report:

```text
Frontend status
Backend status
Database status
Authentication status
Authorization status
Booking status
Payment status
Chat status
Admin status
Testing status
Build status
Known limitations
How to run frontend
How to run backend
Demo accounts
```

Do not claim a feature is implemented unless it has been tested.
