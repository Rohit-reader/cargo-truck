# SmartCargoSpace

## MERN Prototype Product Requirements Document

**Project Type:** Logistics Marketplace
**Version:** 1.0
**Platform:** Web Application
**Frontend:** React + Vite + TypeScript
**Backend:** Node.js + Express + TypeScript
**Database:** MongoDB + Mongoose
**Authentication:** JWT + bcrypt
**Real-Time Communication:** Socket.IO
**UI Theme:** Light only

---

# 1. Product Overview

SmartCargoSpace is a digital logistics marketplace that connects small exporters and importers with logistics service providers that have unused cargo capacity.

The platform allows traders to find partially filled cargo containers or other transport capacity, compare available options, reserve space, make online payments, communicate with logistics providers, and track their shipments.

The core idea is:

> **Small consignments should not require booking an entire container.**

The application makes unused cargo capacity discoverable and bookable through a single platform.

---

# 2. Problem Statement

Small exporters frequently face high transportation costs because they may not have enough goods to fill an entire container.

Current challenges include:

* Difficulty finding partially filled containers
* Lack of visibility into available cargo space
* Dependence on phone calls and brokers
* Manual quotation and booking
* Limited price comparison
* Poor visibility of logistics providers
* Manual payment processes
* Limited communication history
* Difficulty tracking shipments

SmartCargoSpace provides a centralized digital marketplace for available cargo capacity.

---

# 3. Product Goals

The prototype must allow:

1. Traders to register themselves.
2. Logistics providers to apply for registration.
3. Administrators to verify logistics providers.
4. Approved providers to publish available cargo capacity.
5. Traders to search available cargo space.
6. Traders to view container details.
7. Traders to book available capacity.
8. Traders to make online or simulated payments.
9. Providers to receive bookings.
10. Traders and providers to communicate through chat.
11. Providers to update shipment status.
12. Traders to track shipments.
13. Administrators to monitor the platform.

---

# 4. Primary Users

## 4.1 Trader

A trader can be:

* Exporter
* Importer
* SME
* Manufacturer
* Distributor

Trader capabilities:

* Self-registration
* Login
* Search cargo space
* Filter cargo listings
* View provider information
* View container details
* Book cargo space
* Make payment
* View booking history
* Track shipments
* Chat with providers
* Submit reviews

Traders do not require manual inspection.

---

## 4.2 Logistics Provider

Examples:

* Shipping company
* Road logistics company
* Rail logistics company
* Air cargo provider
* Freight forwarder
* Multimodal logistics provider

Provider capabilities:

* Apply for registration
* Submit company information
* Upload verification documents
* Wait for admin approval
* Add transport units
* Publish cargo capacity
* Manage available capacity
* View bookings
* Update shipment status
* Chat with traders
* View payments
* View analytics

Only approved providers can publish cargo capacity.

---

## 4.3 Administrator

Administrator capabilities:

* Login
* View provider applications
* Review provider information
* Review documents
* Approve providers
* Reject providers
* Suspend providers
* View traders
* View providers
* View cargo listings
* View bookings
* View payments
* View disputes
* View analytics
* View audit logs

Admin accounts must not have public registration.

---

# 5. User Roles

Use exactly three roles:

```text
TRADER
PROVIDER
ADMIN
```

---

# 6. Authentication Requirements

Implement:

* Registration
* Login
* Logout
* Current user session
* Password hashing
* JWT authentication
* Protected routes
* Role-based authorization

Passwords must never be stored as plaintext.

Use:

```text
bcryptjs
jsonwebtoken
```

---

# 7. Authorization Requirements

Authorization must be implemented on the **backend**.

Do not depend only on frontend route protection.

The backend must verify:

1. User is authenticated.
2. User has the required role.
3. User owns the requested resource where applicable.

Example:

A trader must not be able to access another trader's booking by changing:

```text
/api/bookings/:id
```

A provider must not be able to modify another provider's cargo listing.

A provider must not be able to approve itself.

A trader must not be able to access admin APIs.

---

