# Setup Guide

Comprehensive step-by-step instructions for setting up the Alphagnito Agent Management System.

## Table of Contents
- [System Requirements](#system-requirements)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Database Configuration](#database-configuration)
- [Running the Application](#running-the-application)
- [Verification Checklist](#verification-checklist)

## System Requirements

### Required Software
- **Node.js** v18.0.0 or higher (check: `node --version`)
- **npm** v9.0.0 or higher (comes with Node.js)
- **MySQL** v8.0.0 or higher
- **Git** (optional, for cloning)

### Recommended System Specs
- OS: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- RAM: 4GB minimum (8GB recommended for comfortable development)
- Disk: 500MB free space

## Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd Alphagnito_project_assesment/backend
```

### Step 2: Install Dependencies
```bash
npm install
```
This installs all required packages from `package.json`:
- express
- mysql2
- dotenv
- jsonwebtoken
- bcryptjs
- express-validator
- cookie-parser
- cors

### Step 3: Create Environment Configuration

Create a `.env` file in the `backend/` directory:
```bash
touch .env    # macOS/Linux
# OR
copy nul .env # Windows
```

Fill in your database credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=agent_management
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

**Important:**
- Replace `your_mysql_password` with your actual MySQL root password
- Use a strong JWT_SECRET (minimum 32 characters recommended)
- Keep this file private; add to `.gitignore` (already done)

### Step 4: Initialize the Database

**Ensure MySQL is running:**
```bash
# macOS (if installed via Homebrew)
brew services start mysql

# Windows (MySQL should auto-start)
# Or manually: Search "Services" and start "MySQL80"

# Linux
sudo systemctl start mysql
```

**Create database and tables:**
```bash
# Option 1: Using MySQL CLI
mysql -u root -p < db.sql
# (Enter your MySQL password when prompted)

# Option 2: Using MySQL Workbench or another GUI
# Open db.sql and execute it in your MySQL client
```

**Verify tables were created:**
```bash
mysql -u root -p
> USE agent_management;
> SHOW TABLES;
# Should output: users, agents
```

### Step 5: Start the Backend Server
```bash
npm run dev
# Or: npm start
```

Expected output:
```
Server is running on port 3000
Password : your_mysql_password
```

**Server is now running at:** `http://localhost:3000`

## Frontend Setup

### Step 1: Navigate to Frontend Directory
```bash
cd ../FrontEnd/agent_management
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs:
- react & react-dom (v19+)
- react-router-dom (v6+)
- axios
- bootstrap (v5+)
- bootstrap-icons

### Step 3: Create Frontend Environment (Optional)

Create a `.env` file in `FrontEnd/agent_management/`:
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

If not provided, the app will default to `http://localhost:3000/api`.

### Step 4: Start the Frontend Development Server
```bash
npm start
```

Expected output:
```
Compiled successfully!
Local: http://localhost:3000
On Your Network: http://192.168.x.x:3000
```

**Frontend is now running at:** `http://localhost:3000`

## Database Configuration

### Default Credentials
```sql
Database: agent_management
User: root
Password: (your MySQL password)
Port: 3306
```

### Tables Created

**users** table:
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  mobile VARCHAR(15) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**agents** table:
```sql
CREATE TABLE agents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  mobile VARCHAR(20) NOT NULL UNIQUE,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
```

## Running the Application

### In Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd FrontEnd/agent_management
npm start
# Runs on http://localhost:3000 (proxies /api to backend)
```

### Development Workflow

1. **Backend changes:**
   - Edit files in `backend/`
   - Server auto-restarts (if using `npm run dev`)
   - Test with curl or Postman at `http://localhost:3000/api/...`

2. **Frontend changes:**
   - Edit files in `FrontEnd/agent_management/src/`
   - Browser auto-refreshes (hot reload)
   - Check console for errors

3. **Database changes:**
   - Restart backend after schema changes
   - Ensure migration scripts are run

## Verification Checklist

- [ ] **Node.js & npm installed:** `node --version && npm --version`
- [ ] **MySQL running:** Can connect via `mysql -u root -p`
- [ ] **Backend dependencies installed:** `backend/node_modules/` folder exists
- [ ] **Backend .env configured:** All DB credentials filled in
- [ ] **Database initialized:** Can run `SHOW TABLES;` and see users & agents
- [ ] **Backend starts without errors:** `npm run dev` runs successfully
- [ ] **Frontend dependencies installed:** `node_modules/` folder exists in agent_management/
- [ ] **Frontend starts successfully:** `npm start` compiles without errors
- [ ] **Can access app:** Browser opens `http://localhost:3000`
- [ ] **Can register user:** Test registration form works
- [ ] **Can login:** User credentials persist in JWT cookie
- [ ] **Can create agent:** Add agent button works and data saves to DB
- [ ] **API calls working:** Check network tab in DevTools (no CORS errors)

## Common Setup Issues

### "Cannot find module 'express'"
**Solution:** Run `npm install` in the backend directory

### "Error: connect ECONNREFUSED 127.0.0.1:3306"
**Solution:** 
- Ensure MySQL is running: `brew services start mysql` (macOS) or check Services (Windows)
- Verify credentials in `.env` match your MySQL setup
- Check MySQL is listening on port 3306

### "Port 3000 already in use"
**Solution:**
- Change `PORT` in backend `.env` to 3001, 3002, etc.
- Or kill existing process: `lsof -ti:3000 | xargs kill -9` (macOS/Linux)

### "CORS error when calling API"
**Solution:**
- Ensure backend is running on port 3000
- Check `CORS_ORIGIN` in backend `.env` matches frontend URL
- Verify `axios withCredentials: true` in frontend requests

### "ERR! code EACCES: permission denied"
**Solution:** Use `sudo npm install` or fix npm permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

## Next Steps

After successful setup:
1. Read [API_GUIDE.md](./API_GUIDE.md) to understand endpoints
2. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for project structure
3. Explore the codebase in `backend/` and `FrontEnd/agent_management/src/`
4. Start developing features!

---

**Need Help?** Check the [README.md](./README.md) troubleshooting section or review individual README files in backend/ and FrontEnd/agent_management/.
