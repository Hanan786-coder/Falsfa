const express = require("express");
const router = express.Router();
const { protect, authorize, tenantGuard } = require("../middleware/auth");
const { getMyClasses, getClassStudents } = require("../controllers/class.controller");

router.use(protect, tenantGuard);

router.get("/my-classes", authorize("teacher"), getMyClasses);
router.get("/:classId/students", authorize("teacher", "schooladmin"), getClassStudents);

module.exports = router;
