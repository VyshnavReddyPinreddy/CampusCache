-----

\<div align="center"\>

# 🚀 CAMPUSCACHE

**A full-stack MERN Q\&A platform for the NIT Warangal student community. Built with role-based auth, a gamified points system, and a robust admin moderation panel.**

\</div\>

-----

**CampusCache** is an exclusive MERN stack application designed to be the central knowledge hub for students at NIT Warangal. It provides a gamified, moderated, and anonymous-friendly environment where students can ask academic and campus-related questions, share knowledge, and build a community-driven information repository.

The platform features a secure, institute-only email verification system, a points-based leaderboard to encourage participation, and a complete admin dashboard for content moderation.

## ✨ Key Features

### 1\. 🔐 Authentication & User Management

  * **Institute-Only Registration:** New user registration is restricted to `@student.nitw.ac.in` email addresses.
  * **Email Verification:** New accounts are verified using a time-sensitive OTP (15-minute expiry) sent via email.
  * **Secure JWT Authentication:** User sessions are managed using JSON Web Tokens (JWT) stored in secure `httpOnly` cookies.
  * **Password Reset:** A "Forgot Password" flow allows users to reset their password via an email OTP.
  * **Role-Based Access Control (RBAC):** Distinct "Student" and "Admin" roles with dedicated dashboards and permissions.
  * **Protected Routes:** Frontend routes are protected, redirecting unauthenticated users or users with the wrong role.

### 2\. ❓ Q\&A Functionality

  * **Ask & Answer:** Users can post questions (with title, content, tags) and provide answers to existing questions.
  * **Anonymous Posting:** Users have the option to post questions or answers anonymously to protect their identity.
  * **Profanity Filter:** A built-in check (`explicitCheck.js`) prevents posts containing inappropriate language.
  * **Content Management:** Users can delete their own questions and answers.
  * **Relevance-Based Search:** A custom search algorithm finds questions by scoring matches in the title, content, and tags.

### 3\. 📈 Gamification & Leaderboard

  * **Points System:**
      * **+5 points** for posting a question or answer.
      * **-5 points** for deleting your own question or answer.
      * **-20 points** if your post is removed by an admin for violations.
  * **Dynamic Leaderboard:** A leaderboard displays the top 10 ranked students by points.
  * **User Rank:** The currently logged-in user's rank and points are displayed, even if they are not in the top 10.

### 4\. 🛡️ Admin & Moderation System

  * **Content Reporting:** Users can report questions or answers for violations (e.g., spam, harassment).
  * **Admin Dashboard:** A dedicated panel for admins to manage all reported content.
  * **Report Lifecycle:** Reports are categorized as **Pending**, **In Progress**, or **Resolved**.
  * **Report Claiming:** Admins can "claim" a pending report to prevent multiple admins from working on the same case.
  * **Resolution Actions:**
      * **Delete Content:** If the report is valid, the admin can delete the offending post. This penalizes the author (-20 points) and sends them a notification.
      * **Dismiss Report:** If the report is invalid, the admin dismisses it.
  * **User Penalty System:**
      * Dismissing a report increments the reporter's `invalidReports` counter.
      * After **3 invalid reports**, the user is **banned from reporting for 24 hours** and receives a notification.
      * The ban is automatically lifted after 24 hours.

### 5\. 🔔 Notifications & Feedback

  * **User Notifications:** Users receive in-app notifications for critical events, such as post removals or reporting restrictions.
  * **Read/Unread Status:** Users can view a list of their notifications and toggle their read status.
  * **Feedback System:** A dedicated form allows users to submit feedback directly to the site administrators.

### 6\. ⬆️ Voting System

  * **Upvote/Downvote:** Users can upvote or downvote answers to rank their quality and helpfulness.
  * **Vote Toggling:** Users can change their vote (e.g., from upvote to downvote) or remove their vote, with the answer's score updating accordingly.

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React.js, React Router, Tailwind CSS, React Context API, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (with Mongoose) |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js |
| **File Structure** | MERN (Vite for Frontend, separate `server` directory for Backend) |
| **Email** | Nodemailer (with Brevo/SMTP) |

## 📁 Project Structure

