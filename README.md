# EdTech CRM & Inquiry Management System

A full-stack Customer Relationship Management (CRM) & Inquiry System built for the Full-Stack Assessment. It features a public inquiry submission portal and a protected Admin Dashboard with custom JWT authentication, status management, and multi-parameter filtering.

---

## 🌐 Live Demo Links
* **Live Application (Frontend - Vercel):** [https://edtech-crm-mocha.vercel.app](https://edtech-crm-mocha.vercel.app)
* **Admin Portal Login:** [https://edtech-crm-mocha.vercel.app/admin/login](https://edtech-crm-mocha.vercel.app/admin/login)
* **Backend API Base URL (Render):** [https://edtech-crm-backend-eq1i.onrender.com](https://edtech-crm-backend-eq1i.onrender.com)

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

```text
edtech-crm-assessment/
├── backend/
│   ├── middleware/
│   │   └── auth.js           # Custom JWT verification middleware
│   ├── db.js                 # Supabase PostgreSQL pool configuration
│   ├── seedAdmin.js          # Admin user seeding script (bcrypt hashed)
│   ├── server.js             # Express routes (Public & Protected Admin APIs)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── InquiryForm.jsx     # Public inquiry submission form
│   │   │   ├── AdminLogin.jsx      # Custom JWT admin login page
│   │   │   └── AdminDashboard.jsx  # Protected dashboard with filters & search
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json           # SPA client-side routing rewrite configuration
│   └── package.json
├── schema.sql                # SQL script for `admins` and `inquiries` tables
├── .env.example              # Template for required environment variables
└── README.md                 # Documentation
