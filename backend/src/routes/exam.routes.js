const express = require("express");
const router = express.Router();
const { protect, authorize, tenantGuard } = require("../middleware/auth");
const { getResults, saveResults, getStudentsForExam, getMyResults } = require("../controllers/exam.controller");

router.use(protect, tenantGuard);

router.get("/results", getResults);
router.get("/my-results", authorize("student"), getMyResults);
router.post("/results", authorize("superadmin", "schooladmin", "teacher"), saveResults);
router.get("/students", getStudentsForExam);

module.exports = router;
