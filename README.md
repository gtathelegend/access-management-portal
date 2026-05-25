# Access Management Portal

![AWS](https://img.shields.io/badge/AWS-Amplify%20%26%20EB-orange?logo=amazon-aws&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-17-red?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)

Modern enterprise-grade role-based access management platform built with Angular and Node.js.

Access Management Portal is a premium SaaS-style platform that demonstrates secure authentication, RBAC, dedicated user and records management pages, analytics, responsive layout engineering, and polished async UX. The application is deployed using AWS-managed cloud services, demonstrating full-stack cloud deployment practices and production-style application delivery. It is designed to feel like a production enterprise product while remaining easy to inspect as a portfolio project.

## Project Preview

### Dashboard Overview

![Dashboard Overview](screenshots/dashboard-overview.png)

### Users Page

![Users Page](screenshots/users-page.png)

### Records Page

![Records Page](screenshots/records-page.png)

### Login

![Login Screenshot](screenshots/login.png)

### Dark Mode

![Dark Mode Screenshot](screenshots/dark-mode.png)

### Mobile Responsive

![Mobile Screenshot](screenshots/mobile.png)

## Live Demo

| Environment | Link |
| --- | --- |
| Frontend deployment | `[Amplify URL]` |
| Backend API | `[Elastic Beanstalk URL]` |
| Health check | `[Elastic Beanstalk URL]/health` |

## Project Overview

Access Management Portal is a full-stack role-based access and verification system built to simulate a real enterprise operations console. The application was created to showcase how a modern SaaS dashboard can combine authentication, user administration, analytics, async request handling, and design-system consistency in one coherent product.

The platform is structured around a clear separation of concerns:

- The frontend provides a standalone Angular 17 experience with a premium dashboard shell, reusable UI primitives, route guards, loading interceptors, skeleton states, and dark/light theme support.
- The backend exposes versioned REST APIs through Express and MongoDB/Mongoose, with JWT authentication, RBAC, controllers, services, middleware, and database validation.
- The system is optimized for recruiter visibility: it demonstrates frontend engineering depth, backend API design, responsive layout craftsmanship, and enterprise-style asynchronous UX.

The application supports:

- Authentication and session persistence
- Admin and user role separation
- User lifecycle management
- Verification records browsing
- Dashboard analytics and stats
- Artificial API delay simulation for loading-state demonstration
- Responsive SaaS layouts for desktop, tablet, and mobile

## Key Features

### Authentication

- JWT authentication
- Secure login flow
- Role-based access control
- Route guards for protected views
- Protected backend endpoints
- Persistent session handling

### Admin Features

- Dedicated user management page at `/users`
- Create, edit, disable, and delete users
- Role assignment and status management
- Dedicated records page at `/records`
- Analytics and operational stats
- Pending verification monitoring
- Overview-only admin dashboard with route shortcuts

### User Features

- Personalized dashboard overview
- Dedicated records page for verification history
- Verification status visibility
- Responsive profile-oriented layout
- Scoped access to user-specific data

### Async Processing Features

- Configurable API delay simulation
- Global loading interceptor
- Route transition loading states
- Skeleton loaders for cards, tables, charts, and sidebars
- Retry handling for transient failures
- Graceful async UX without layout jank

### UI/UX Features

- Apple-inspired visual polish
- Linear-style dashboard composition
- Responsive enterprise layouts
- Dark and light mode support
- Reusable design system primitives
- Smooth transitions and consistent spacing

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| Angular 17+ | Standalone SPA framework |
| TypeScript | Type-safe application code |
| Angular Material | UI primitives and interaction patterns |
| RxJS | Reactive data flow and async orchestration |
| SCSS | Theme tokens, layout, and component styling |

### Backend

| Technology | Purpose |
| --- | --- |
| Node.js | Server runtime |
| Express.js | REST API layer |
| JWT | Authentication and authorization |
| Mongoose | MongoDB data modeling |
| bcrypt | Password hashing |

### Database

| Technology | Purpose |
| --- | --- |
| MongoDB Atlas | Managed production database |

### Deployment

| Platform | Purpose |
| --- | --- |
| AWS Amplify | Frontend deployment |
| AWS Elastic Beanstalk | Backend deployment |

AWS Amplify provides GitHub-connected frontend hosting, CI/CD automation, HTTPS, and CDN delivery. AWS Elastic Beanstalk provides managed Node.js hosting, environment management, scaling support, and deployment automation. MongoDB Atlas remains the managed cloud database layer for secure production storage.

## Cloud Infrastructure

```text
Client Browser
  ↓
AWS Amplify
(Angular Frontend)
  ↓
AWS Elastic Beanstalk
(Node.js API)
  ↓
MongoDB Atlas
```

The frontend is served by AWS Amplify and calls the backend through environment-configured API URLs. Elastic Beanstalk runs the Express API, applies production environment variables, and forwards database operations to MongoDB Atlas. This keeps the presentation, application, and data tiers clearly separated while remaining easy to operate in AWS.

### AWS Amplify

- Frontend hosting for the Angular application
- GitHub-based CI/CD integration
- Automatic HTTPS provisioning
- CDN-backed delivery for improved performance

### AWS Elastic Beanstalk

- Managed Node.js hosting for the backend API
- Environment variable management
- Deployment automation and rollback support
- Managed infrastructure with scaling capabilities

### MongoDB Atlas

- Managed cloud database platform
- Secure connection string-based access
- Scalable storage and operational visibility
- Production-friendly hosted database service

## Architecture

### Frontend Architecture

The frontend uses Angular 17 standalone architecture with a modular feature layout. Shared UI behavior is centralized through reusable components, while route-specific behavior remains isolated in feature modules.

```txt
src/app
├── core
├── shared
├── features
└── layouts
```

#### Folder Responsibilities

| Folder | Responsibility |
|---|---|
| `core` | Authentication, API services, guards, interceptors, models, and global application logic |
| `shared` | Reusable UI primitives, skeletons, modal shells, tables, buttons, and cross-feature components |
| `features` | Business pages such as auth, dashboard, analytics, users, records, and settings |
| `layouts` | App shell, top navigation, sidebar, and structural layout composition |

### Backend Architecture

The backend uses an enterprise-style layered structure that keeps routing, business rules, and data access separate.

```txt
src
├── controllers
├── services
├── middleware
├── routes
├── models
└── config
```

#### Folder Responsibilities

| Folder | Responsibility |
|---|---|
| `controllers` | HTTP request/response handling |
| `services` | Business logic and database aggregation |
| `middleware` | Authentication, authorization, rate limiting, logging, delays, and error handling |
| `routes` | Versioned REST route registration |
| `models` | Mongoose schemas and data validation |
| `config` | Environment, database, and app configuration |

### System Design

```mermaid
flowchart LR
  A[Angular UI] --> B[HTTP Interceptors]
  B --> C[Express API /api/v1]
  C --> D[Controllers]
  D --> E[Services]
  E --> F[Mongoose Models]
  F --> G[MongoDB Atlas]
```

## System Design

### Authentication Flow

1. The user submits credentials through the login form.
2. The backend validates the request and compares the password with bcrypt.
3. On success, a JWT is issued and stored client-side for session persistence.
4. Angular guards block unauthorized routes on the frontend.
5. The auth interceptor attaches the bearer token to protected requests.

### API Flow

1. The frontend calls the appropriate `/api/v1/*` endpoint through typed services.
2. The loading interceptor tracks request counts and route transitions.
3. The Express router forwards the request to a controller.
4. The controller delegates to a service for business logic.
5. The service queries MongoDB through Mongoose models and returns a normalized payload.

### RBAC Flow

- Users authenticate through JWT.
- Route guards and middleware verify role claims.
- Admin endpoints are blocked for non-admin users.
- User-specific pages only expose the current user’s scoped data.

### Async Handling Architecture

- The loading interceptor drives the global loading bar and spinner.
- Skeleton loaders preserve layout stability while requests are pending.
- Retry handling gives users a clear recovery path when requests fail.
- Artificial delay support makes loading states visible for demos and QA.

## UI/UX Design Philosophy

This project intentionally follows an Apple-inspired enterprise aesthetic with a Linear-style dashboard structure.

### Design Principles

- Semantic CSS variables are used for all themes, surfaces, borders, and accent colors.
- Layout spacing is token-driven to preserve rhythm across screens.
- Typography hierarchy emphasizes clarity, hierarchy, and quiet confidence.
- Dark mode uses the same layout and spacing system as light mode to avoid shifts.
- Components are designed to be reusable, consistent, and accessible.

### UI Goals

- Premium enterprise feel
- High information density without visual clutter
- Strong visual hierarchy
- Responsive behavior without layout jumps
- Accessible contrast in both themes

## Security

Security is handled with production-oriented controls across the stack.

- JWT protects authenticated routes and API access.
- Passwords are hashed with `bcrypt` before storage.
- Protected routes require valid bearer tokens.
- `helmet` hardens HTTP headers.
- `express-rate-limit` reduces brute-force login abuse.
- Environment variables keep secrets out of source control.

## Performance Optimizations

- Standalone Angular components reduce module overhead.
- Lazy-loaded feature routes improve initial page load behavior.
- Reusable shared components prevent duplication.
- Pagination keeps large datasets manageable.
- RxJS operators are used to debounce, compose, and stabilize async interactions.
- API delay simulation is isolated so UX testing does not pollute business logic.

## Responsiveness

The application is engineered for desktop, tablet, and mobile use.

- Desktop layouts use balanced dashboard grids and roomy content widths.
- Tablet layouts collapse the sidebar and stack dashboard content appropriately.
- Mobile layouts use a drawer sidebar, compact navbar, and full-width dialogs.
- Tables use horizontal scrolling and sticky headers instead of clipping content.
- Dialogs adapt to viewport size and become fullscreen on small screens.

## Dark Mode

Dark mode is built on a centralized CSS variable system rather than duplicated style branches.

- Semantic tokens define surface, border, text, and accent colors.
- Theme switching updates the root class without disturbing layout geometry.
- The dark palette is tuned for contrast, legibility, and a macOS-like visual tone.
- Component shadows and borders are adjusted so elevation feels natural in both modes.

## API Documentation

All endpoints are served under `/api/v1`.

### Common Response Shape

```json
{
  "success": true,
  "statusCode": 200,
  "data": {}
}
```

### Auth Headers

```txt
Authorization: Bearer <JWT>
```

### Auth APIs

#### POST `/api/v1/auth/login`

Authenticates a user and returns a JWT plus user profile data.

Request:

```json
{
  "email": "admin@portal.com",
  "password": "admin123"
}
```

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "<user-id>",
      "name": "Admin User",
      "email": "admin@portal.com",
      "role": "admin"
    }
  }
}
```

### User APIs

#### GET `/api/v1/users`

Returns a paginated user list with search and filtering.

Request query:

```txt
page=1&limit=10&q=admin&role=admin&status=active
```

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "items": [],
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

#### POST `/api/v1/users`

Creates a new user.

Request:

```json
{
  "name": "New User",
  "email": "new@portal.com",
  "password": "SecurePass123",
  "role": "user",
  "status": "active"
}
```

Response:

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": "<id>",
    "name": "New User",
    "email": "new@portal.com",
    "role": "user",
    "status": "active"
  }
}
```

