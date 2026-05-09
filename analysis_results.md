# Frontend → Backend API Gap Analysis

## ✅ Existing APIs That Are Covered

These frontend calls already have matching backend endpoints:

| Frontend Call | Backend Route | Used In |
|---|---|---|
| `POST /auth/login` | `POST /api/auth/login` | [LoginPage.jsx](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/features/auth/LoginPage.jsx), [AuthContext.jsx](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/context/AuthContext.jsx) |
| `GET /auth/me` | `GET /api/auth/me` | [AuthContext.jsx](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/context/AuthContext.jsx) |
| `GET /dashboard/stats` | `GET /api/dashboard/stats` | [DashboardPage.jsx](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/features/dashboard/DashboardPage.jsx), [SuperAdminDashboard.jsx](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/features/super-admin/SuperAdminDashboard.jsx) |
| `GET /dashboard/school-stats` | `GET /api/dashboard/school-stats` | [DashboardPage.jsx](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/features/dashboard/DashboardPage.jsx) |
| `GET /students` | `GET /api/students` | [useStudents.js](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/features/students/useStudents.js) |
| `POST /students` | `POST /api/students` | [useStudents.js](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/features/students/useStudents.js) |
| `PUT /students/:id` | `PUT /api/students/:id` | [useStudents.js](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/features/students/useStudents.js) |
| `GET /exams/students` | `GET /api/exams/students` | [ExamResultEntry.jsx](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/features/examination/ExamResultEntry.jsx) |
| `POST /exams/results` | `POST /api/exams/results` | [ExamResultEntry.jsx](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/features/examination/ExamResultEntry.jsx) |
| `GET /schools` | `GET /api/schools` | [SuperAdminDashboard.jsx](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/features/super-admin/SuperAdminDashboard.jsx) |
| `PUT /schools/:id` | `PUT /api/schools/:id` | [SuperAdminDashboard.jsx](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/features/super-admin/SuperAdminDashboard.jsx) |

---

## ❌ Missing APIs — Needed For Placeholder Pages

The sidebar ([Sidebar.jsx](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/layouts/Sidebar.jsx)) defines 10 nav items that currently route to `PlaceholderPage` ("🚧 Coming Soon"). Each will need backend APIs when built out.

### 1. `/teachers` — Teacher Management (School Admin)

> [!IMPORTANT]
> Backend already has `GET/POST/PUT/DELETE /api/staff` routes. However, these operate on a **Staff** model, not filtered to teachers specifically. The frontend would need to either:
> - Filter by `role: 'teacher'` on the staff endpoints, **or**
> - Create dedicated teacher endpoints

**Needed endpoints:**
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/staff?role=teacher` | List teachers for this school |
| `POST` | `/api/staff` | Create new teacher (already exists) |
| `PUT` | `/api/staff/:id` | Update teacher (already exists) |
| `DELETE` | `/api/staff/:id` | Remove teacher (already exists) |

**Verdict:** ⚠️ Partially covered — needs **role-based filtering** in the staff controller.

---

### 2. `/finance` — Fee Collection & Management (School Admin)

> [!CAUTION]
> **No backend model, controller, or routes exist for finance/fees.** This is a completely missing feature area.

**Needed endpoints:**
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/fees` | List fee records (filterable by student, class, status) |
| `POST` | `/api/fees` | Create a fee entry for a student |
| `PUT` | `/api/fees/:id` | Update fee record (mark as paid, etc.) |
| `GET` | `/api/fees/summary` | Fee collection summary (total collected, pending, overdue) |
| `GET` | `/api/fees/student/:studentId` | Get fee history for a specific student |

**Needed model:** `Fee` (student, amount, dueDate, paidDate, status, feeType, etc.)

---

### 3. `/my-classes` — Teacher's Class View (Teacher)

> [!CAUTION]
> **No backend support exists** for teacher-class assignments. There's no model tracking which teacher teaches which class/subject.

**Needed endpoints:**
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/classes/my-classes` | Get classes assigned to the logged-in teacher |
| `GET` | `/api/classes/:classId/students` | Get students in a specific class |

**Needed model:** `ClassAssignment` or extend `User` model with `assignedClasses` field.

---

### 4. `/attendance` — Attendance Management (Teacher)

> [!NOTE]
> Backend routes exist at `/api/attendance` with `POST`, `GET`, and `GET /summary` endpoints. These are **fully implemented** and ready for the frontend page.

**Available endpoints (already exist):**
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/attendance` | ✅ Mark attendance for a class |
| `GET` | `/api/attendance` | ✅ Get attendance records with filters |
| `GET` | `/api/attendance/summary` | ✅ Class-wise attendance summary |
| `PUT` | `/api/attendance/:id` | ✅ Update an attendance record |