# 8. Authorization Model

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
| Suspend Provider     |     No |       No |   Yes |
| View All Users       |     No |       No |   Yes |
| View All Payments    |     No |       No |   Yes |
| Chat                 |    Yes |      Yes |   Yes |
| Update Shipment      |     No |      Yes |   Yes |

---

# 9. UI Design

## Theme

The application must use a **light theme only**.

Do not implement dark mode.

Use:

* White
* Light gray
* Dark navy
* Blue
* Green
* Amber
* Red

Design characteristics:

* Clean
* Professional
* Modern
* Minimal
* Logistics/SaaS style
* Responsive
* Clear information hierarchy

Avoid:

* Neon colors
* Excessive gradients
* Gaming-style interfaces
* Dark dashboards
* Excessive animations
* Unnecessary decorative elements

---

# 10. Frontend Naming Rule

Visible frontend text must never use underscores.

Use:

```text
Available Cargo
Book Space
Provider Dashboard
My Bookings
Shipment Tracking
Payment History
Search Cargo
Available Capacity
Transport Mode
```

Never display:

```text
available_cargo
book_space
provider_dashboard
my_bookings
shipment_tracking
payment_history
```

Backend property names may use camelCase.

Example:

```text
Frontend:
Available Cargo

Backend:
availableWeight
```

---

# 11. Landing Page

Create a professional landing page.

## Hero

### Find Space. Ship Smarter.

Subtitle:

> Book unused cargo capacity from verified logistics providers.

Primary button:

**Find Cargo Space**

Secondary button:

**Become a Logistics Provider**

---

## Landing Page Sections

Include:

* How It Works
* Transport Modes
* Popular Routes
* Verified Providers
* Platform Statistics
* Why SmartCargoSpace
* FAQ
* Footer

---

# 12. Main User Journey

The primary trader journey:

```text
Landing Page
      ↓
Trader Registration
      ↓
Login
      ↓
Trader Dashboard
      ↓
Search Cargo
      ↓
View Available Space
      ↓
View Cargo Details
      ↓
Book Space
      ↓
Enter Cargo Details
      ↓
Payment
      ↓
Booking Confirmation
      ↓
Chat With Provider
      ↓
Shipment Tracking
      ↓
Delivery
      ↓
Review
```

---

# 13. Provider Journey

```text
Provider Registration
        ↓
Submit Documents
        ↓
Pending Verification
        ↓
Admin Review
        ↓
Approval
        ↓
Provider Dashboard
        ↓
Create Transport Unit
        ↓
Publish Cargo Capacity
        ↓
Receive Booking
        ↓
Update Shipment
        ↓
Complete Delivery
```

---

# 14. Admin Journey

```text
Admin Login
     ↓
Admin Dashboard
     ↓
Provider Applications
     ↓
Review Documents
     ↓
Approve / Reject
     ↓
Monitor Cargo
     ↓
Monitor Bookings
     ↓
Monitor Payments
     ↓
View Analytics
```

---

# 15. Trader Registration

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

* Exporter
* Importer
* Both

Optional:

* GST Number
* Import Export Code

Trader registration requires no manual inspection.

---

# 16. Provider Registration

Fields:

### Company Information

* Company Name
* Contact Person
* Email
* Phone
* Business Address
* City
* State
* Country

### Logistics Information

* Transport Modes
* Service Locations
* Cargo Types

Transport Modes:

* Road
* Rail
* Sea
* Air
* Multimodal

### Documents

* Business Registration
* GST Certificate
* PAN
* Transport License
* Address Proof

Provider status:

```text
PENDING
UNDER_REVIEW
APPROVED
REJECTED
SUSPENDED
```

---

# 17. Provider Verification

Admin should have a Provider Applications page.

Display:

* Company Name
* Contact Person
* Transport Mode
* Registration Date
* Document Status
* Verification Status

Actions:

* View
* Approve
* Reject
* Request More Information
* Suspend

Only:

```text
APPROVED
```

providers can publish cargo capacity.

---

# 18. Cargo Capacity

