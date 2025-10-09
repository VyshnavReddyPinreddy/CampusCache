# CampusCache AI Development Guide

This guide provides essential context for AI agents working with the CampusCache codebase.

## Project Architecture

CampusCache is a full-stack web application with:

- Frontend: React + Vite in `/src` directory
- Backend: Express.js server in `/server` directory
- Database: MongoDB (configured in `server/config/database.js`)

### Key Components

1. **Authentication System**

   - Handled by `server/controllers/authController.js`
   - JWT-based auth with cookie storage
   - User model defined in `server/models/User.js`

2. **Core Features**

   - Q&A system (`Question.js` and `Answer.js` models)
   - Voting system (`Votes.js` model, `controllers/Voting.js`)
   - Leaderboard (`controllers/Leaderboard.js`)
   - Reporting system (`Report.js` model, `controllers/reportController.js`)

3. **Email System**
   - Nodemailer configuration in `server/config/nodemailer.js`
   - Email templates in `server/config/emailTemplates.js`

## Development Workflow

### Setup & Running

```bash
# Install dependencies for both client and server
npm install
cd server && npm install

# Start development environment (both client and server)
npm run dev
```

### Project Structure Conventions

- Controllers handle business logic (`server/controllers/`)
- Routes define API endpoints (`server/routes/`)
- Models define database schemas (`server/models/`)
- Middleware for auth in `server/middlewares/userAuth.js`

### Key Integration Points

1. API Communication: Frontend uses Axios for API calls
2. Database: MongoDB connection configured via MONGODB_URL env variable
3. Authentication: JWT tokens stored in cookies

## Common Tasks

### Adding New Features

1. Backend: Add model → controller → route
2. Frontend: Add component → update state → integrate API

### Configuration

- Environment variables required:
  - MONGODB_URL
  - JWT_SECRET
  - EMAIL\_\* (for nodemailer)

## Project-Specific Patterns

1. **Error Handling**

   - Backend uses express middleware for error handling
   - Frontend errors handled through toast notifications

2. **State Management**

   - React hooks for local state
   - Context API for global state

3. **API Structure**
   - RESTful endpoints in `server/routes/`
   - Consistent response format: `{ success: boolean, data?: any, error?: string }`

---

Note: This documentation reflects currently implemented patterns and should be updated as the codebase evolves.
