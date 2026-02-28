# AptiDude

A LeetCode-style platform for Aptitude Questions — practice Quantitative Aptitude, Logical Reasoning, Data Interpretation, and Verbal Ability.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + Tailwind CSS v4 + TypeScript
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (for full backend functionality)

### Frontend (runs standalone with sample data)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Backend

```bash
cd backend
cp .env.example .env   # Edit with your PostgreSQL credentials
npm install

# Set up database
psql -U postgres -c "CREATE DATABASE aptidude;"
psql -U postgres -d aptidude -f schema.sql

# Seed data
node src/seed/seed.js

# Start server
node src/index.js
```

API runs on [http://localhost:5000](http://localhost:5000).

## Project Structure

```
AptiDude/
├── frontend/               # Next.js application
│   └── src/
│       ├── app/            # Pages (App Router)
│       ├── components/     # Reusable UI components
│       ├── lib/            # API client, types, auth
│       └── data/           # Sample data for standalone mode
├── backend/                # Express API server
│   └── src/
│       ├── routes/         # API route handlers
│       ├── config/         # Database configuration
│       ├── middleware/     # JWT auth middleware
│       └── seed/           # Database seeder
└── README.md
```

## Features

- 📋 **Problems Page** — Browse, search, and filter 20+ aptitude problems
- 📝 **Problem Solver** — MCQ and numerical answer types with instant feedback
- 📊 **Progress Dashboard** — Stats, heatmap, charts, and recent activity
- 👤 **Profile** — Badges, rank, category strength breakdown
- 🔐 **Authentication** — JWT-based login/register (demo mode included)
- 🌙 **Dark Theme** — Professional dark UI with glassmorphism effects