#### PUT `/api/v1/users/:id`

Updates an existing user.

Request:

```json
{
  "name": "Updated User",
  "role": "admin",
  "status": "active"
}
```

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "<id>",
    "name": "Updated User"
  }
}
```

#### DELETE `/api/v1/users/:id`

Deletes a user.

Response:

```json
{
  "success": true,
  "statusCode": 204,
  "data": null
}
```

### Record APIs

#### GET `/api/v1/records`

Returns paginated verification records.

Request query:

```txt
page=1&limit=10&status=pending&sortBy=createdAt&sortOrder=desc
```

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "items": [],
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

### Stats APIs

#### GET `/api/v1/stats`

Returns a consolidated dashboard stats payload for the admin analytics surface.

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "totalUsers": 120,
    "activeUsers": 108,
    "adminCount": 8,
    "pendingVerifications": 14,
    "disabledUsers": 12,
    "recentActivityCount": 31,
    "verificationStats": {
      "roleDistribution": [
        { "name": "admin", "value": 8 },
        { "name": "user", "value": 112 }
      ],
      "statusBreakdown": [
        { "name": "approved", "value": 92 },
        { "name": "pending", "value": 14 },
        { "name": "rejected", "value": 14 }
      ],
      "verificationTrends": [
        { "name": "2026-05-24", "value": 6 }
      ]
    }
  }
}
```

