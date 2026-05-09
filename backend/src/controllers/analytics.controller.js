// ============================================================
// controllers/analytics.controller.js
// ============================================================

const School = require("../models/School");
const Student = require("../models/Student");
const Fee = require("../models/Fee");

exports.getOverview = async (req, res) => {
  try {
    const totalSchools = await School.countDocuments({ isActive: true });
    const totalStudents = await Student.countDocuments({ isActive: true });
    
    // Revenue logic: sum of all netAmount where status is paid
    const revenueRes = await Fee.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$netAmount" } } }
    ]);
    const totalRevenue = revenueRes[0] ? revenueRes[0].total : 0;

    res.json({
      success: true,
      data: {
        totalSchools,
        totalStudents,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRevenue = async (req, res) => {
  try {
    // Just a basic mock of monthly revenue trends for now
    const currentYear = new Date().getFullYear();
    const data = [
      { month: `Jan ${currentYear}`, revenue: 0 },
      { month: `Feb ${currentYear}`, revenue: 0 },
      { month: `Mar ${currentYear}`, revenue: 0 },
      { month: `Apr ${currentYear}`, revenue: 0 },
      { month: `May ${currentYear}`, revenue: 0 },
    ];
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSchoolsPerformance = async (req, res) => {
  try {
    const schools = await School.find({ isActive: true }).select("name code plan");
    res.json({ success: true, count: schools.length, data: schools });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
