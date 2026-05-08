// ── Role Types ──────────────────────────────────────────────────
// UserRole: 'superadmin' | 'schooladmin' | 'teacher' | 'student'

// ── User ────────────────────────────────────────────────────────
// User: {
//   _id: string
//   name: string
//   email: string
//   role: UserRole
//   school?: string
//   avatar?: string
// }

// ── School / Tenant Config ──────────────────────────────────────
// SchoolConfig: {
//   name: string
//   logo?: string
//   primaryColor: string
//   secondaryColor?: string
//   address?: string
//   phone?: string
//   email?: string
// }

// TenantState: {
//   tenantId: string | null
//   schoolConfig: SchoolConfig | null
//   userRole: UserRole | null
// }

// ── Student ─────────────────────────────────────────────────────
// StudentStatus: 'active' | 'suspended' | 'graduated'

// Student: {
//   _id: string
//   fullName: string
//   rollNumber: string
//   class: string
//   section?: string
//   parentContact: string
//   enrollmentDate: string
//   status: StudentStatus
//   email?: string
//   avatar?: string
//   tenantId: string
// }

// ── Examination ─────────────────────────────────────────────────
// ExamType: 'midterm' | 'final' | 'quiz'
// Grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'

// GradingScale: {
//   grade: Grade
//   minPercentage: number
//   maxPercentage: number
// }

// ExamResult: {
//   _id: string
//   studentId: string
//   studentName: string
//   rollNumber: string
//   marksObtained: number
//   maxMarks: number
//   percentage: number
//   grade: Grade
// }

// ExamConfig: {
//   class: string
//   section: string
//   examType: ExamType
//   subject: string
//   maxMarks: number
//   date: string
// }

// ── Subscription / Super Admin ──────────────────────────────────
// SubscriptionPlan: 'basic' | 'pro' | 'enterprise'
// SchoolStatus: 'active' | 'suspended' | 'pending'

// School: {
//   _id: string
//   tenantId: string
//   name: string
//   logo?: string
//   plan: SubscriptionPlan
//   status: SchoolStatus
//   studentsCount: number
//   teachersCount: number
//   subscriptionExpiry: string
//   monthlyRevenue: number
//   createdAt: string
// }

// DashboardStats: {
//   totalRevenue: number
//   activeSchools: number
//   expiringSubscriptions: number
//   pendingOnboarding: number
//   revenueGrowth: number
//   schoolGrowth: number
// }

// MonthlyData: {
//   month: string
//   schools: number
//   revenue: number
// }

export const USER_ROLES = {
  SUPERADMIN: 'superadmin',
  SCHOOLADMIN: 'schooladmin',
  TEACHER: 'teacher',
  STUDENT: 'student',
}

export const STUDENT_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  GRADUATED: 'graduated',
}

export const EXAM_TYPES = {
  MIDTERM: 'midterm',
  FINAL: 'final',
  QUIZ: 'quiz',
}

export const GRADES = {
  A_PLUS: 'A+',
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  F: 'F',
}