Providers can create available cargo listings.

Fields:

* Transport Mode
* Container Type
* Container Number
* Origin
* Destination
* Departure Date
* Estimated Arrival
* Total Weight Capacity
* Available Weight
* Total Volume
* Available Volume
* Price
* Accepted Cargo Type

Container Types:

```text
20 FT
40 FT
40 FT High Cube
Other
```

---

# 19. Cargo Listing

Example:

```text
Chennai → Dubai

Sea

Departure:
15 September 2026

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

Actions:

* View Details
* Book Space
* Chat

---

# 20. Search

Create a large cargo search interface.

Fields:

* From
* To
* Transport Mode
* Departure Date
* Weight
* Volume

Button:

**Search Cargo**

---

# 21. Search Filters

Filters:

* Transport Mode
* Departure Date
* Price
* Available Weight
* Available Volume
* Provider Rating
* Distance

Sort options:

* Lowest Price
* Earliest Departure
* Highest Rated
* Most Available Space

---

# 22. Cargo Details

Cargo details page must show:

## Route

```text
Chennai
   ↓
Dubai
```

## Transport

* Transport Mode
* Departure Date
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
* Verification Badge
* Rating
* Completed Shipments
* Data Quality Score

## Pricing

```text
Base Freight
Platform Fee
Taxes
Total
```

Actions:

**Book Space**

**Chat With Provider**

---

# 23. Booking

Booking form:

* Cargo Type
* Cargo Description
* Weight
* Volume
* Number of Packages
* Package Dimensions
* Pickup Address
* Pickup Date
* Special Instructions

---

# 24. Booking Price

Calculate:

```text
Base Freight
+
Platform Fee
+
Taxes
=
Total
```

The final amount must always be calculated by the backend.

Do not trust a price sent by the frontend.

---

# 25. Capacity Protection

The system must prevent overbooking.

Example:

```text
Available:
5,000 KG

Requested:
4,000 KG
```

After successful booking:

```text
Available:
1,000 KG
```

If two users attempt to book the final capacity, the backend must ensure that only valid capacity is booked.

Frontend validation is not sufficient.

Use MongoDB atomic operations or transactions where appropriate.

---

# 26. Booking Status

Use:

```text
INITIATED
PAYMENT_PENDING
PAID
CONFIRMED
PICKUP_SCHEDULED
PICKED_UP
IN_TRANSIT
ARRIVED
DELIVERED
COMPLETED
CANCELLED
REFUNDED
```

---

# 27. Payment

The prototype should support a payment abstraction.

If real payment gateway credentials are unavailable, implement a simulated payment mode.

Payment states:

```text
PAYMENT_PENDING
SUCCESS
FAILED
REFUNDED
```

Important:

The frontend must never directly mark a booking as paid.

Payment state must be controlled by the backend.

Design the payment service so a real gateway such as Razorpay can be integrated later.

---

# 28. Booking Confirmation

After successful payment:

Display:

# Booking Confirmed

Show:

* Booking Number
* Provider
* Route
* Cargo
* Weight
* Container
* Departure Date
* Amount Paid
* Payment Status
* Booking Status

Buttons:

**View Shipment**

**Chat With Provider**

---

# 29. Trader Dashboard

Display:

* Active Bookings
* Upcoming Shipments
* Completed Shipments
* Total Spent
* Unread Messages

Recent bookings table:

| Booking | Route | Provider | Date | Amount | Status | Action |
| ------- | ----- | -------- | ---- | -----: | ------ | ------ |

---

# 30. Provider Dashboard

Display:

* Active Cargo Space
* Total Bookings
* Pending Bookings
* Revenue
* Utilization Rate
* Customer Rating

Include:

* Recent bookings
* Active cargo
* Shipment status
* Revenue chart

Use Recharts for meaningful charts.

---

# 31. Shipment Tracking

Create a visual timeline:

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

Provider can update shipment status.

Trader can view shipment status.

---

# 32. Chat

Use Socket.IO.

Chat relationship:

```text
Trader ↔ Provider
```

Chat must be associated with a booking.

Features:

* Message history
* Real-time messages
* Read status
* Unread count
* Online status
* Timestamp

Authorization:

Users can only access conversations associated with bookings they are authorized to access.

---

# 33. Admin Dashboard

Display:

* Total Traders
* Total Providers
* Pending Applications
* Approved Providers
* Active Cargo Space
* Active Bookings
* Total Payments
* Platform Revenue

Charts:

* Booking volume
* Revenue
* Popular routes
* Cargo utilization

---

# 34. Reviews

After a shipment is completed, traders can submit a review.

Rating categories:

* Overall
* Communication
* Reliability
* Pickup
* Delivery

Rating:

```text
1 to 5 stars
```

Display provider rating on cargo listings.

---

# 35. Notifications

Implement in-app notifications for:

* Provider application submitted
* Provider approved
* Provider rejected
* New booking
* Payment successful
* Booking confirmed
* Shipment status changed
* New chat message
* Booking cancelled

---

# 36. Database Models

Use MongoDB and Mongoose.

Required models:

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

Keep the schema simple for the prototype.

---

# 37. User Model

Fields:

```text
_id
name
email
phone
passwordHash
role
status
createdAt
updatedAt
```

Roles:

```text
TRADER
PROVIDER
ADMIN
```

---

# 38. Cargo Listing Model

Fields:

```text
_id
providerId
transportUnitId
origin
destination
mode
containerType
containerNumber
departureDate
arrivalDate
totalWeight
availableWeight
totalVolume
availableVolume
price
acceptedCargoTypes
status
createdAt
updatedAt
```

---

# 39. Booking Model

Fields:

```text
_id
bookingNumber
traderId
providerId
cargoListingId
cargoDetails
requestedWeight
requestedVolume
baseAmount
platformFee
tax
totalAmount
paymentStatus
bookingStatus
createdAt
updatedAt
```

---

# 40. API Design

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout
```

