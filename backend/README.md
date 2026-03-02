# Backend for Alphagnito Technical Task

This Node.js/Express backend implements authentication and agent management APIs as required by the task.

## Prerequisites
- Node.js 18+ installed
- MySQL server running

## Setup
1. Copy `.env` and adjust values (DB credentials, JWT secret, etc.).
2. Run `npm install` in the `backend` folder.
3. Create database and tables by executing `backend/db.sql` in your MySQL client:
   ```sql
   SOURCE path/to/backend/db.sql;
   ```
   The script will create `users` and `agents` tables with unique constraints.
4. Start the server:
   ```sh
   cd backend
   npm run dev    # or npm start
   ```

## API Endpoints

### Auth
- `POST /api/auth/register` – register a new user
  ```bash
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"fullName":"Alice","email":"alice@example.com","mobile":"1234567890","password":"secret","confirmPassword":"secret"}'
  ```
- `POST /api/auth/login` – login and receive JWT cookie
  ```bash
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -c cookies.txt \
    -d '{"email":"alice@example.com","password":"secret"}'
  ```
- `POST /api/auth/logout` – clear authentication cookie
  ```bash
  curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt
  ```

### Agents (protected)
All agent routes require a valid JWT token (sent via cookie or Authorization header).

- `GET /api/agents` – list all agents
- `POST /api/agents` – create an agent (name, email, mobile). The logged-in user's ID is recorded as `created_by` in the database.
- `PUT /api/agents/:id` – update agent details
- `DELETE /api/agents/:id` – delete an agent

## Notes
- Passwords are hashed with bcryptjs.
- JWTs are set in an HTTP-only cookie with a 1 day expiration by default.
- CORS is enabled with credentials to allow cross-origin requests from a front-end.

Feel free to extend with additional profile endpoints, error handling, or migration tooling.