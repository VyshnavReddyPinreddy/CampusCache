````markdown
# CampusCache — Copilot instructions (concise)

This file gives focused, actionable information for AI coding agents working on CampusCache. Use these points to make small, safe edits and to find where to implement features.

# CampusCache — Copilot instructions (concise)

Short, actionable notes to get an AI agent productive in this repository.

## Big-picture architecture

- Frontend: React + Vite in `src/` (SPA). Entry: `src/main.jsx` → `src/App.jsx`.
- Backend: Express (ES modules) in `server/`. Entry: `server/index.js` (dev: `server/npm run dev` uses `nodemon`).
- Database: MongoDB via Mongoose. Connection: `server/config/database.js`.

Why this layout: frontend and backend are colocated so `npm run dev` (root) launches both with `concurrently` for fast local iteration.

## Where to look (high-value files)

- Auth: `server/controllers/authController.js`, model `server/models/User.js` — JWT + cookies; OTP/email flows use `server/config/nodemailer.js` and `server/config/emailTemplates.js`.
- Q&A core: `server/models/Question.js`, `server/models/Answer.js`, controller `server/controllers/Question.js` (posting, search, fetch, delete).
- Voting: `server/models/Votes.js`, `server/controllers/Voting.js`.
- Reports/Admin: `server/controllers/reportController.js`, `server/routes/adminRoutes.js`, UI `src/pages/AdminDashboard.jsx`.
- Frontend entry: `src/main.jsx`, global state in `src/context/AppContext.jsx`, protected pages use `src/components/ProtectedRoute.jsx`.

## Developer workflows (commands)

- Install (root):

```cmd
npm install
```

- Start both client and server (root):

```cmd
npm run dev
```

This runs Vite (client) and `cd server && npm run dev` (server) via `concurrently`.

- Start only server (from `server/`):

```cmd
cd server; npm run dev
```

- Build frontend:

```cmd
npm run build
```

Note: server `package.json` uses `nodemon index.js` for `dev`.

## Environment variables (search these files to confirm exact keys)

- `MONGODB_URL` / `DATABASE_URL` — used in `server/config/database.js`.
- `JWT_SECRET` — used in `server/controllers/authController.js`.
- `SENDER_EMAIL`, `SENDER_PASSWORD` — used by `server/config/nodemailer.js` for sending OTPs.

Store env vars in `server/.env` for local dev.

## Project-specific conventions & gotchas

- API response shape: { success: boolean, data?: any, message?: string, error?: string } — follow this exactly when adding endpoints.
- Controllers contain business logic; `server/routes/*` should only wire controllers.
- Authentication: JWT is stored in cookies. When modifying auth behavior, update `server/middlewares/userAuth.js` and check front-end cookie usage in `src/`.
- Profanity/bad-words: the repo includes `extra-words.json` and `bad-words` is used in some controllers; when adding content validation, extend the filter with `extra-words.json`.

## Integration & cross-component patterns

- Frontend calls backend with Axios; some components use inline base URLs. Search `axios` imports in `src/pages` for examples.
- Email flows: OTP generation → `server/config/emailTemplates.js` → `server/config/nodemailer.js` sends email. Do not rename template keys without updating both files.
- Points system: user actions (posting questions/answers) increment/decrement `points` on `User` documents (see `Question.js` and `Answer.js` controllers).

## Safe edit checklist (before PR)

1. Use the project's API response shape in controllers.
2. Add/update the corresponding route in `server/routes/` when creating endpoints.
3. When changing auth/cookies, update `server/middlewares/*` and search for cookie usage across `src/`.
4. If you add new environment variables, mention them in README and `.env.example`.

## Quick examples & patterns

- Controller success response:

```js
return res.json({ success: true, data: result });
```

- Controller error response:

```js
return res.status(400).json({ success: false, message: 'reason' });
```

- Use `populate()` on Mongoose queries to attach author info: see `server/controllers/Question.js` for patterns handling anonymous authors.

## Files to open first when debugging or adding features

- `server/index.js`, `server/controllers/authController.js`, `server/config/database.js` — auth + DB wiring
- `server/controllers/Question.js`, `server/models/Question.js` — core Q&A behavior
- `src/main.jsx`, `src/App.jsx`, `src/context/AppContext.jsx` — frontend entry & global state

---

If you'd like, I can expand any section (tests, adding a new endpoint, or wiring CI) or add example unit tests and a short verification checklist.
