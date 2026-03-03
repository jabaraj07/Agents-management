# Contributing Guide

Guidelines for contributing to the Alphagnito Agent Management System.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Git Conventions](#git-conventions)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/jabaraj07/Agents-management.git
cd Alphagnito_project_assesment
```

### 2. Set Up Development Environment
Follow [SETUP.md](./SETUP.md) to install dependencies and configure the database.

### 3. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/feature-name` – New feature
- `fix/bug-description` – Bug fix
- `docs/documentation-title` – Documentation updates
- `refactor/change-description` – Code refactoring
- `test/test-description` – Test additions

## Development Workflow

### Backend Development

**1. Make your changes in `backend/`:**
```
Edit controllers, routes, validations, middleware, etc.
```

**2. Restart the development server:**
```bash
npm run dev
# Changes auto-reload with nodemon
```

**3. Test your changes:**
```bash
# Using curl:
curl -X GET http://localhost:3000/api/agents -H "Authorization: Bearer YOUR_TOKEN"

# Or use Postman/Thunderclient for visual testing
```

**4. Check for errors in console:**
- Validation errors appear in console
- Database errors logged with timestamps
- JWT errors shown clearly

### Frontend Development

**1. Make your changes in `FrontEnd/agent_management/src/`:**
```
Edit components, pages, styles, context, etc.
```

**2. Browser auto-refreshes:**
```bash
# If not, manually refresh (Ctrl+R or Cmd+R)
```

**3. Check DevTools Console:**
- Look for React component errors
- Check Network tab for API request failures
- Verify no CORS errors in Console

**4. Test user interactions:**
- Click buttons and verify behavior
- Submit forms and check validation
- Navigate between pages

## Code Standards

### Backend (Node.js/JavaScript)

**File Structure:**
```javascript
// imports at top
const express = require('express');
const db = require('../config/db');

// middleware/configuration
const router = express.Router();

// controller logic (main code)
exports.functionName = async (req, res) => {
  try {
    // implementation
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// exports
module.exports = router;
```

**Naming Conventions:**
- `camelCase` for variables, functions, and files
- `PascalCase` for classes (not used much here)
- Descriptive names: `getUserById()` not `getU()`
- Controller files: `*Controller.js`
- Route files: `*Routes.js`

**Error Handling:**
- Always use try/catch for async operations
- Log errors with `console.error(error)`
- Return appropriate HTTP status codes
- Send user-friendly error messages

**Comments:**
```javascript
// Use single-line comments for brief explanations
const result = await db.execute(query);

/*
  Use multi-line comments for complex logic
  explaining the reasoning behind implementation choices
*/
```

### Frontend (React/JavaScript)

**File Structure:**
```jsx
// imports at top
import React, { useState, useEffect } from 'react';
import './Component.css';

// component definition
const MyComponent = ({ props }) => {
  // hooks (state, effect, context)
  const [state, setState] = useState(null);

  // event handlers
  const handleClick = () => { /* ... */ };

  // render
  return (<div>{/* JSX */}</div>);
};

// exports
export default MyComponent;
```

**Naming Conventions:**
- Component files: `PascalCase.jsx` (e.g., `Dashboard.jsx`)
- CSS files: lowercase matching component name
- CSS classes: `kebab-case` (e.g., `.dashboard-page`)
- Function components (hooks) over class components
- Custom hooks: `useMyHook()`

**Component Guidelines:**
- Keep components focused and small (<200 lines ideally)
- Extract complex logic to custom hooks
- Props should be documented with JSDoc
- Use prop defaults for optional props

**Example Component:**
```jsx
/**
 * Displays a user profile card
 * @param {Object} user - User object with id, name, email
 * @param {Function} onEdit - Callback when edit button clicked
 */
const UserCard = ({ user, onEdit = () => {} }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  );
};
```

**CSS Standards:**
```css
/* BEM (Block Element Modifier) naming */
.dashboard { /* block */ }
.dashboard__search { /* element */ }
.dashboard__button--primary { /* modifier */ }

/* Group related styles */
.card {
  padding: 16px;
  border-radius: 8px;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Use meaningful variable names */
.btn-danger {
  background: #dc3545;  /* or use CSS variables */
}
```

## Git Conventions

### Branch Naming
```bash
feature/user-authentication    # New feature
fix/login-validation-error     # Bug fix
docs/api-documentation         # Documentation
refactor/simplify-agent-form   # Refactoring
```

### Commit Messages

**Format:**
```
<type>: <subject>

<body (optional - for complex changes)>
```

**Types:**
- `feat:` – New feature
- `fix:` – Bug fix
- `docs:` – Documentation changes
- `style:` – Code style (formatting, missing semicolons)
- `refactor:` – Code refactoring (no feature change)
- `perf:` – Performance improvements
- `test:` – Adding/updating tests
- `chore:` – Dependency updates, build changes

**Examples:**
```bash
git commit -m "feat: add agent search functionality"
git commit -m "fix: resolve JWT validation error on agent creation"
git commit -m "docs: update API endpoints documentation"
git commit -m "refactor: extract modal form to separate component"
git commit -m "perf: optimize agent list rendering with useMemo"
```

### Pushing Changes
```bash
git push origin feature/your-feature-name
```

## Testing

### Manual Testing Checklist

**Backend:**
- [ ] New endpoint returns correct response format
- [ ] Validation rules work (test with invalid data)
- [ ] JWT authentication is enforced on protected routes
- [ ] Database operations complete successfully
- [ ] Error messages are clear and helpful

**Frontend:**
- [ ] New page/component renders without errors
- [ ] Forms validate input properly
- [ ] API requests are made with correct parameters
- [ ] Error messages display to user
- [ ] Responsive design works on different screen sizes

### Backend Testing (with curl)

```bash
# Test registration with invalid email
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"invalid","mobile":"123","password":"p","confirmPassword":"p"}'

# Expected: 400 error with validation messages

# Test protected endpoint without token
curl -X GET http://localhost:3000/api/agents

# Expected: 401 Unauthorized error
```

### Frontend Testing (Cypress/React Testing Library optional)

```bash
# No automated tests required for MVP
# Manual testing through browser is acceptable

# But consider adding for critical paths:
npm test  # if Jest is configured
```

## Submitting Changes

### 1. Ensure Code Quality
```bash
# Check for JavaScript errors
# Use a linter if available (ESLint)
npm run lint

# Format code
npm run format  # if Prettier is configured
```

###  2. Create a Pull Request (if working with team)

**Template:**
```markdown
## Description
Brief description of what this PR changes and why.

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing Done
How did you test these changes?

## Screenshots (if UI changes)
Attach relevant screenshots
```

### 3. Request Review
- Tag relevant team members
- Respond to feedback
- Make requested changes and push updates

### 4. Merge
- Ensure all tests pass
- Squash commits if needed (optional)
- Merge to `main` branch

---

## Reporting Issues

### Bug Report Template

**Title:** Brief, descriptive title

**Description:**
```
Describe the bug clearly.

Steps to reproduce:
1. Action 1
2. Action 2
3. Issue occurs

Expected behavior:
What should happen

Actual behavior:
What actually happens

Environment:
- OS: (Windows/macOS/Linux)
- Browser: (Chrome/Firefox/Safari)
- Node version: (output of `node --version`)
```

**Example:**
```
Title: Agent creation fails with valid 10-digit mobile

When I try to create an agent with a valid mobile number 
like "9876543210", the form submission fails with a 
validation error saying "Mobile must be 10 digits".

The same number works on the registration form, so the 
validation logic seems inconsistent.

Environment:
- Windows 10
- Chrome 98
- Node v18.4.0
```

## Feature Request Template

**Title:** Brief description of requested feature

**Description:**
```
Why is this feature needed?
What problem does it solve?

Proposed implementation:
How would you suggest implementing this?

Acceptance criteria:
What needs to be true for this to be considered done?
```

---

## Questions?

- Check [README.md](./README.md) for overview
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Consult [API_GUIDE.md](./API_GUIDE.md) for endpoint details
- Read [SETUP.md](./SETUP.md) for troubleshooting