> Note: the backend also keeps `/api/v1/analytics/dashboard-stats` as a compatibility alias that returns the same payload.

## Database Schema

### User Schema

The `User` collection stores authentication and lifecycle state.

Key fields:

- `name`
- `email`
- `password`
- `role` (`admin` or `user`)
- `status` (`active` or `disabled`)
- timestamps

Example:

```json
{
  "name": "Admin User",
  "email": "admin@portal.com",
  "password": "<hashed-password>",
  "role": "admin",
  "status": "active",
  "createdAt": "2026-05-24T10:00:00.000Z",
  "updatedAt": "2026-05-24T10:00:00.000Z"
}
```

### Record Schema

The `Record` collection stores verification and access records.

Key fields:

- `userId`
- `verificationType`
- `status` (`pending`, `approved`, `rejected`)
- `approvedBy`
- `accessLevel`
- timestamps

Example:

```json
{
  "userId": "6650f2a8d8d5e4b9c1b9a123",
  "verificationType": "Identity Verification",
  "status": "pending",
  "approvedBy": null,
  "accessLevel": "standard",
  "createdAt": "2026-05-24T10:00:00.000Z",
  "updatedAt": "2026-05-24T10:00:00.000Z"
}
```

### Role System

- `admin` users manage the portal, users, and analytics.
- `user` accounts are limited to their own profile and record views.

