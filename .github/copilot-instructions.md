````markdown
# CampusCache — Copilot instructions (concise)

This file gives focused, actionable information for AI coding agents working on CampusCache. Use these points to make small, safe edits and to find where to implement features.

## Big-picture architecture

- Frontend: React + Vite in `src/` (single-page app). Entry: `src/main.jsx`, top component `src/App.jsx`.
- Backend: Express app under `server/`. Entry: `server/index.js` (run with `npm run dev` in `server`).
- Database: MongoDB via Mongoose. Connection in `server/config/database.js`.

Why this layout: frontend and backend are colocated for local dev; root `npm run dev` (uses `concurrently`) starts both.

## Key components & where to look (quick links)

- Auth: `server/controllers/authController.js` and model `server/models/User.js` (JWT + cookies).
- Q&A: `server/models/Question.js`, `server/models/Answer.js`, controllers in `server/controllers/Question.js` and `server/controllers/Answer.js`.
- Voting: `server/models/Votes.js`, `server/controllers/Voting.js`.
- Reports & admin: `server/models/Report.js`, `server/controllers/reportController.js`, admin routes in `server/routes/adminRoutes.js` and UI in `src/pages/AdminDashboard.jsx`.
- Email: `server/config/nodemailer.js` and `server/config/emailTemplates.js` (OTP/send flows referenced from `authController.js`).

## Developer workflows (commands to run)

- Install deps (root):

```cmd
npm install
```
````

- Start both client + server (recommended for local dev):

```cmd
npm run dev
```

This runs Vite for the frontend and `nodemon index.js` for the server via `concurrently`.

- Start only server (from `server/`):

```cmd
cd server
npm run dev
```

- Build frontend for production:

```cmd
npm run build
```

## Environment variables (discoverable list)

- `MONGODB_URL` / `DATABASE_URL` — MongoDB connection (see `server/config/database.js`).
- `JWT_SECRET` — used by `authController.js`.
- `SENDER_EMAIL`, `SENDER_PASSWORD` — used by `server/config/nodemailer.js` for sending OTPs.

Set these in `server/.env` when running the server.

## Project-specific conventions and patterns

- API responses follow shape: { success: boolean, data?: any, error?: string } — mirror this when adding endpoints (`server/controllers/*`).
- Controllers implement business logic; routes only wire endpoints to controller functions (see `server/routes/*`).
- Middleware: authentication middleware lives in `server/middlewares/` (look at `userAuth.js` and `adminAuth.js`).
- Frontend state: local hooks + small Context API in `src/context/AppContext.jsx` for auth/global user state.
- Frontend styling uses Tailwind; look at `index.css` and `vite` + Tailwind config in root files.

## Integration & cross-component notes

- Frontend calls backend APIs with Axios. Base URLs are used inline in components; check `src/components` and `src/pages` for examples.
- JWT tokens are stored in cookies (set by server). When adding protected routes, ensure `cookie` is read on server-side routes (see `userAuth.js`).
- Email flows: OTP generation occurs in `authController.js` and emails are sent via `nodemailer.js` templates. Avoid changing template keys without updating `emailTemplates.js`.

## Safe edit checklist (before PR)

1. Follow the response shape `{ success, data, error }` in new endpoints.
2. Update corresponding route in `server/routes/` and add tests or a brief manual verification note.
3. When changing auth or token behavior, update `server/middlewares/*` and search for cookie usage in `src/`.
4. Preserve existing environment variable names; add new ones to README and `.env.example` (if created).

## Examples (copy-paste patterns to reuse)

- Return format in controllers:

```js
return res.json({ success: true, data: result });
// on error:
// return res.status(400).json({ success: false, error: 'reason' });
```

- Start both dev servers (root): `npm run dev` — uses `concurrently` and runs `vite` and `server` script.

## Files to open first when investigating a task

- `server/index.js`, `server/controllers/authController.js`, `server/config/database.js`
- `src/main.jsx`, `src/App.jsx`, `src/context/AppContext.jsx`

---

If anything here is unclear or you'd like more specifics (examples for adding a new endpoint, wiring OAuth, or a migration plan), tell me which area to expand and I'll update this file.

```
   - Context API for global state
```
