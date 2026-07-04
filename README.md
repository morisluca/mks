# AsrInvest Platform

A full-stack cryptocurrency investment platform with admin and user dashboards.

## Structure

```
AsrInvest/
├── backend/   — Express.js API server (Node.js + TypeScript + Drizzle ORM)
└── frontend/  — React + Vite web app (TypeScript + Tailwind CSS)
```

## Requirements

- Node.js 18 or higher
- npm (comes with Node.js)
- PostgreSQL database (local or cloud)

---

## Backend Setup

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create .env file (copy from example)
cp .env.example .env
# Edit .env and set your DATABASE_URL, SESSION_SECRET, PORT

# 3. Create the database tables
npm run db:push

# 4. Start the development server
npm run dev
# Runs on http://localhost:3001
```

---

## Frontend Setup

Open a second terminal:

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
# Opens at http://localhost:5173
```

The frontend automatically proxies `/api` requests to the backend on port 3001.

---

## First-time Login

Register a new account via the app. The **first user to register becomes the admin** automatically.

---

## Admin Credentials (if you ran a seed)

- **Admin:** admin@AsrInvest.com / Admin@123456
- **User:** user@example.com / User@123456


