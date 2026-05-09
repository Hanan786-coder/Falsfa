const express = require("express");
const router = express.Router();
const { protect, authorize, tenantGuard } = require("../middleware/auth");
const { getOverview, getRevenue, getSchoolsPerformance } = require("../controllers/analytics.controller");

router.use(protect, tenantGuard);

router.get("/overview", authorize("superadmin"), getOverview);
router.get("/revenue", authorize("superadmin"), getRevenue);
router.get("/schools", authorize("superadmin"), getSchoolsPerformance);

module.exports = router;
