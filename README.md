# Access Management Portal

This project consists of a frontend (Angular) and a backend (Node.js/Express).

## Project Structure

- `frontend/`: Angular 17+ application (Standalone architecture, Material, SCSS).
- `backend/`: Node.js Express server (TypeScript, ESLint, Prettier).

## Getting Started

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development mode:
   ```bash
   npm run dev
   ```
   The server will start at `http://localhost:3000`.

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`.

## Scripts

### Backend
- `npm run dev`: Start development server with nodemon.
- `npm run build`: Compile TypeScript to JavaScript.
- `npm run start`: Run the compiled backend.
- `npm run lint`: Run ESLint.
- `npm run format`: Format code with Prettier.

### Frontend
- `npm start`: Start Angular development server.
- `npm run build`: Build for production.
- `npm run test`: Run unit tests.
- `npm run lint`: Run Angular linting.

## API Delay Simulation

For testing loading states, the backend supports non-blocking artificial delays via a query parameter:

- Example: `GET http://localhost:3000/api/v1/users?delay=2000`

This is implemented as Express middleware using an async timer (does not block the Node.js event loop).

Per-route usage (optional):

```ts
import { delayFromQuery, fixedDelay } from './middleware/delay.middleware.js';

router.get('/slow', fixedDelay(500), handler);
router.get('/maybe-slow', delayFromQuery(), handler);
```

## MongoDB Collection and Seed Data

The backend creates these collections in MongoDB when seeded:

- `users`
- `records`

Run the seed script from the backend folder:

```bash
cd backend
npm run seed
```

Seeded demo accounts:

- Admin: `admin@amp.local` / `Admin@1234`
- User: `ava.carter@amp.local` / `User@1234`
- User: `noah.patel@amp.local` / `User@1234`
- Disabled user: `mia.gomez@amp.local` / `User@1234`

Sample seeded records include approved, pending, and rejected verification entries so the dashboards have realistic data immediately after seeding.
