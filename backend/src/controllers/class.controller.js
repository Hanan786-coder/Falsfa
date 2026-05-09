// ============================================================
// controllers/class.controller.js
// ============================================================

const Staff = require("../models/Staff");
const Student = require("../models/Student");

// ── GET /api/classes/my-classes ──────────────────────────────
exports.getMyClasses = async (req, res) => {
  try {
    // Find the staff record for the logged-in user
    const staff = await Staff.findOne({ user: req.user.id, school: req.schoolId });
    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff record not found" });
    }

    // Return the classes assigned to this teacher
    res.json({ success: true, count: staff.classes.length, data: staff.classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/classes/:classId/students ───────────────────────
exports.getClassStudents = async (req, res) => {
  try {
    const className = req.params.classId; // the parameter is actually the class name string like "10-A"
    
    const students = await Student.find({
      school: req.schoolId,
      class: className,
      isActive: true,
    }).select("name rollNo section photo");

    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
