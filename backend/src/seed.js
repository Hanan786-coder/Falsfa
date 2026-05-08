// seed.js - Populate database with demo data
// Run: node src/seed.js

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const School = require("./models/School");
const Student = require("./models/Student");

const connectDB = require("./config/db");

const STUDENTS_DATA = [
  "Ali Hassan", "Fatima Khan", "Ahmad Raza", "Ayesha Malik", "Omar Farooq",
  "Zainab Ali", "Hassan Ahmed", "Maryam Shah", "Usman Tariq", "Sana Noor",
  "Bilal Hussain", "Hira Saeed", "Kamran Yousuf", "Rabia Anwar", "Imran Abbas",
  "Nadia Pervez", "Salman Haider", "Amna Riaz", "Faisal Iqbal", "Nimra Ashraf",
];

async function seed() {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await School.deleteMany({});
  await Student.deleteMany({});

  console.log("🗑️  Cleared existing data");

  // Create schools
  const school1 = await School.create({
    name: "Green Valley Academy",
    code: "GVA",
    email: "info@greenvalley.edu",
    phone: "+92-300-1234567",
    address: { street: "123 Education Lane", city: "Islamabad", state: "ICT", country: "Pakistan" },
    plan: "premium",
    isActive: true,
    currentSession: "2024-2025",
  });

  const school2 = await School.create({
    name: "Sunrise International School",
    code: "SIS",
    email: "info@sunrise.edu",
    phone: "+92-321-7654321",
    address: { street: "456 Knowledge Rd", city: "Lahore", state: "Punjab", country: "Pakistan" },
    plan: "basic",
    isActive: true,
    currentSession: "2024-2025",
  });

  console.log("🏫 Created schools:", school1.name, school2.name);

  // Create users
  const superadmin = await User.create({
    name: "Platform Admin",
    email: "super@falsfa.com",
    password: "admin123",
    role: "superadmin",
    school: null,
  });

  const schooladmin = await User.create({
    name: "Dr. Ahmad Khan",
    email: "admin@greenvalley.edu",
    password: "admin123",
    role: "schooladmin",
    school: school1._id,
  });

  const teacher = await User.create({
    name: "Ms. Sarah Ali",
    email: "sarah@greenvalley.edu",
    password: "admin123",
    role: "teacher",
    school: school1._id,
  });

  const student = await User.create({
    name: "Ali Hassan",
    email: "ali@greenvalley.edu",
    password: "admin123",
    role: "student",
    school: school1._id,
  });

  console.log("👤 Created users: superadmin, schooladmin, teacher, student (password: admin123)");

  // Create students for school1
  const sections = ["A", "B", "C"];
  const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

  const studentDocs = [];
  for (let i = 0; i < 40; i++) {
    const name = STUDENTS_DATA[i % STUDENTS_DATA.length];
    const cls = classes[Math.floor(i / 4) % classes.length];
    const sec = sections[i % 3];
    studentDocs.push({
      school: school1._id,
      name: name,
      rollNo: `RN-2024-${String(i + 1).padStart(3, "0")}`,
      gender: i % 2 === 0 ? "male" : "female",
      class: cls,
      section: sec,
      session: "2024-2025",
      admissionDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      parentName: `Parent of ${name}`,
      parentPhone: `+92-3${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
      email: `student${i + 1}@greenvalley.edu`,
      isActive: i % 7 !== 0, // ~14% inactive
      feeStatus: ["paid", "pending", "partial"][i % 3],
    });
  }

  await Student.insertMany(studentDocs);

  // Update school stats
  await School.findByIdAndUpdate(school1._id, {
    "stats.totalStudents": studentDocs.length,
    "stats.totalStaff": 2,
    "stats.totalClasses": 10,
  });

  console.log(`📚 Created ${studentDocs.length} students for ${school1.name}`);
  console.log("\n✅ Seed complete! You can now login with:");
  console.log("   Super Admin:  super@falsfa.com / admin123");
  console.log("   School Admin: admin@greenvalley.edu / admin123");
  console.log("   Teacher:      sarah@greenvalley.edu / admin123");
  console.log("   Student:      ali@greenvalley.edu / admin123");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
