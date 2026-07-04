export enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE"
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  employeeId: string;
  isEmailVerified: boolean;
  verificationCode?: string;
  passwordHash?: string;
  createdAt: string;
}

export interface SalaryStructure {
  base: number;
  allowance: number;
  deductions: number;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface AchievementBadge {
  id: string;
  badgeName: string;
  description: string;
  icon: string;
  awardedAt: string;
}

export interface Employee {
  id: string; // matches EmployeeId e.g. "EMP-001"
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  jobTitle: string;
  department: string;
  joinDate: string;
  status: "Active" | "Onboarding" | "Terminated";
  profilePicture: string;
  salaryStructure: SalaryStructure;
  documents: EmployeeDocument[];
  achievements: AchievementBadge[];
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:MM:SS
  checkOut?: string; // HH:MM:SS
  status: "Present" | "Absent" | "Half-day" | "Leave";
  note?: string;
  isApproved: boolean;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: "Paid Leave" | "Sick Leave" | "Unpaid Leave";
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  remarks: string;
  status: "Pending" | "Approved" | "Rejected";
  adminComments?: string;
  createdAt: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string; // e.g. "June 2026"
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: "Draft" | "Paid";
  paidAt?: string;
}

export interface HRActivity {
  id: string;
  employeeId: string;
  employeeName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface HRNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