**Verdict:** ✅ Backend is ready — only the **frontend page** needs to be built.

---

### 5. `/my-results` — Student's Exam Results (Student)

> [!WARNING]
> Backend has `GET /api/exams/results` but it's designed for admin/teacher use (filters by class/section). It needs a **student-specific** variant.

**Needed endpoints:**
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/exams/my-results` | Get exam results for the logged-in student |

---

### 6. `/fee-status` — Student's Fee Status (Student)

> [!CAUTION]
> Depends on the **Fee** model/routes from item #2 above being created first.

**Needed endpoints:**
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/fees/my-status` | Get fee records for the logged-in student |

---

### 7. `/profile` — User Profile (Student + others)

> [!WARNING]
> `GET /auth/me` returns user data, but there's **no endpoint to update profile info** (name, avatar, phone, etc.).

**Needed endpoints:**
| Method | Endpoint | Purpose |
|---|---|---|
| `PUT` | `/api/auth/profile` | Update profile (name, avatar, phone, etc.) |
| `POST` | `/api/auth/avatar` | Upload profile picture (if applicable) |

---

### 8. `/settings` — School/Platform Settings (Admin)

> [!CAUTION]
> **No backend support exists.** Would need endpoints for school configuration, academic year, grading policy, etc.

**Needed endpoints:**
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/settings` | Get current school/platform settings |
| `PUT` | `/api/settings` | Update settings |

---

### 9. `/subscriptions` — Subscription Management (Super Admin)

> [!CAUTION]
> **No backend support exists.** The School model has a basic `plan` field (`free/basic/premium`) but there's no subscription lifecycle management.

**Needed endpoints:**
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/subscriptions` | List all school subscriptions |
| `PUT` | `/api/subscriptions/:schoolId` | Change a school's plan |
| `GET` | `/api/subscriptions/revenue` | Revenue breakdown by plan type |

---

### 10. `/analytics` — Platform Analytics (Super Admin)

> [!CAUTION]
> **No backend support exists.** Would need aggregate data endpoints.

**Needed endpoints:**
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/analytics/overview` | Platform-wide metrics (growth trends, top schools) |
| `GET` | `/api/analytics/schools` | Per-school performance comparison |
| `GET` | `/api/analytics/revenue` | Revenue trends over time |

---

## ⚠️ Data Gaps in Existing Endpoints

Even for currently working pages, there are some data issues:

### Dashboard — Hardcoded Data
| Issue | Location | Fix Needed |
|---|---|---|
| **Recent Activities** are hardcoded | [DashboardPage.jsx L8-14](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/features/dashboard/DashboardPage.jsx#L8-L14) | Need `GET /api/dashboard/recent-activity` |
| **Quick Actions** buttons do nothing | [DashboardPage.jsx L110-122](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/features/dashboard/DashboardPage.jsx#L110-L122) | Wire up to navigation (no API needed) |

### Header — Hardcoded Notifications
| Issue | Location | Fix Needed |
|---|---|---|
| Notification badge count is hardcoded "3" | [Header.jsx L71](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/frontend/src/layouts/Header.jsx#L71) | Need `GET /api/notifications/count` and `GET /api/notifications` |

### SuperAdminDashboard — Static School Stats
| Issue | Location | Fix Needed |
|---|---|---|
| `school.stats.totalStudents` is always `0` | [School model L61-65](file:///c:/Users/Hp/VSCodeProject/Falsfa%20SaaS/backend/src/models/School.js#L61-L65) | The `stats` field is never dynamically updated. The `getSchools` controller should aggregate from the `Student` collection, or add a post-save hook to update counts. |

---

## 📊 Summary

| Category | Status | Count |
|---|---|---|
| ✅ Fully covered endpoints | Working | **11** |
| ⚠️ Partially covered (needs filtering/tweaks) | Minor work | **2** (Teachers, My Results) |
| ❌ Completely missing APIs | Needs new models + routes | **7** (Finance, My Classes, Fee Status, Profile Update, Settings, Subscriptions, Analytics) |
| 🔶 Hardcoded data needing APIs | Data quality | **3** (Recent Activity, Notifications, School Stats) |

### Priority Recommendations

1. **High Priority** — These are needed for core school operations:
   - 💰 **Finance/Fees** module (model + full CRUD)
   - 📝 **Attendance page** (backend ready, just build the frontend)
   - 👨‍🏫 **Teacher management** (staff endpoints exist, just add role filtering)

2. **Medium Priority** — Improves user experience:
   - 📊 **My Results** (student-facing exam results)
   - 👤 **Profile update** endpoint
   - 🔔 **Notifications** API
   - 📰 **Recent Activity** API

3. **Lower Priority** — Admin/platform features:
   - ⚙️ Settings, Subscriptions, Analytics
