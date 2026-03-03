# Architecture & System Design

Technical overview of the Alphagnito Agent Management System architecture, data models, and component interactions.

## Table of Contents
- [System Architecture](#system-architecture)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Data Models](#data-models)
- [Authentication Flow](#authentication-flow)
- [Request/Response Cycle](#requestresponse-cycle)
- [Component Hierarchy](#component-hierarchy)

## System Architecture

```
┌─────────────────────────────────────────────┐
│           Browser (React App)               │
│  ┌─────────────────────────────────────┐  │
│  │   React Components & Pages          │  │
│  │   (Login, Dashboard, Agents, etc)   │  │
│  └────────────┬────────────────────────┘  │
└───────────────┼──────────────────────────┘
                │
        HTTP/HTTPS (Axios)
          (with credentials)
                │
┌───────────────▼──────────────────────────────┐
│      Express.js Backend API Server           │
│  ┌──────────────────────────────────────┐   │
│  │  Routes (auth, agents)               │   │
│  │  ├─ Middleware (JWT, validation)     │   │
│  │  ├─ Controllers (business logic)     │   │
│  │  └─ Database Queries                 │   │
│  └──────────────┬───────────────────────┘   │
└─────────────────┼────────────────────────────┘
                  │
            TCP/IP Connection
           (mysql2/promise)
                  │
┌─────────────────▼────────────────────────────┐
│      MySQL Database                          │
│  ┌────────────────────────────────────────┐  │
│  │ users table                            │  │
│  │ agents table                           │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

## Backend Architecture

### Folder Structure
```
backend/
├── config/
│   └── db.js              # MySQL connection pool initialization
│
├── controller/
│   ├── authController.js  # User register, login, logout logic
│   └── agentController.js # Agent CRUD operations
│
├── middlewares/
│   ├── authMiddleware.js  # JWT verification, user extraction
│   └── validate.js        # express-validator error handler
│
├── routes/
│   ├── authRoutes.js      # POST /register, /login, /logout
│   └── agentRoutes.js     # GET/POST/PUT/DELETE /agents
│
├── validations/
│   ├── authValidation.js  # Email, password, mobile validation rules
│   └── agentValidation.js # Agent field validation rules
│
├── db.sql                 # Database schema (CREATE TABLE scripts)
├── script.js              # Express app entry point, server startup
└── package.json
```

### Request Flow in Backend

```
Client Request
       │
       ▼
route handler (authRoutes/agentRoutes)
       │
       ▼
middleware chain:
  ├─ Express JSON parser
  ├─ CORS handler
  ├─ Cookie parser
  ├─ Auth middleware (JWT verify) [agent routes only]
  └─ Validation middleware
       │
       ▼
controller (authController/agentController)
       │
       ▼
database query (db.execute → MySQL)
       │
       ▼
Response (JSON) → Client
```

### Key Backend Modules

#### config/db.js
- Creates MySQL connection pool using `mysql2/promise`
- Exports `promisePool` for async/await database queries
- Handles connection lifecycle (pooling, timeout, etc.)

#### middlewares/authMiddleware.js
```javascript
// Verifies JWT from cookie or Authorization header
// Extracts user data and attaches to req.user
// Returns 401 if token invalid/missing
```

#### controller/authController.js
```javascript
register(req, res)
├── Validate email/mobile uniqueness
├── Hash password with bcryptjs
├── Insert into users table
└── Return success response

login(req, res)
├── Find user by email
├── Verify password against hash
├── Generate JWT token
├── Set HTTP-only cookie (7 days)
└── Return success response

logout(req, res)
└── Clear authentication cookie
```

#### controller/agentController.js
```javascript
getAgents(req, res)
└── SELECT all agents, return as JSON array

createAgent(req, res)
├── Validate email/mobile not already used
├── Insert new agent with created_by = req.user.id
└── Return inserted agent data

updateAgent(req, res)
├── Check agent exists
├── Check email/mobile not used by another agent
├── UPDATE agent fields
└── Return success message

deleteAgent(req, res)
├── Check agent exists
├── DELETE agent
└── Return success message
```

## Frontend Architecture

### Folder Structure
```
FrontEnd/agent_management/src/
├── assets/
│   ├── solace-logo.svg       # Alphagnito logo
│   └── Avatar_img.avif       # User avatar placeholder
│
├── components/
│   ├── Layout.jsx            # Main wrapper (sidebar + topbar)
│   ├── Layout.css            # Layout styling
│   ├── ProtectedRoute.jsx    # Route guard component
│   └── ProtectedRoute.css
│
├── context/
│   └── AuthContext.jsx       # Global auth state (user, login, logout)
│
├── pages/
│   ├── Login.jsx             # Sign in form page
│   ├── Register.jsx          # Sign up form page
│   ├── Dashboard.jsx         # Agent overview & quick actions
│   ├── Agents.jsx            # Agent CRUD management page
│   ├── AuthPages.css         # Login/register styling
│   └── Dashboard.css         # Dashboard/agents/modal styling
│
├── App.jsx                   # Route definitions (React Router)
└── index.js                  # React DOM render entry
```

### Component Hierarchy

```
<App>
  ├─ <Routes>
  │   ├─ <Route path="/login" element={<Login />} />
  │   ├─ <Route path="/register" element={<Register />} />
  │   ├─ <Route path="/dashboard" element={
  │   │     <ProtectedRoute>
  │   │       <Layout>
  │   │         <Dashboard />
  │   │       </Layout>
  │   │     </ProtectedRoute>
  │   │   }
  │   │ />
  │   └─ <Route path="/agents" element={
  │         <ProtectedRoute>
  │           <Layout>
  │             <Agents />
  │           </Layout>
  │         </ProtectedRoute>
  │       }
  │     />
  │
  └─ <AuthProvider>
      └─ All routes have access to auth context
```

### Key Frontend Components

#### AuthContext.jsx
```javascript
User State
├─ user: { email, id }     // from JWT decode
├─ loading: boolean        // auth check pending
└─ error: string          // auth error message

Functions
├─ login(email, password)  // POST /api/auth/login
├─ register(...)           // POST /api/auth/register
├─ logout()                // POST /api/auth/logout
└─ useAuth()               // Hook for consuming context
```

#### ProtectedRoute.jsx
```javascript
Behavior
├─ If loading: Show spinner
├─ If not authenticated: Redirect to /login
└─ If authenticated: Render children
```

#### Layout.jsx
```javascript
Structure
├─ Sidebar (navigation)
│  ├─ Logo & brand name
│  └─ Nav items (Dashboard, Agents)
│
└─ Main content area
   ├─ Topbar (conditional search, notifications, logout)
   └─ Page content slot
```

#### Dashboard.jsx
```javascript
State
├─ agents: Agent[]         // from API
├─ searchTerm: string      // for filtering
├─ showModal: boolean      // form visibility
└─ formData: Agent         // edit/create form data

UI Elements
├─ Search box (filters agents by name/email/mobile)
├─ Quick action cards (Create Inspection, Add Property, Add Agent, Add Inspector)
├─ Agent list table/grid
├─ Add/Edit modal form
└─ Delete confirmation modal
```

#### Agents.jsx
```javascript
State (similar to Dashboard)
├─ agents: Agent[]
├─ searchTerm: string
├─ showModal: boolean
└─ formData: Agent

Main Features
├─ Table view with edit/delete actions
├─ Search functionality
├─ Modal form for create/edit
└─ Delete confirmation
```

## Data Models

### User Model
```javascript
{
  id: number,              // Primary key
  full_name: string,       // e.g., "John Doe"
  email: string,           // Unique, from registration
  mobile: string,          // 10 digits, unique
  password: string,        // Hashed with bcryptjs (never stored plain)
  created_at: timestamp    // Auto-generated
}
```

### Agent Model
```javascript
{
  id: number,              // Primary key
  name: string,            // Agent full name
  email: string,           // Unique, contact email
  mobile: string,          // 10 digits, unique
  created_by: number,      // Foreign key to users.id
  created_at: timestamp,   // Creation time
  updated_at: timestamp    // Last modification time
}
```

### JWT Payload
```javascript
{
  id: number,              // User ID from database
  email: string,           // User's email
  iat: number,             // Issued at (Unix timestamp)
  exp: number              // Expiration (issued_at + 7 days)
}
```

## Authentication Flow

### Registration Flow
```
1. User fills registration form (fullName, email, mobile, password, confirmPassword)
   │
2. Frontend validates: email format, password match, mobile = 10 digits
   │
3. POST /api/auth/register with credentials
   │
4. Backend validates input using express-validator
   │
5. Check if email/mobile already exists in database
   │
6. Hash password with bcryptjs (10 salt rounds)
   │
7. Insert new user into users table
   │
8. Return { success: true, message: "Registration success" }
   │
9. Frontend redirects to login page
```

### Login Flow
```
1. User enters email & password
   │
2. Frontend validates basic format
   │
3. POST /api/auth/login with credentials
   │
4. Backend looks up user by email
   │
5. Compare provided password with stored hash
   │
6. If match: Generate JWT token with user info
   │
7. Set HTTP-only cookie "token" (7 day expiration)
   │
8. Return { success: true, data: { id, email } }
   │
9. Frontend saves user to AuthContext
   │
10. Frontend redirects to /dashboard
```

### Protected Route Access
```
1. User navigates to /dashboard or /agents
   │
2. <ProtectedRoute> checks AuthContext.user
   │
3. If not authenticated: Redirect to /login
   │
4. If authenticated: Render page inside <Layout>
   │
5. Layout shows sidebar & topbar (logout button)
   │
6. Page component can access user context and make API calls
   │
7. All API requests include credentials (axios withCredentials)
   │
8. Backend authMiddleware verifies JWT from cookie
   │
9. If invalid: Return 401, frontend clears auth and redirects
```

## Request/Response Cycle

### Create Agent Example

**Frontend Request:**
```javascript
axios.post('/api/agents', {
  name: 'John Agent',
  email: 'john@example.com',
  mobile: '1234567890'
}, {
  withCredentials: true  // send cookie
})
```

**Backend Processing:**
```javascript
1. authMiddleware: Verify JWT from cookie, extract user
   req.user = { id: 5, email: 'user@example.com' }

2. Validation middleware: Check express-validator rules
   - name: notEmpty
   - email: isEmail
   - mobile: exactly 10 digits

3. Controller (createAgent):
   a. Check if email/mobile already used
   b. INSERT into agents table with created_by = req.user.id
   c. Return: { success: true, data: { id, name, email, mobile, created_by } }

4. Response sent to frontend with 201 status
```

**Frontend Handling:**
```javascript
// Success
setAgents([...agents, response.data.data])
closeModal()
showSuccessNotification()

// Error
setError(error.response.data.message)
console.error(error)
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────┐
│                   Auth Context                      │
│  (Global state: user, login, logout, register)      │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   <ProtectedRoute>      <AuthPages>
        │              (Login/Register)
        ▼
   <Layout>
        │
   ┌────┴────┐
   │          │
   ▼          ▼
Dashboard   Agents
   │          │
   ▼          ▼
Quick      Agent
Actions    Table
   │          │
   ▼          ▼
Modal      Modal
Form       Form
```

---

**Architecture Principles:**
- **Separation of Concerns:** Routes, controllers, models are separate
- **DRY (Don't Repeat Yourself):** Shared validation rules, reusable components
- **Security:** JWT tokens, password hashing, HTTP-only cookies, CORS
- **Scalability:** Stateless backend, context API for frontend state, database pooling
