const School = require("../models/School");
const User = require("../models/User");

exports.getSchools = async (req, res) => {
  try {
    const schools = await School.find().sort({ createdAt: -1 });
    res.json({ success: true, count: schools.length, data: schools });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSchool = async (req, res) => {
  try {
    const school = await School.create(req.body);
    res.status(201).json({ success: true, data: school });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ success: false, message: "School not found" });

    // Non-superadmin can only view their own school
    if (req.user.role !== "superadmin" && school._id.toString() !== req.user.school.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, data: school });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(req.params.id, req.body, {
      new: true,       // Return the updated document
      runValidators: true,
    });
    if (!school) return res.status(404).json({ success: false, message: "School not found" });

    res.json({ success: true, data: school });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteSchoolById = async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) return res.status(404).json({ success: false, message: "School not found" });

    res.json({ success: true, message: "School deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};