## Installation

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas cluster

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Seed the Database

```bash
cd backend
npm run seed
```

## Environment Variables

### Backend `.env.example`

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
JWT_SECRET=replace-with-a-strong-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:4200
BCRYPT_SALT_ROUNDS=12
```

### Frontend `.env.example`

```env
API_BASE_URL=http://localhost:3000/api/v1
```

## Deployment

### Frontend on AWS Amplify

1. Connect the repository to AWS Amplify.
2. Set `API_BASE_URL` to the deployed backend base URL including `/api/v1`.
3. Deploy the Angular frontend.

### Backend on AWS Elastic Beanstalk

1. Create an Elastic Beanstalk Node.js environment for the `backend` folder.
2. Set the backend environment variables listed above.
3. Use the production start command from the backend package.

### MongoDB Atlas

1. Create an Atlas cluster.
2. Add a database user and whitelist your IP or use 0.0.0.0/0 for controlled demos.
3. Copy the connection string into `MONGODB_URI`.

## Dummy Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@portal.com` | `admin123` |
| User | `user@portal.com` | `user123` |

## Screenshots

### Login Page

![Login Page](screenshots/login.png)

### Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

### User Dashboard

![User Dashboard](screenshots/user-dashboard.png)

### Dark Mode

![Dark Mode](screenshots/dark-mode.png)

### Mobile Layout

![Mobile Layout](screenshots/mobile.png)

## Future Enhancements

- Audit log history
- WebSocket live updates
- In-app notifications
- Docker containerization
- ECS migration
- CloudWatch monitoring
- CI/CD enhancements
- Infrastructure as Code
- Auto-scaling policies
- Expanded analytics and forecasting

## Engineering Highlights

This project was designed to demonstrate real engineering decisions rather than a superficial CRUD demo.

### Why Standalone Angular Architecture

