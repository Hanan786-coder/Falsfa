# 🎓 Falsfa SaaS

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)

A multi-tenant **School Management SaaS** built on the MERN stack. Falsfa gives schools a unified platform to manage students, staff, attendance, exams, and finances — all under one roof, with role-based access for super admins, school admins, and teachers.

🔗 **Live Demo:** [falsfaa.vercel.app](https://falsfaa.vercel.app)

---

## 🚀 What It Does

| Module | Description |
|---|---|
| **Multi-tenancy** | Each school is an isolated tenant with its own data, users, and settings |
| **User & Role Management** | Super Admin → School Admin → Teacher hierarchy with JWT-based auth |
| **Student & Staff Management** | Full CRUD for student profiles, class assignments, and staff records |
| **Attendance Tracking** | Daily attendance per class with monthly summaries and at-risk detection |
| **Exam Results** | Subject-wise marks, grade distribution, and top/bottom performer tracking |
| **Fee Management** | Fee structures, monthly collection tracking, overdue detection |
| **Analytics & Reports** | Real-time dashboards and downloadable academic, attendance, and finance reports |
| **Audit Logs** | Every sensitive action is logged for accountability |
| **Notifications** | System-level alerts pushed to relevant roles |

---

## 🛠️ Tech Stack

**Backend**
- Node.js + Express.js — REST API server
- MongoDB + Mongoose — primary database with complex aggregation pipelines
- JWT — authentication and role-based authorization

**Frontend**
- React + Vite — fast, component-based UI
- Shadcn/UI — accessible and consistent component library
- Recharts — data visualization for analytics dashboards

**Infrastructure**
- Vercel — frontend and backend deployment
- MongoDB Atlas — cloud-hosted database

---

## 📂 Project Structure

```
Falsfa/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Business logic (analytics, reports, auth, etc.)
│   │   ├── models/           # Mongoose schemas (School, Student, Staff, Fee, ...)
│   │   ├── routes/           # Express route definitions
│   │   └── server.js         # App entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── features/         # Feature-based component folders
│   │   ├── layouts/          # MainLayout, AuthLayout
│   │   └── routes/           # AppRoutes with role-based guards
│   └── package.json
├── vercel.json               # Deployment configuration
└── implementation_plan.md    # Feature planning docs
```

---

## 🗄️ Data Models

The backend is built around these core Mongoose models:

`School` · `User` · `Student` · `Staff` · `Attendance` · `ExamResult` · `Fee` · `FeeStructure` · `AuditLog` · `Notification`

---

## 📈 Reports Module

One of the heavier backend features — three report types powered by MongoDB aggregation pipelines:

**Academic Performance**
Uses `$facet` to run grade distribution (`$bucket`), subject averages, and top/bottom student rankings in a single query against `ExamResult`.

**Attendance Summary**
Unwinds daily attendance records (`$unwind`), groups by student and month, computes attendance percentage, and flags students below the 75% threshold.

**Financial Health**
Groups fee records by month and class, computes collection rates with `$divide` + `$addFields`, and surfaces defaulters sorted by overdue amount.

---

## 🏁 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- npm

### ⚙️ Setup

```bash
# Clone the repo
git clone https://github.com/Hanan786-coder/Falsfa.git
cd Falsfa

# Install dependencies for both frontend and backend automatically via npm workspaces
npm install

# Setup environment variables
cd backend
cp .env.example .env        # fill in MONGO_URI, JWT_SECRET, PORT
cd ..

# Run both backend and frontend concurrently
npm run dev
```

The backend runs on `http://localhost:5000` and the frontend on `http://localhost:5173` by default.

---

## 🛣️ API Overview

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/login` | Public |
| GET | `/api/students` | School Admin, Teacher |
| GET | `/api/reports/academic` | School Admin |
| GET | `/api/reports/attendance` | School Admin, Teacher |
| GET | `/api/reports/finance` | School Admin |
| GET | `/api/analytics/dashboard` | Super Admin, School Admin |

All protected routes require a `Bearer <token>` header.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

---

## ✍️ Author

**Abdul Hanan** — [github.com/Hanan786-coder](https://github.com/Hanan786-coder)

---

## 📝 License

MIT
