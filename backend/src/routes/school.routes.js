
// routes/school.routes.js - School Management Routes

// GET    /api/schools       → Get all schools (superadmin only)
// POST   /api/schools       → Create a new school (superadmin only)
// GET    /api/schools/:id   → Get a single school
// PUT    /api/schools/:id   → Update school info
// DELETE /api/schools/:id   → Delete a school (superadmin only)

const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { getSchools,
  createSchool,
  getSchoolById,
  updateSchool,
  deleteSchoolById,
  getMySchoolSettings,
  updateMySchoolSettings,
  getSubscriptions,
  updateSubscription
 } = require("../controllers/school.controller");

// All routes require authentication
router.use(protect);

// ── GET all schools (superadmin only) ────────────────────────
router.get("/", authorize("superadmin"), getSchools);

// ── POST create a new school ──────────────────────────────────
router.post("/", authorize("superadmin"), createSchool);

// ── GET/PUT my school settings ────────────────────────────────
router.get("/settings/my", authorize("schooladmin"), getMySchoolSettings);
router.put("/settings/my", authorize("schooladmin"), updateMySchoolSettings);

// ── GET/PUT subscriptions (superadmin only) ───────────────────
router.get("/subscriptions", authorize("superadmin"), getSubscriptions);
router.put("/subscriptions/:id", authorize("superadmin"), updateSubscription);

// ── GET single school ─────────────────────────────────────────
router.get("/:id", getSchoolById);

// ── PUT update school ─────────────────────────────────────────
router.put("/:id", authorize("superadmin", "schooladmin"), updateSchool);

// ── DELETE school ─────────────────────────────────────────────
router.delete("/:id", authorize("superadmin"), deleteSchoolById);

module.exports = router;