## Cargo

```text
GET /api/cargo
GET /api/cargo/:id
POST /api/cargo
PUT /api/cargo/:id
DELETE /api/cargo/:id
```

## Bookings

```text
POST /api/bookings
GET /api/bookings
GET /api/bookings/:id
POST /api/bookings/:id/cancel
```

## Payments

```text
POST /api/payments/create
POST /api/payments/verify
```

## Providers

```text
POST /api/providers/register
GET /api/providers/profile
POST /api/providers/documents
```

## Admin

```text
GET /api/admin/providers
POST /api/admin/providers/:id/approve
POST /api/admin/providers/:id/reject
POST /api/admin/providers/:id/suspend
GET /api/admin/bookings
GET /api/admin/payments
GET /api/admin/analytics
```

---

# 41. API Authorization

Every protected endpoint must use authentication middleware.

Example:

```text
authenticate
requireRole("ADMIN")
```

For resource access:

```text
authenticate
requireRole("PROVIDER")
verifyOwnership
```

Examples:

```text
Provider A cannot modify Provider B's cargo.

Trader A cannot view Trader B's booking.

Trader cannot call admin endpoints.

Provider cannot approve itself.

Unauthenticated user cannot access protected APIs.
```

---

# 42. Validation

Use Zod to validate:

* Registration
* Login
* Provider registration
* Cargo creation
* Cargo search
* Booking
* Payment
* Admin actions

Return consistent API responses.

Example:

```json
{
  "success": false,
  "message": "Insufficient cargo capacity"
}
```

---

# 43. Security

Implement:

* bcrypt password hashing
* JWT authentication
* Backend RBAC
* Resource ownership checks
* Helmet
* CORS
* Rate limiting
* Zod validation
* Secure file uploads
* Environment variables
* Centralized error handling

Never expose:

```text
JWT Secret
MongoDB Credentials
Payment Secret
API Keys
```

Never trust frontend values for:

```text
Role
Price
Capacity
Payment Status
Provider ID
User ID
```

---

# 44. Frontend Pages

## Public

```text
/
 /login
 /register
 /provider/register
```

