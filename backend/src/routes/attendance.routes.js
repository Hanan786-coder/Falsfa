const express = require("express");
const router = express.Router();
const { protect, authorize, tenantGuard } = require("../middleware/auth");
const {
  markAttendance,
  getAttendanceRecords,
  getAttendanceSummary,
  updateAttendance,
} = require("../controllers/attendance.controller");

router.use(protect, tenantGuard);

// ── POST: Mark Attendance ─────────────────────────────────────
// Teacher submits attendance for an entire class on a given date
router.post("/", authorize("superadmin", "schooladmin", "teacher"), markAttendance);

// ── GET: Fetch Attendance Records ─────────────────────────────
// Supports filtering by date, class, and date range
router.get("/", getAttendanceRecords);

// ── GET: Attendance Summary for a Class ──────────────────────
// Returns overall attendance % for each student in a class
router.get("/summary", getAttendanceSummary);

// ── PUT: Update Attendance Record ─────────────────────────────
router.put("/:id", authorize("superadmin", "schooladmin", "teacher"), updateAttendance);

module.exports = router;