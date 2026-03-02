# Alphagnito Agent Management - Frontend

A modern React frontend for managing agents with user authentication and full CRUD operations. Built with Bootstrap 5 for responsive design and matching the provided Figma mockups.

## Features

- **Authentication Pages**
  - Login page with email/password fields
  - Sign-up page with full registration form
  - JWT-based session management
  - Remember me functionality
  - Forgot password link (placeholder)

- **Agent Management Dashboard**
  - List all agents in a responsive table
  - Create new agents via modal form
  - Edit existing agent details
  - Delete agents with confirmation
  - Search agents by name, email, or mobile
  - Real-time data sync with backend

- **Design & UX**
  - Matches Figma design specifications exactly
  - Split-screen layout for login/register (form + branding)
  - Dark blue gradient branding section
  - Responsive design (desktop, tablet, mobile)
  - Smooth animations and transitions
  - Bootstrap 5 utilities and components
  - Bootstrap Icons for UI elements

## Tech Stack

- **React 19** - UI framework
- **React Router v6** - Client-side routing
- **Bootstrap 5** - CSS framework & components
- **Bootstrap Icons** - Icon library
- **Axios** - HTTP client for API calls
- **Context API** - Global state management (Auth)

## Prerequisites

- Node.js 18+ installed
- Backend running on `http://localhost:3000` (see backend README)
- Modern browser (Chrome, Firefox, Safari, Edge)

## Installation & Setup

1. **Install dependencies:**
   ```bash
   cd FrontEnd/agent_management
   npm install
   ```

2. **Update API Base URL (if needed):**
   - Open `src/context/AuthContext.jsx`
   - Modify `API_BASE_URL` if your backend runs on a different port
   - Default: `http://localhost:3000/api`

3. **Start development server:**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── pages/
│   ├── Login.jsx              # Login page component
│   ├── Register.jsx            # Registration page component
│   ├── Dashboard.jsx           # Agent management dashboard
│   ├── AuthPages.css          # Styles for Login/Register
│   └── Dashboard.css          # Styles for Dashboard
├── context/
│   └── AuthContext.jsx        # Authentication context & hooks
├── components/
│   └── ProtectedRoute.jsx     # Route protection wrapper
├── App.jsx                    # Main routing setup
├── App.css                    # Global app styles
├── index.js                   # Entry point with Bootstrap import
├── index.css                  # Global CSS variables & styles
└── public/
    └── index.html             # HTML template
```

## User Flows

### Registration Flow
1. User clicks "Sign up here" on login page
2. Fills in name, email, mobile, password, confirm password
3. Validates form (client-side)
4. Submits to backend `/api/auth/register`
5. On success → redirects to login page
6. Displays error messages for validation failures

### Login Flow
1. User enters email and password
2. Optional: Check "Remember me"
3. Submits to backend `/api/auth/login`
4. JWT token stored in HTTP-only cookie
5. On success → redirects to dashboard
6. On failure → displays error message

### Dashboard Flow
1. Only accessible if user is logged in
2. Loads list of agents from backend
3. **View Agents** - table with all agent details
4. **Create** - "Add New Agent" button opens modal
5. **Read** - Search to filter agents by name/email/mobile
6. **Update** - Edit button opens modal with pre-filled data
7. **Delete** - Delete button shows confirmation dialog
8. Logout button clears session and redirects to login

## API Endpoints Used

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT cookie)
- `POST /api/auth/logout` - Logout user

**Agents (Protected - requires JWT):**
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create new agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

## Design Details

### Login/Register Pages
- **Left Section:** Clean white form area with subtle background
- **Right Section:** Dark blue gradient with Alphagnito logo
- **Responsive:** On mobile, logo moves below form
- **Color Scheme:**
  - Primary: Dark Blue (#1e3a8a)
  - Background: Light gray (#f5f5f5)
  - Inputs: Subtle gray (#f9f9f9)
  - Accent: Cyan/Purple gradient for logo

### Dashboard
- **Header:** Dark blue gradient with logo, title, user info, logout
- **Controls:** Search bar + "Add Agent" button
- **Table:** Responsive with hover effects
- **Modals:** Centered, animated, semi-transparent overlay
- **Empty States:** Helpful icons and call-to-action buttons

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Environment Variables

No `.env` file needed by default. If you need to change the API URL:

1. Create `.env` file in `FrontEnd/agent_management/`:
   ```
   REACT_APP_API_URL=http://localhost:3000/api
   ```

2. Update `src/context/AuthContext.jsx`:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
   ```

## Common Issues

**CORS Error:**
- Ensure backend has CORS enabled
- Check backend `.env` for correct port
- Default backend port: 3000

**Login/Register API Errors:**
- Verify backend is running
- Check network tab in DevTools
- Ensure valid email format (email validation is strict)
- Mobile must be exactly 10 digits

**Routes Not Working:**
- Clear browser cache
- Restart dev server: `npm start`
- Check React Router version: `npm list react-router-dom`

## Future Enhancements

- [ ] Forgot password recovery flow
- [ ] Profile/account settings page
- [ ] Pagination for large agent lists
- [ ] Export agents to CSV
- [ ] Bulk delete operations
- [ ] Agent filtering/sorting options
- [ ] Dark mode theme
- [ ] Multi-language support
- [ ] Form validation improvements

## Development Notes

- Uses React Context API instead of Redux for simplicity
- Bootstrap utility classes used for responsive layouts
- Axios configured with `withCredentials: true` for cookie handling
- All forms have client-side validation
- API errors displayed to user
- Loading states for async operations

## Testing

To test the application flow:

1. **Register new user:**
   - Go to `/register`
   - Fill form with unique email
   - Mobile must be 10 digits
   - Password must be at least 6 chars

2. **Login:**
   - Use registered email/password
   - Check "Remember me" to persist login

3. **Agent CRUD:**
   - Create: Click "Add New Agent"
   - Read: View table, search agents
   - Update: Click edit icon on row
   - Delete: Click delete icon, confirm

## Troubleshooting

**Agents list won't load:**
1. Check browser DevTools → Network tab
2. Verify backend is running (`npm run dev` in backend folder)
3. Check that database tables exist (run `db.sql`)
4. Clear cookies and re-login

**Form validation errors:**
- Email must be valid format (test@example.com)
- Mobile must be exactly 10 digits
- Passwords must match
- All fields are required

**Styles look broken:**
- Clear browser cache (Ctrl+Shift+Del)
- Restart dev server and refresh page
- Check that Bootstrap CSS is imported

## Support

For issues or questions about the frontend, refer to the code comments or check the related Backend README.