- Reduces framework overhead and keeps the application composition explicit.
- Encourages highly reusable feature and UI components.
- Makes lazy loading and route-level organization more straightforward.
- Fits well with a modern enterprise dashboard where independent feature composition matters.

### Why a Modular Backend Architecture

- Separates routing, business logic, and persistence concerns.
- Makes the API easier to scale, test, and extend.
- Keeps controller logic thin and service logic reusable.
- Supports clear ownership of auth, user, record, and analytics domains.

### Why Async Simulation Matters

- Demonstrates that the frontend can handle real-world latency gracefully.
- Makes loading states, retry states, and skeleton states visible during review.
- Proves that the UI remains stable while requests are pending.
- Shows production-minded UX thinking rather than optimistic mock-data rendering.

## License

This project is licensed under the MIT License.


## Overview

The application is split into two parts:

- `frontend/`: Angular 17 standalone SPA with Angular Material, SSR/prerender support, responsive dashboards, and global HTTP interceptors.
- `backend/`: Express + TypeScript API with JWT authentication, role authorization, MongoDB/Mongoose models, and modular service/controller architecture.

The backend exposes versioned REST endpoints under `/api/v1`, while the frontend consumes those APIs through environment-configured service clients.

## Deployed Links

- Frontend (AWS Amplify): `[Amplify URL]`
- Backend API (AWS Elastic Beanstalk): `[Elastic Beanstalk URL]`
  - Base path: `/api/v1` (example health check: `[Elastic Beanstalk URL]/api/v1/health`)

## Features

### Authentication and Authorization

- JWT-based sign-in
- Persistent session handling
- Route protection for authenticated users
- Admin-only authorization for management pages and APIs

### User Dashboard (Role: `user`)

- Personal profile summary
- Verification records table (scoped to the logged-in user)
- Sorting + pagination, plus client-side quick filtering
- Loading skeletons, empty states, and retry UI

### Admin Dashboard (Role: `admin`)

- Summary stats (total users, active users, admin count, pending verifications)
- User directory with:
  - Server-side pagination
  - Search by name/email (`q`)
  - Role/status filters
  - Create/edit/delete flows (dialogs + confirmation)

### Async UX

- Global loading spinner
- Progress bar feedback
- Request retry handling
- Error retry UI
- Artificial API delay simulation for testing loading states

### Analytics

- Requests by status (pie chart)
- Verification trends (bar chart, last 30 points)
- Role distribution (horizontal bar chart)

### Deployment Ready

- AWS Amplify frontend hosting
- Elastic Beanstalk backend deployment
- Production environment variable handling
- Environment-based API base URL handling

## Dashboards and Behaviors

### Navigation / Routing

- Unauthenticated users are redirected to `/auth/login` (with a `returnUrl` query param).
- After login, `/dashboard` redirects based on role:
  - `admin` → `/dashboard/admin`
  - `user` → `/dashboard/user`
- Admin-only routes are protected via a role guard (non-admins are redirected back to `/dashboard`).
- `/users` is admin-only and `/records` is available to both `admin` and `user` roles.

### Admin Dashboard (`/dashboard/admin`)

- “Operations console” overview cards are calculated from API totals (users + pending verifications).
- The dashboard now shows overview snapshots rather than the full CRUD directory.
- Quick actions route to `/users` and `/records` for full management.
- Empty states and retry UI are shown when the API is unreachable.

### User Dashboard (`/dashboard/user`)

- Shows a compact snapshot of the logged-in user’s verification records.
- Supports quick filtering on the loaded subset and includes a shortcut to `/records`.
- Includes loading states, empty states, and a retry action.

### Analytics (`/analytics`)

- Charts are driven by `/api/v1/analytics/dashboard-stats`:
  - Requests by status
  - Verification trends
  - Role distribution

### Notes

