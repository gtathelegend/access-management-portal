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
