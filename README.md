# Alphagnito Agent Management System

A full-stack web application for managing agents with user authentication and CRUD operations. Built with React, Node.js/Express, and MySQL.

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **MySQL** 8.0+ (server running on localhost:3306)
- **Git** for version control

### Installation & Setup

1. **Clone and navigate to root:**
   ```bash
   cd Alphagnito_project_assesment
   ```

2. **Backend setup:**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file with your database credentials:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_NAME=agent_management
     DB_PORT=3306
     PORT=3000
     JWT_SECRET=your_jwt_secret_key
     ```
   - Initialize the database by running `db.sql` in MySQL:
     ```bash
     mysql -u root -p < db.sql
     ```
   - Start the server:
     ```bash
     npm run dev    # or npm start
     ```
   - Server runs on `http://localhost:3000`

3. **Frontend setup:**
   ```bash
   cd ../FrontEnd/agent_management
   npm install
   npm start
   ```
   - React app opens at `http://localhost:3000` (proxies API to backend)

##  Project Structure

```
Alphagnito_project_assesment/
├── backend/                          # Node.js/Express API
│   ├── config/
│   │   └── db.js                    # MySQL connection pool
│   ├── controller/
│   │   ├── agentController.js       # Agent CRUD logic
│   │   └── authController.js        # User registration/login
│   ├── middlewares/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── validate.js              # Express-validator wrapper
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   └── agentRoutes.js           # Agent endpoints
│   ├── validations/
│   │   ├── authValidation.js        # Register/login validation
│   │   └── agentValidation.js       # Agent field validation
│   ├── db.sql                       # Database schema
│   ├── script.js                    # Express app entry point
│   ├── package.json
│   └── README.md
│
├── FrontEnd/
│   └── agent_management/            # React 19 application
│       ├── src/
│       │   ├── assets/              # Images, logos
│       │   ├── components/
│       │   │   ├── Layout.jsx       # Sidebar, topbar wrapper
│       │   │   ├── ProtectedRoute.jsx
│       │   │   └── Layout.css
│       │   ├── context/
│       │   │   └── AuthContext.jsx  # Global auth state
│       │   ├── pages/
│       │   │   ├── Login.jsx        # Sign in form
│       │   │   ├── Register.jsx     # Sign up form
│       │   │   ├── Dashboard.jsx    # Agent stats, quick actions
│       │   │   ├── Agents.jsx       # Agent CRUD page
│       │   │   ├── AuthPages.css    # Login/register styles
│       │   │   └── Dashboard.css    # Dashboard/agent/modal styles
│       │   ├── App.jsx              # Route definitions
│       │   └── index.js
│       ├── package.json
│       └── README.md
│
└── README.md                         # This file
```

## Features

### Authentication
-  User registration with email, full name, mobile
-  JWT-based login with HTTP-only cookies
-  Logout with cookie clearing
-  Protected routes with role validation

### Agent Management
-  View all agents in a sortable table
-  Create new agents with form validation
-  Edit existing agent details via modal
-  Delete agents with confirmation
-  Search/filter agents by name, email, mobile
-  Track agent creator (created_by field)

### UI/UX
-  Responsive sidebar navigation (Dashboard, Agents)
-  Professional modal dialogs for form operations
-  Real-time search with instant filtering
-  Bootstrap 5 responsive design
-  Loading spinners and error alerts
-  Quick-action cards on dashboard

## Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 4.x
- **Database:** MySQL 8.0+
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Environment:** dotenv

### Frontend
- **Framework:** React 19+
- **Router:** React Router v6
- **HTTP Client:** Axios
- **Styling:** Bootstrap 5, Bootstrap Icons
- **State Management:** Context API
- **Build Tool:** Create React App (Vite compatible)

## Documentation

For detailed information, refer to:

- **[SETUP.md](./SETUP.md)** – Comprehensive setup and installation guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** – System design, data models, component structure
- **[API_GUIDE.md](./API_GUIDE.md)** – Complete API endpoint reference
- **[backend/README.md](./backend/README.md)** – Backend-specific configuration
- **[FrontEnd/agent_management/README.md](./FrontEnd/agent_management/README.md)** – Frontend-specific info

## API Overview

All requests require `Content-Type: application/json`.

### Authentication Endpoints
- `POST /api/auth/register` – Create new user account
- `POST /api/auth/login` – Login and receive JWT
- `POST /api/auth/logout` – Clear authentication

### Agent Endpoints (Protected)
- `GET /api/agents` – List all agents
- `POST /api/agents` – Create new agent
- `PUT /api/agents/:id` – Update agent
- `DELETE /api/agents/:id` – Delete agent

For detailed examples and response formats, see [API_GUIDE.md](./API_GUIDE.md).

## Key Environment Variables

```bash
# Backend (.env)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=agent_management
DB_PORT=3306
PORT=3000
JWT_SECRET=your_secret_key_here
```

```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:3000/api
```

## Database Schema

### Users Table
- `id` (INT, Primary Key)
- `full_name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `mobile` (VARCHAR, Unique)
- `password` (VARCHAR, hashed)
- `created_at` (TIMESTAMP)

### Agents Table
- `id` (INT, Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `mobile` (VARCHAR, Unique)
- `created_by` (INT, Foreign Key → users.id)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Backend won't start** | Check MySQL is running, `.env` is configured, port 3000 is free |
| **Frontend can't reach API** | Verify backend is running on `http://localhost:3000`, check CORS settings |
| **Database connection fails** | Run `db.sql`, verify credentials in `.env`, ensure MySQL is accessible |
| **Agent creation returns "Server error"** | Ensure `created_by` column exists; check backend logs for validation errors |
| **Login fails** | Verify user exists and password is correct; check JWT_SECRET in `.env` |