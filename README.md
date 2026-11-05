# EdTech CRM & Inquiry Management System

A full-stack Customer Relationship Management (CRM) & Inquiry System built for the Full-Stack Assessment. It features a public inquiry submission portal and a protected Admin Dashboard with custom JWT authentication, status management, and multi-parameter filtering.

---

## 🌐 Live Demo Links & Test Credentials

* **Live Application (Frontend - Vercel):** [https://edtech-crm-mocha.vercel.app](https://edtech-crm-mocha.vercel.app)
* **Admin Portal Login:** [https://edtech-crm-mocha.vercel.app/admin/login](https://edtech-crm-mocha.vercel.app/admin/login)
* **Backend API Base URL (Render):** [https://edtech-crm-backend-eq1i.onrender.com](https://edtech-crm-backend-eq1i.onrender.com)

### 🔑 Default Admin Login Credentials
* **Email:** `admin@edtech.com`
* **Password:** `admin123`

> **Note:** The backend is hosted on Render's free tier, which spins down after 15 minutes of inactivity. The initial API request may take 20–30 seconds to wake up the server.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Implementation Details |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite), React Router v6 | Responsive SPA with public inquiry form & protected admin views |
| **Backend** | Node.js, Express.js (ES Modules) | RESTful API with parameterized SQL queries |
| **Database** | Supabase (PostgreSQL) | Connected directly via standard `pg` Pool connection string |
| **Authentication** | Custom JWT + `bcrypt` | Built from scratch (No Supabase Auth used) |

---

## 📂 Repository Structure

* **`backend/`**
  * `middleware/auth.js` — Custom JWT verification middleware
  * `db.js` — Supabase PostgreSQL pool configuration
  * `seedAdmin.js` — Admin user seeding script (`bcrypt` hashed)
  * `server.js` — Express routes (Public & Protected Admin APIs)
  * `package.json` — Backend dependencies
* **`frontend/`**
  * `src/pages/InquiryForm.jsx` — Public inquiry submission form
  * `src/pages/AdminLogin.jsx` — Custom JWT admin login page
  * `src/pages/AdminDashboard.jsx` — Protected dashboard with filters & search
  * `src/App.jsx` & `src/main.jsx` — React Router setup
  * `vercel.json` — SPA client-side routing rewrite configuration
  * `package.json` — Frontend dependencies
* **`schema.sql`** — SQL script for `admins` and `inquiries` tables
* **`.env.example`** — Template for required environment variables
* **`README.md`** — Project documentation

---

## ✨ Core Features Implemented

1. **Public Inquiry Form (`/`)**
   * Collects **User Type** (`Parent`, `Student`, `School`), **Category** (`Scholarship`, `Concert`, `Admission`, `General Query`), **Name**, **Email**, **Phone Number**, and **Message**.
   * Persists inquiries directly to the Supabase PostgreSQL `inquiries` table with a default status of `Pending`.
2. **Custom JWT Admin Authentication (`/admin/login`)**
   * Passwords hashed using `bcrypt` (10 salt rounds) and stored in the `admins` PostgreSQL table.
   * Generates a signed JWT (`jsonwebtoken`) upon valid credential verification.
   * Express middleware (`middleware/auth.js`) validates `Authorization: Bearer <token>` on all `/api/admin/*` endpoints.
3. **Admin Dashboard, Filters & Search (`/admin/dashboard`)**
   * Tabular view displaying **Name, Phone, Email, User Type, Category, Message, Date, and Status**.
   * **Category Filter:** Filter inquiries by `Scholarship`, `Concert`, `Admission`, or `General Query`.
   * **User Type Filter:** Filter inquiries by `Parent`, `Student`, or `School`.
   * **Real-Time Search:** Case-insensitive (`ILIKE`) search across **Name** and **Phone Number**.
   * **Status Management:** Inline status updates (`Pending`, `Contacted`, `Resolved`) persisted immediately to PostgreSQL.

---

## 🚀 Local Setup Instructions

### 1. Clone the Repository
    git clone [https://github.com/alpha-byte-2/edtech-crm.git](https://github.com/alpha-byte-2/edtech-crm.git)
    cd edtech-crm

### 2. Database Setup (Supabase)
1. Create a new project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** in the Supabase dashboard, copy the contents of `schema.sql`, and run it to create the `admins` and `inquiries` tables.
3. Retrieve your **Connection Pooler URI** from **Project Settings → Database → Connection String (URI)**.

### 3. Configure Environment Variables
See `.env.example` for reference.

Create **`backend/.env`**:

    PORT=5000
    DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION][.pooler.supabase.com:5432/postgres](https://.pooler.supabase.com:5432/postgres)
    JWT_SECRET=your_super_secret_jwt_key

Create **`frontend/.env`**:

    VITE_API_URL=http://localhost:5000

### 4. Install Dependencies, Seed Admin & Start Backend
    cd backend
    npm install
    node seedAdmin.js
    node server.js

### 5. Install Dependencies & Start Frontend
Open a second terminal:

    cd frontend
    npm install
    npm run dev

Open **`http://localhost:5173`** in your browser.

---

## 🔐 How to Test Custom JWT Authentication

### Testing via Live Browser UI
1. Attempt to visit `[https://edtech-crm-mocha.vercel.app/admin/dashboard](https://edtech-crm-mocha.vercel.app/admin/dashboard)` directly without logging in — the app automatically redirects to `/admin/login`.
2. Log in at `[https://edtech-crm-mocha.vercel.app/admin/login](https://edtech-crm-mocha.vercel.app/admin/login)` using **`admin@edtech.com`** and **`admin123`**.
3. Upon login, the JWT token is stored in `localStorage` and attached as a `Bearer` token to fetch and update inquiries on `/admin/dashboard`.
4. Clicking **Logout** clears the token and revokes access.

### Testing Live Backend via cURL / Postman
1. **Unauthenticated Request (Rejected with `401 Unauthorized`):**

       curl -i [https://edtech-crm-backend-eq1i.onrender.com/api/admin/inquiries](https://edtech-crm-backend-eq1i.onrender.com/api/admin/inquiries)

2. **Admin Login (Returns JWT Token):**

       curl -X POST [https://edtech-crm-backend-eq1i.onrender.com/api/admin/login](https://edtech-crm-backend-eq1i.onrender.com/api/admin/login) -H "Content-Type: application/json" -d '{"email":"admin@edtech.com","password":"admin123"}'

3. **Authenticated Request (Returns `200 OK` with inquiries JSON):**

       curl -H "Authorization: Bearer <YOUR_JWT_TOKEN>" "[https://edtech-crm-backend-eq1i.onrender.com/api/admin/inquiries?category=Scholarship&user_type=Student](https://edtech-crm-backend-eq1i.onrender.com/api/admin/inquiries?category=Scholarship&user_type=Student)"

---

## 📡 API Endpoints Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/inquiries` | Public | Submit a new inquiry |
| `POST` | `/api/admin/login` | Public | Authenticate admin & receive JWT |
| `GET` | `/api/admin/inquiries` | Protected (JWT) | List inquiries (supports `?category=`, `?user_type=`, `?search=`) |
| `PATCH` | `/api/admin/inquiries/:id/status` | Protected (JWT) | Update inquiry status (`Pending`, `Contacted`, `Resolved`) |
