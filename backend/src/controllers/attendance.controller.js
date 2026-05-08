const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
  try {
    const { class: className, section, date, records, subject } = req.body;
    const schoolId = req.schoolId;

    // Normalize date to midnight to avoid time-zone issues
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for this class/date
    const existing = await Attendance.findOne({
      school: schoolId,
      class: className,
      date: attendanceDate,
      subject: subject || null,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this class on this date",
      });
    }

    const attendance = await Attendance.create({
      school:    schoolId,
      class:     className,
      section,
      date:      attendanceDate,
      records,
      subject,
      takenBy:   req.user.id,
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAttendanceRecords = async (req, res) => {
  try {
    const filter = { school: req.schoolId };

    if (req.query.class)   filter.class = req.query.class;
    if (req.query.subject) filter.subject = req.query.subject;

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate)   filter.date.$lte = new Date(req.query.endDate);
    } else if (req.query.date) {
      // Single day filter
      const day = new Date(req.query.date);
      day.setHours(0, 0, 0, 0);
      filter.date = day;
    }

    const attendance = await Attendance.find(filter)
      .populate("takenBy", "name")
      .populate("records.student", "name rollNo photo")
      .sort({ date: -1 });

    res.json({ success: true, count: attendance.length, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAttendanceSummary = async (req, res) => {
  try {
    const { class: className, startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate)   dateFilter.$lte = new Date(endDate);

    const records = await Attendance.find({
      school: req.schoolId,
      class: className,
      ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}),
    }).populate("records.student", "name rollNo");

    // Aggregate stats per student
    const studentStats = {};
    records.forEach((record) => {
      record.records.forEach((r) => {
        const id = r.student?._id?.toString();
        if (!id) return;
        if (!studentStats[id]) {
          studentStats[id] = {
            student: r.student,
            present: 0, absent: 0, late: 0, total: 0,
          };
        }
        studentStats[id].total++;
        if (r.status === "present") studentStats[id].present++;
        else if (r.status === "absent") studentStats[id].absent++;
        else if (r.status === "late") studentStats[id].late++;
      });
    });

    const summary = Object.values(studentStats).map((s) => ({
      ...s,
      percentage: s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) : 0,
    }));

    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!attendance) return res.status(404).json({ success: false, message: "Record not found" });
    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};