## Trader

```text
/dashboard
/search
/cargo/:id
/bookings
/bookings/:id
/messages
/payments
/profile
```

## Provider

```text
/provider/dashboard
/provider/cargo
/provider/containers
/provider/bookings
/provider/shipments
/provider/messages
/provider/payments
/provider/verification
/provider/profile
```

## Admin

```text
/admin/dashboard
/admin/providers
/admin/traders
/admin/cargo
/admin/bookings
/admin/payments
/admin/analytics
/admin/audit-logs
```

---

# 45. Responsive Design

The application must support:

* Desktop
* Tablet
* Mobile

Mobile requirements:

* Sidebar becomes drawer
* Tables become responsive
* Search fields stack vertically
* Cards remain readable
* Chat works on mobile
* Booking summary remains accessible

---

# 46. Demo Data

Create seed data.

## Admin

```text
admin@smartcargo.com
```

## Trader

```text
trader@smartcargo.com
```

## Provider

```text
provider@smartcargo.com
```

Create realistic sample cargo listings.

Routes:

```text
Chennai → Dubai
Chennai → Singapore
Chennai → Colombo
Chennai → Mumbai
Coimbatore → Chennai
Bangalore → Chennai
```

Include:

* Road
* Rail
* Sea
* Air

Create at least 10 realistic cargo listings.

---

# 47. Demo Scenario

The primary demo should be:

### Step 1

Trader logs in.

### Step 2

Trader searches:

```text
From:
Chennai

To:
Dubai

Mode:
Sea

Weight:
2,000 KG
```

### Step 3

Application shows available cargo space.

### Step 4

Trader selects a partially filled container.

Example:

```text
Total Capacity:
26,000 KG

Available:
12,000 KG
```

### Step 5

Trader requests:

```text
2,000 KG
```

### Step 6

System validates capacity.

### Step 7

Trader proceeds to payment.

### Step 8

Payment succeeds.

### Step 9

Booking becomes:

```text
CONFIRMED
```

### Step 10

Available capacity becomes:

```text
10,000 KG
```

### Step 11

Provider sees the booking.

### Step 12

Trader and provider communicate through chat.

### Step 13

Provider updates shipment:

```text
PICKED_UP
```

Then:

```text
IN_TRANSIT
```

Then:

```text
DELIVERED
```

### Step 14

Trader submits a rating.

---

# 48. Project Architecture

Use:

```text
React + Vite
       ↓
Axios
       ↓
Express API
       ↓
JWT Authentication
       ↓
RBAC Authorization
       ↓
Controllers
       ↓
Services
       ↓
Mongoose
       ↓
MongoDB
```

Real-time chat:

```text
React
  ↕
Socket.IO
  ↕
Node.js
  ↕
MongoDB
```

---

# 49. Development Priority

Build in this order:

```text
1. React + Vite setup
2. Express + TypeScript setup
3. MongoDB connection
4. User authentication
5. Backend authorization
6. Trader registration
7. Provider registration
8. Admin provider approval
9. Cargo listing
10. Cargo search
11. Cargo details
12. Booking
13. Capacity protection
14. Payment prototype
15. Booking confirmation
16. Trader dashboard
17. Provider dashboard
18. Shipment tracking
19. Chat
20. Admin dashboard
21. Reviews
22. Notifications
23. Seed data
24. UI polish
25. Security testing
26. End-to-end testing
```

---

# 50. Prototype Scope

Do not spend time on advanced enterprise features in the first version.

Do not implement initially:

* Government API integration
* Customs integration
* Full GPS tracking
* Complex insurance
* Advanced accounting
* Multi-currency settlement
* Warehouse management
* Enterprise ERP integration

Keep the architecture extensible for these features later.

---

# 51. Quality Requirements

The prototype must not be a collection of static screens.

Every major feature must connect to the backend.

Do not hardcode:

* Cargo listings
* Booking counts
* Provider information
* Payment status
* Shipment status

Use MongoDB data.

Seed data may be used for the initial demonstration.

