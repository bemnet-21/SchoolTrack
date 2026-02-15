
***

# SchoolTrack 🎓

SchoolTrack is a comprehensive, full-stack School Management System designed to streamline academic operations. It features a robust role-based access control (RBAC) system for **Admins, Teachers, Students, and Parents**, ensuring a personalized and secure experience for every user type.

## 🚀 Live Demo

[Click here to view the live demo](https://school-admin-orcin.vercel.app/)

### Demo credentials to login
* admin -> email: admin@school.com password: admin123
* student -> email: william@student.com password: william123
* teacher -> email: janey@teacher.com password: janey123
* parent -> email: royce@parent.com password: royce123

## 🚀 Key Features

### 🔐 Authentication & Security
*   **Role-Based Access Control:** Secure routes guarded by custom `AuthGuard` and Redux state management.
*   **Password Enforcement:** Mandatory password change requirement on first-time login for system-generated accounts.
*   **JWT Integration:** Stateless authentication using JSON Web Tokens with automated Axios interceptors.

### 🛡️ Admin Dashboard
*   **Unified Analytics:** Real-time stats for total students, teachers, and classes.
*   **User Management:** Full CRUD operations for Teachers and Students, including automated credential generation.
*   **Academics:** Create subjects and assign them to specific classes with designated teachers.
*   **Finance:** Bulk fee assignment by class, automated invoice generation, and payment status tracking.
*   **Logistics:** Manage school-wide events and academic timetables.

### 👨‍🏫 Teacher Portal
*   **Class Management:** View assigned classes and detailed student rosters.
*   **Digital Gradebook:** Input and update student scores with real-time grade calculation.
*   **Personal Schedule:** Interactive weekly timetable view optimized for mobile.

### 📱 Responsive UI/UX
*   **Mobile First:** Specifically optimized for small screens (down to 393px) using a "Table-to-Card" transformation logic.
*   **Smart Sidebar:** Dynamic navigation that changes based on the user's role.
*   **Interactive Header:** Context-aware header that switches between page titles and search bars based on the active route.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework:** Next.js 15 (App Router)
*   **State Management:** Redux Toolkit (RTK)
*   **Styling:** Tailwind CSS
*   **Icons:** React Icons / Lucide-React
*   **Data Fetching:** Axios with custom Interceptors

### Backend
*   **Runtime:** Node.js / Express.js
*   **Database:** PostgreSQL
*   **Security:** Bcrypt (Hashing), JWT (Auth), CORS (Strict Policy)
*   **Database Logic:** Complex SQL joins, JSON Aggregations, and Transactions (ACID compliance)

---

## 📂 Project Structure

```text
├── frontend/
│   ├── app/
│   │   ├── (auth)/           # Public routes (Login/Change Password)
│   │   ├── (dashboard)/      # Gated routes (Admin/Teacher/Student)
│   │   └── components/       # Reusable UI (Sidebar, Header, AuthGuard)
│   ├── store/                # Redux slices (Auth, Sidebar, Dashboard)
│   ├── services/             # API service layers (Axios)
│   └── utils/                # Date/Time formatting helpers
└── backend/
    ├── controllers/          # Business logic (Auth, Grade, Fee, etc.)
    ├── db/                   # Postgres configuration
    ├── routes/               # Express route definitions
    └── middleware/           # Auth & Role validation
```

---

## 📊 API Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/auth/login` | POST | Authenticate user & return JWT |
| `/api/v1/dashboard/stats` | GET | Aggregate counts for Admin dashboard |
| `/api/v1/teachers/register` | POST | Create teacher & generate temp password |
| `/api/v1/fees/assign` | POST | Bulk assign fees to a class (Transaction) |
| `/api/v1/timetable/class/:id`| GET | Get weekly schedule grouped by day |
| `/api/v1/grades` | POST | Upsert student scores with auto-grading |

---

## 🚧 Planned Modules (Roadmap)

* 🎓 **Student Portal**

  * View grades, attendance, timetable
* 🧑‍🏫 **Teacher Portal**

  * Manage grades and attendance
* 👨‍👩‍👧 **Parent Portal**

  * Monitor student performance
* 🔔 Notifications & announcements
* 📈 Advanced analytics & reports

---