- `/users` and `/records` are now dedicated management pages, while the dashboards are overview-only.
- SSR/prerender paths avoid making API calls while rendering on the server (browser-only fetch).

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Angular 17, TypeScript, RxJS, Angular Material, SCSS, NGX Charts |
| Backend | Node.js, Express, TypeScript, Mongoose, JWT, bcryptjs |
| Database | MongoDB Atlas / MongoDB Cluster |
| Tooling | ESLint, Prettier, tsx, Angular CLI |

## Architecture

### Frontend Architecture

```txt
src/app
├── core
│   ├── services
│   ├── guards
│   ├── interceptors
│   └── models
├── features
│   ├── auth
│   ├── dashboard
│   ├── users
│   ├── records
│   └── analytics
├── layouts
└── shared
```

### Backend Architecture

```txt
backend/src
├── config
├── controllers
├── middleware
├── models
├── routes
├── services
├── scripts
└── utils
```

### Request Flow

```mermaid
flowchart LR
  A[Angular UI] --> B[HTTP Interceptors]
  B --> C[Express API /api/v1]
  C --> D[Controllers]
  D --> E[Services]
  E --> F[Mongoose Models]
  F --> G[MongoDB Cluster]
```

## Folder Structure

```txt
access-management-portal
├── backend
│   ├── src
│   └── package.json
├── frontend
│   ├── src
│   ├── angular.json
│   └── package.json
├── amplify.yml
└── README.md
```

## API Documentation

All API routes are served under `/api/v1`.

### Response Conventions

- Success responses return normal JSON payloads (varies by endpoint).
- Error responses use:

```json
{ "success": false, "message": "..." }
```

### Pagination

List endpoints return a standard pagination shape:

```json
{
  "items": [],
  "page": 1,
  "limit": 20,
  "total": 0,
  "totalPages": 1
}
```

### Auth Headers

Authenticated routes require a bearer token:

```txt
Authorization: Bearer <JWT>
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/login` | Sign in with email and password |

Request body:

```json
{
  "email": "admin@amp.local",
  "password": "Admin@1234"
}
```

Response body:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "<id>",
    "name": "System Admin",
    "email": "admin@amp.local",
    "role": "admin"
  }
}
```

### Users

Admin-only endpoints.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/users` | List users with pagination, filtering, and search |
| POST | `/api/v1/users` | Create a new user |
| PUT | `/api/v1/users/:id` | Update a user |
| DELETE | `/api/v1/users/:id` | Delete a user |

Query parameters supported by `GET /users`:

- `page`
- `limit`
- `role`
- `status`
- `q`

Notes / behaviors:

- `limit` is clamped to `1..100`.
- Search (`q`) matches user `name` and `email` (case-insensitive).
- Creating a user with an existing email returns `409`.

### Records

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/records` | List access records with pagination and filtering |
| GET | `/api/v1/records/:id` | Get a specific record |

Supported filters include:

- `page`
- `limit`
- `sortBy`
- `sortOrder`
- `status`
- `verificationType`
- `accessLevel`
- `userId`
- `approvedBy`
- `createdFrom`
- `createdTo`

Notes / behaviors:

- Non-admin users are automatically scoped to their own records (even if `userId` is provided).
- Admin users can use `userId` to scope records; invalid `userId` returns `400`.
- If a non-admin requests someone else’s record by id, the API returns `404` (to avoid leaking existence).
- `createdFrom` / `createdTo` must be valid dates or the API returns `400`.

### Analytics

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/analytics/dashboard-stats` | Dashboard statistics for the analytics page |

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/health` | Health and readiness check |

### Common Error Cases

- `401 Unauthorized`: missing/invalid/expired JWT (protected routes).
- `403 Forbidden`: authenticated but not allowed (admin-only routes).
- `404 Not Found`: resource not found (also used for record access control to avoid leaks).
- `409 Conflict`: email already in use (create/update user).
- `400 Bad Request`: invalid IDs, invalid dates, or invalid request payloads.

## Setup Instructions

### 1. Clone and install dependencies

```bash
git clone https://github.com/gtathelegend/access-management-portal
cd access-management-portal
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure backend environment

Create a `backend/.env` file with the variables listed below.

### 3. Seed the database