---

# 52. Loading and Error States

Every page must support:

```text
Loading
Success
Empty
Error
```

Example:

```text
No cargo space found.

Try changing your route, date or cargo requirements.

[Modify Search]
```

---

# 53. UI Components

Use reusable components for:

* Navbar
* Sidebar
* Cards
* Buttons
* Inputs
* Selects
* Tables
* Modal
* Dialog
* Status Badge
* Toast
* Loading Spinner
* Empty State
* Error State
* Booking Timeline
* Cargo Card
* Provider Card

Use Lucide React icons.

Do not use random emoji as interface icons.

---

# 54. Performance

The prototype should feel fast.

Use:

* Vite
* Efficient API requests
* Database indexes
* Pagination where appropriate
* Lazy-loaded routes where useful
* Minimal unnecessary re-renders

Vite provides fast development startup and HMR, making it appropriate for this rapid prototype workflow.

---

# 55. Testing

Test:

## Authentication

```text
Registration
Login
Invalid password
Protected routes
```

## Authorization

```text
Trader → Admin API → Denied
Provider → Admin API → Denied
Provider A → Provider B Cargo → Denied
Trader A → Trader B Booking → Denied
```

## Booking

```text
Enough capacity → Success
Insufficient capacity → Rejected
Capacity updates correctly
Cancellation restores capacity
```

## Payment

```text
Pending
Success
Failure
```

## Provider

```text
Pending Provider → Cannot publish cargo
Approved Provider → Can publish cargo
Suspended Provider → Cannot publish new cargo
```

---

# 56. Build Verification

Before declaring the prototype complete:

Run:

```text
npm run build
```

for the frontend.

Run the backend and verify all APIs.

Test:

```text
Authentication
Authorization
Cargo Search
Booking
Payment
Chat
Shipment Tracking
Admin Approval
```

Fix all build errors and runtime errors.

---

# 57. Environment Variables

Frontend:

```text
VITE_API_URL=
VITE_SOCKET_URL=
```

Backend:

```text
PORT=5000
MONGODB_URI=
JWT_SECRET=
FRONTEND_URL=
PAYMENT_KEY_ID=
PAYMENT_KEY_SECRET=
```

Never commit actual secrets.

Create:

```text
.env.example
```

---

# 58. README Requirements

The project README must contain:

* Project overview
* Features
* Technology stack
* Prerequisites
* Installation
* Environment variables
* MongoDB setup
* Frontend setup
* Backend setup
* Seed data
* Demo accounts
* API overview
* Testing
* Build
* Deployment
* Known limitations

---

# 59. Final Acceptance Criteria

The prototype is complete when:

* Trader can register.
* Trader can login.
* Provider can register.
* Provider can submit documents.
* Admin can approve provider.
* Approved provider can publish cargo.
* Trader can search cargo.
* Trader can filter cargo.
* Trader can view cargo details.
* Trader can book available space.
* Backend prevents overbooking.
* Payment flow works.
* Booking confirmation works.
* Provider receives booking.
* Trader and provider can chat.
* Provider can update shipment status.
* Trader can track shipment.
* Trader can submit review.
* Admin can monitor platform.
* Backend authorization prevents unauthorized access.
* Frontend is responsive.
* Frontend uses light theme only.
* Visible frontend text contains no underscores.
* MongoDB stores application data.
* Application builds successfully.
* Application runs locally without errors.

---

# 60. Final Product Statement

SmartCargoSpace should demonstrate the following complete business loop:

```text
Verified Logistics Provider
          ↓
Publishes Unused Cargo Space
          ↓
Small Trader Searches
          ↓
Finds Suitable Space
          ↓
Books Partial Capacity
          ↓
Pays Online
          ↓
Provider Receives Booking
          ↓
Trader Chats With Provider
          ↓
Shipment Is Tracked
          ↓
Cargo Is Delivered
          ↓
Trader Reviews Provider
```

The prototype should communicate one simple value proposition:

> **Find unused cargo space. Book only what you need. Ship more efficiently.**
