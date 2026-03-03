# API Guide

Complete reference for all API endpoints in the Alphagnito Agent Management System.

## Table of Contents
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Auth Endpoints](#auth-endpoints)
- [Agent Endpoints](#agent-endpoints)
- [Error Handling](#error-handling)
- [Example Requests](#example-requests)

## Base URL

```
http://localhost:3000/api
```

All requests should include the header:
```
Content-Type: application/json
```

## Authentication

### JWT Cookie Authentication

The API uses **JWT tokens stored in HTTP-only cookies** for authentication.

1. User logs in and receives a JWT token
2. Token is stored in an HTTP-only cookie named `token` (automatically by Express)
3. All subsequent requests automatically include this cookie (browser behavior)
4. Backend verifies the token signature and expiration

**For Protected Routes (Agent endpoints):**
- Ensure your HTTP client sends cookies with requests
- Example with Axios: `withCredentials: true`
- Example with curl: `-b cookies.txt`

**Token Details:**
- **Expires:** 7 days from issue
- **Algorithm:** HS256 (symmetric)
- **Storage:** HTTP-only cookie (not accessible via JavaScript)
- **Payload:** `{ id, email, iat, exp }`

## Response Format

All responses return JSON with a consistent structure:

### Success Response
```json
{
  "success": true,
  "data": { ... },      // Response data (optional)
  "message": "..."      // Success message (optional)
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Status Codes
| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - New resource created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Missing/invalid token |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## Auth Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

**Description:** Create a new user account

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobile": "1234567890",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Validation Rules:**
- `fullName`: Required, non-empty string
- `email`: Required, valid email format, must be unique
- `mobile`: Required, exactly 10 numeric digits, must be unique
- `password`: Required, must match confirmPassword
- `confirmPassword`: Required, must match password

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

**Example (Node/Axios):**
```javascript
const response = await axios.post('http://localhost:3000/api/auth/register', {
  fullName: 'John Doe',
  email: 'john@example.com',
  mobile: '9876543210',
  password: 'SecurePass123',
  confirmPassword: 'SecurePass123'
});
```

---

### 2. Login User

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and receive JWT token (via HTTP-only cookie)

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Validation Rules:**
- `email`: Required, valid email format
- `password`: Required, non-empty

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john@example.com"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Side Effect:**
- Sets HTTP-only cookie: `token=<JWT>`
- Cookie expires in 7 days

**Example (cURL):**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Example (Node/Axios):**
```javascript
const response = await axios.post(
  'http://localhost:3000/api/auth/login',
  {
    email: 'john@example.com',
    password: 'SecurePass123'
  },
  { withCredentials: true }  // Important: sends cookies
);
```

---

### 3. Logout User

**Endpoint:** `POST /auth/logout`

**Description:** Clear authentication and logout user

**Request Body:** None (empty)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Side Effect:**
- Clears `token` cookie

**Example (cURL):**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

**Example (Node/Axios):**
```javascript
const response = await axios.post(
  'http://localhost:3000/api/auth/logout',
  {},
  { withCredentials: true }
);
```

---

## Agent Endpoints

### ⚠️ **All agent endpoints require authentication**

Include valid JWT token in request (via HTTP-only cookie).

---

### 1. Get All Agents

**Endpoint:** `GET /agents`

**Description:** Retrieve all agents from the database

**Request Body:** None

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Alice Agent",
      "email": "alice@example.com",
      "mobile": "1111111111",
      "created_by": 5,
      "created_at": "2026-03-01T10:30:00Z",
      "updated_at": "2026-03-01T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Bob Agent",
      "email": "bob@example.com",
      "mobile": "2222222222",
      "created_by": 5,
      "created_at": "2026-03-02T14:20:00Z",
      "updated_at": "2026-03-02T14:20:00Z"
    }
  ]
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Not authorized, token missing"
}
```

**Example (cURL):**
```bash
curl -X GET http://localhost:3000/api/agents \
  -b cookies.txt
```

**Example (Node/Axios):**
```javascript
const response = await axios.get(
  'http://localhost:3000/api/agents',
  { withCredentials: true }
);
console.log(response.data.data);  // Array of agents
```

---

### 2. Create Agent

**Endpoint:** `POST /agents`

**Description:** Create a new agent record

**Request Body:**
```json
{
  "name": "Carol Agent",
  "email": "carol@example.com",
  "mobile": "3333333333"
}
```

**Validation Rules:**
- `name`: Required, non-empty
- `email`: Required, valid email format, must be unique
- `mobile`: Required, exactly 10 numeric digits, must be unique

**Response (Success - 201):**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Carol Agent",
    "email": "carol@example.com",
    "mobile": "3333333333",
    "created_by": 5
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Agent with given email/mobile already exists"
}
```

**Notes:**
- `created_by` is automatically set to the current user's ID from the JWT
- `created_at` and `updated_at` are automatically generated by the database

**Example (cURL):**
```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Carol Agent",
    "email": "carol@example.com",
    "mobile": "3333333333"
  }'
```

**Example (Node/Axios):**
```javascript
const response = await axios.post(
  'http://localhost:3000/api/agents',
  {
    name: 'Carol Agent',
    email: 'carol@example.com',
    mobile: '3333333333'
  },
  { withCredentials: true }
);
console.log(response.data.data);  // New agent with ID
```

---

### 3. Update Agent

**Endpoint:** `PUT /agents/:id`

**Description:** Update an existing agent's details

**URL Parameters:**
- `id`: Agent's ID (integer)

**Request Body:**
```json
{
  "name": "Carol Updated",
  "email": "carol.new@example.com",
  "mobile": "3333333334"
}
```

**Validation Rules:** Same as Create Agent

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Agent updated"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Agent not found"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Email or mobile already in use"
}
```

**Example (cURL):**
```bash
curl -X PUT http://localhost:3000/api/agents/3 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Carol Updated",
    "email": "carol.new@example.com",
    "mobile": "3333333334"
  }'
```

**Example (Node/Axios):**
```javascript
const response = await axios.put(
  'http://localhost:3000/api/agents/3',
  {
    name: 'Carol Updated',
    email: 'carol.new@example.com',
    mobile: '3333333334'
  },
  { withCredentials: true }
);
```

---

### 4. Delete Agent

**Endpoint:** `DELETE /agents/:id`

**Description:** Delete an agent record

**URL Parameters:**
- `id`: Agent's ID (integer)

**Request Body:** None

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Agent deleted"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Agent not found"
}
```

**Example (cURL):**
```bash
curl -X DELETE http://localhost:3000/api/agents/3 \
  -b cookies.txt
```

**Example (Node/Axios):**
```javascript
const response = await axios.delete(
  'http://localhost:3000/api/agents/3',
  { withCredentials: true }
);
```

---

## Error Handling

### Common Error Responses

**Invalid Email Format:**
```json
{
  "success": false,
  "message": "Valid email is required"
}
```

**Mobile Number Invalid:**
```json
{
  "success": false,
  "message": "Mobile must be 10 digits"
}
```

**Token Expired:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**Server Error:**
```json
{
  "success": false,
  "message": "Server error"
}
```

### Debugging Tips

1. **Check Backend Logs:**
   - Run backend with `npm run dev` to see console errors
   - Look for validation failures, database connection issues

2. **Use Network Tab:**
   - Open DevTools (F12)
   - Go to Network tab
   - Check response status codes and error messages

3. **Verify Credentials:**
   - Ensure JWT token is being sent (check Cookies in Request Headers)
   - Confirm token hasn't expired

4. **Database State:**
   - Connect to MySQL and verify data exists
   - Check unique constraints aren't violated

---

## Example Requests

### Complete Workflow Example

**1. Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**3. Create Agent:**
```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Agent Smith",
    "email": "smith@example.com",
    "mobile": "1234567890"
  }'
```

**4. Get All Agents:**
```bash
curl -X GET http://localhost:3000/api/agents \
  -b cookies.txt
```

**5. Update Agent:**
```bash
curl -X PUT http://localhost:3000/api/agents/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Agent Smith Updated",
    "email": "smith.updated@example.com",
    "mobile": "1234567891"
  }'
```

**6. Delete Agent:**
```bash
curl -X DELETE http://localhost:3000/api/agents/1 \
  -b cookies.txt
```

**7. Logout:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

---

## Testing with Postman

1. **Create a new request collection**
2. **Add collection-level variable:** `baseUrl = http://localhost:3000/api`
3. **Set up cookie jar:**
   - Postman automatically manages cookies if you're sending requests to the same domain
4. **Create requests for each endpoint:**
   - Use `{{baseUrl}}/auth/register` as URL
   - Postman will automatically include cookies after login

---

**For more details on backend implementation, see [ARCHITECTURE.md](./ARCHITECTURE.md)**