```bash
cd backend
npm run seed
```

After seeding, you can sign in with these demo accounts:

See: [Test Credentials](#test-credentials)

### 4. Run locally

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm start
```

## Deployment Instructions

### Frontend on AWS Amplify

- Production builds use `frontend/src/environments/environment.production.ts`
- The frontend reads its API base URL from `environment.apiUrl`
- On AWS Amplify, the API base URL is injected at build time via `API_BASE_URL`

Steps:

1. Connect the repository to AWS Amplify.
2. Set `API_BASE_URL` to your Elastic Beanstalk backend base URL, including `/api/v1`.
  - Example: `[Elastic Beanstalk URL]/api/v1`
3. Redeploy the frontend.

If `API_BASE_URL` is not set, the build falls back to `/api/v1` (which will hit the same host as the frontend).

Production build:

```bash
cd frontend
npm run build
```

### Backend on AWS Elastic Beanstalk

Deploy the Express API to AWS Elastic Beanstalk and set the required environment variables.

Recommended runtime settings:

- `NODE_ENV=production`
- `PORT=<your-host-provided-port>`
- `MONGODB_URI=<your MongoDB Atlas connection string>`
- `JWT_SECRET=<a strong random secret>`
- `JWT_EXPIRES_IN=<token lifetime, for example 7d>`
- `CLIENT_URL=<your Amplify origin>`

Elastic Beanstalk manages the Node.js runtime, deployment automation, and environment provisioning for the API.

## Environment Variables

### Backend

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | Yes | Server port exposed by Elastic Beanstalk |
| `NODE_ENV` | Yes | Must be `development`, `test`, or `production` |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs |
| `JWT_EXPIRES_IN` | Yes | JWT expiration, for example `7d` |
| `CLIENT_URL` | Yes | Allowed frontend origin for CORS |
| `BCRYPT_SALT_ROUNDS` | No | Password hashing cost, defaults to `12` |

### Frontend

| Variable/File | Required | Description |
| --- | --- | --- |
| `frontend/src/environments/environment.ts` | Yes | Development API base URL |
| `frontend/src/environments/environment.production.ts` | Yes | Production API base URL for builds |
| `API_BASE_URL` (Amplify env var) | No | Backend API base URL used for the Amplify build (defaults to `/api/v1`) |

## Screenshots

Add screenshots here to showcase the app in action:

- `screenshots/amplify-deployment.png`
- `screenshots/aws-architecture.png`
- `screenshots/elastic-beanstalk-dashboard.png`

Suggested visual coverage:

- Login page
- Dashboard overview
- Users page
- Records page
- Analytics dashboard

Suggested location:

```txt
screenshots/
```

## Test Credentials

Run the seed script first to populate the database, then use these demo accounts for testing:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@amp.local` | `Admin@1234` |
| Admin | `security@amp.local` | `Security@1234` |
| User | `ava.carter@amp.local` | `User@1234` |
| User | `noah.patel@amp.local` | `User@1234` |
| User | `sophia.chen@amp.local` | `User@1234` |
| User | `lucas.miller@amp.local` | `User@1234` |
| User | `emma.wilson@amp.local` | `User@1234` |
| User | `james.taylor@amp.local` | `User@1234` |
| Disabled user | `mia.gomez@amp.local` | `User@1234` |
| Disabled user | `oliver.brown@amp.local` | `User@1234` |

Disabled users cannot sign in (login returns `401 Invalid email or password` to avoid leaking account status).

## MongoDB Collections

The seed script populates these collections:

- `users`
- `records`

## Scripts

### Backend

- `npm run dev`: Start the backend in development mode
- `npm run build`: Compile TypeScript
- `npm run start`: Run the compiled backend
- `npm run seed`: Seed MongoDB with demo users and records
- `npm run lint`: Run ESLint
- `npm run format`: Format backend source files

### Frontend

- `npm start`: Start Angular development server
- `npm run build`: Build the frontend for production
- `npm run test`: Run unit tests
- `npm run lint`: Run Angular linting


