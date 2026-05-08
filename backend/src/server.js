require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes will be imported here
const authRoutes = require('./routes/auth.routes');
const schoolRoutes = require('./routes/school.routes');
const staffRoutes = require('./routes/staff.routes');
const studentRoutes = require('./routes/student.routes');
const attendanceRoutes = require('./routes/attendance.routes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/', (req, res) => {
  res.send('SaaS API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