```
CAMPUSCACHE/
├── .github/
├── server/
│   ├── config/             # Database, Nodemailer config
│   ├── controllers/        # Business logic (auth, admin, question, etc.)
│   ├── models/             # Mongoose schemas (User, Question, Answer, etc.)
│   ├── routes/             # API route definitions
│   ├── .env                # Backend environment variables
│   ├── index.js            # Backend entry point
│   └── package.json        # Backend dependencies
│
├── src/
│   ├── components/         # Shared React components (ProtectedRoute.jsx)
│   ├── context/            # Global state (AppContext.jsx)
│   ├── pages/              # Main page components
│   │   ├── StudentDashboard/
│   │   │   └── components/   # Student-specific components
│   │   ├── AdminDashboard.jsx
│   │   ├── EmailVerify.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── ResetPassword.jsx
│   ├── App.jsx             # Main App component with routing
│   ├── main.jsx            # React entry point
│   └── index.css           # Tailwind CSS imports
│
├── .env                    # Frontend environment variables
├── .gitignore
├── package.json            # Frontend dependencies & root scripts (e.g., 'npm run dev')
└── vite.config.js          # Vite configuration
```

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

  * [Node.js](https://nodejs.org/) (v18.x or later)
  * [npm](https://www.npmjs.com/)
  * [MongoDB](https://www.mongodb.com/) (local instance or a cloud-hosted URI)
  * A [Brevo](https://www.brevo.com/) (or other SMTP) account for sending emails.

### 1\. Clone the Repository

```bash
git clone https://github.com/your-username/campuscache.git
cd campuscache
```

### 2\. Install Dependencies

1.  **Install Frontend Dependencies (Root):**
    From the root `campuscache` directory, run:

    ```bash
    npm install
    ```

2.  **Install Backend Dependencies (Server):**
    Navigate into the `server` directory and install its dependencies:

    ```bash
    cd server
    npm install
    cd ..
    ```

### 3\. Configure Environment Variables

You will need to create two `.env` files.

1.  **Backend (`/server/.env`):**
    Create a `.env` file inside the `/server` directory and add the following:

    ```env
    # --- Server Configuration ---
    PORT=4000
    NODE_ENV=development

    # --- Database ---
    MONGODB_URL=your_mongodb_connection_string

    # --- Authentication ---
    JWT_SECRET=your_super_secret_jwt_key

    # --- Email (Brevo/SMTP) ---
    SENDER_EMAIL=your_sender_email@example.com
    SMTP_USER=your_brevo_smtp_username_email
    SMTP_PASSWORD=your_brevo_smtp_password
    ```

2.  **Frontend (Root `/.env`):**
    Create a `.env` file in the **root** project directory and add the following:

    ```env
    # --- React App ---
    VITE_BACKEND_URL=http://localhost:4000
    ```

### 4\. Run the Application

Once your dependencies are installed and your `.env` files are set up, you can start the application with a single command from the **root** directory:

```bash
npm run dev
```

This command will concurrently start both the backend server (on `http://localhost:4000`) and the frontend Vite development server (on `http://localhost:5173`).

## 🌐 API Endpoints

All API endpoints are defined in the `/server/routes` directory.

  * `/api/auth`: User registration, login, logout, password reset.
  * `/api/admin`: Admin-specific actions for managing reports.
  * `/api/user`: Fetching user data, resetting invalid report counts.
  * `/api/question`: Creating, fetching, and searching questions.
  * `/api/answer`: Posting and deleting answers.
  * `/api/report`: Creating new content reports.
  * `/api/vote`: Upvoting, downvoting, and managing votes.
  * `/api/points`: Fetching the leaderboard and user points.
  * `/api/notifications`: Fetching and updating user notifications.
  * `/api/feedback`: Submitting user feedback.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome\! Feel free to check the [issues page](https://www.google.com/search?q=https://github.com/your-username/campuscache/issues).

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

-----

<div align="center">
<h3>✨ Built with ❤️ by our amazing team ✨</h3>
<p>
  <a href="https://github.com/your-username">Vyshnav Reddy Pinreddy</a> | 
  <a href="https://github.com/Anjii-08">Anjaneyulu Baikani</a> | 
  <a href="https://github.com/Rishith-Thommandru">Rishith Thommandru</a>
</p>
</div>
