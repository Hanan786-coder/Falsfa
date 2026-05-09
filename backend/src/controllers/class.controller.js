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

    // Derive unique classes from assignments
    const classes = [...new Set((staff.assignments || []).map(a => a.class))];
    res.json({ success: true, count: classes.length, data: classes, assignments: staff.assignments || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/classes/:classId/students ───────────────────────
exports.getClassStudents = async (req, res) => {
  try {
    const className = req.params.classId;
    const { section } = req.query;
    
    const query = {
      school: req.schoolId,
      class: className,
      isActive: true,
    };

    if (section) {
      query.section = section;
    }

    const students = await Student.find(query).select("name rollNo section photo");

    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
