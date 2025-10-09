# CampusCache 🎓

A dynamic question-and-answer platform designed for students. CampusCache provides a secure and moderated space for users to post questions, share answers, and engage in academic discussions within their campus community.

## Key Features ✨

* **Secure Authentication:** Robust user signup and login system featuring OTP-based email verification and password reset functionality.
* **Q&A Platform:** Users can create questions with tags, provide detailed answers, and comment on both questions and answers.
* **Role-Based Access:** A clear distinction between "Student" and "Admin" roles, ensuring that users only see the content and features relevant to them.
* **Admin Moderation Dashboard:** A comprehensive dashboard for admins to manage user-reported content efficiently.
    * View stats on pending, in-progress, and resolved reports.
    * Claim and resolve report "cases," preventing multiple admins from working on the same issue.
    * Take action on content (e.g., delete) and automatically notify all reporters.
* **Notification System:** Users receive notifications when the content they reported has been reviewed and actioned by an admin.

## Tech Stack 🛠️

* **Frontend:** React, React Router
* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JWT (JSON Web Tokens), `bcryptjs` for password hashing
* **Email Service:** Nodemailer

## Setup and Installation 🚀

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js installed (v14 or higher)
* npm (or yarn) installed
* MongoDB installed and running locally, or a MongoDB Atlas connection string.

### Backend Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/CampusCache.git](https://github.com/your-username/CampusCache.git)
    cd CampusCache/server
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the `server` directory and add the following environment variables:
    ```env
    PORT=5000
    DATABASE_URL="your_mongodb_connection_string"
    JWT_SECRET="your_super_secret_jwt_key"
    SENDER_EMAIL="your_email@example.com"
    SENDER_PASSWORD="your_email_app_password"
    ```

4.  **Run the server:**
    ```sh
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

### Frontend Setup

1.  **Navigate to the client directory:**
    ```sh
    cd ../client 
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Run the client:**
    ```sh
    npm start
    ```
    The React application will open on `http://localhost:3000` (or another port if 3000 is busy).

## API Routes 🗺️

### Auth Routes (`/api/auth`)
* `POST /register`: Create a new user account.
* `POST /verify-registration`: Verify a new user's email with an OTP.
* `POST /login`: Log in a student.
* `POST /admin/login`: Log in an admin.
* `POST /logout`: Log out a user.

### Report Routes (`/api/user/report`)
* `POST /`: Submit a new report for a piece of content.

### Admin Routes (`/api/admin`)
* `GET /stats`: Get statistics for the admin dashboard.
* `GET /reports/pending`: Get a list of all pending report cases.
* `PUT /reports/claim/:contentId`: Claim all pending reports for a piece of content.
* `POST /reports/resolve/:contentId`: Resolve a claimed report case.
