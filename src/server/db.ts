import fs from "fs";
import path from "path";
import bcryptjs from "bcryptjs";
import { 
  User, 
  Employee, 
  Attendance, 
  LeaveRequest, 
  Payroll, 
  HRActivity, 
  HRNotification,
  UserRole
} from "../types.js"; // In Node.js CJS/ESM compatibility, we'll write relative imports

const DATA_FILE = path.join(process.cwd(), "src", "server", "data.json");

export interface DBState {
  users: User[];
  employees: Employee[];
  attendance: Attendance[];
  leaveRequests: LeaveRequest[];
  payrollList: Payroll[];
  activities: HRActivity[];
  notifications: HRNotification[];
}

function ensureDirExists() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getInitialState(): DBState {
  const users: User[] = [
    {
      id: "u-001",
      email: "admin@hrms.com",
      role: UserRole.ADMIN,
      employeeId: "EMP-001",
      isEmailVerified: true,
      createdAt: "2026-06-01T08:00:00Z"
    },
    {
      id: "u-002",
      email: "aarav.patel@hrms.com",
      role: UserRole.EMPLOYEE,
      employeeId: "EMP-002",
      isEmailVerified: true,
      createdAt: "2026-06-02T09:00:00Z"
    },
    {
      id: "u-003",
      email: "diya.iyer@hrms.com",
      role: UserRole.EMPLOYEE,
      employeeId: "EMP-003",
      isEmailVerified: true,
      createdAt: "2026-06-03T10:00:00Z"
    },
    {
      id: "u-004",
      email: "amit.verma@hrms.com",
      role: UserRole.EMPLOYEE,
      employeeId: "EMP-004",
      isEmailVerified: false,
      verificationCode: "782941",
      createdAt: "2026-07-01T11:00:00Z"
    }
  ];

  const employees: Employee[] = [
    {
      id: "EMP-001",
      userId: "u-001",
      name: "Priya Sharma",
      email: "admin@hrms.com",
      phone: "+91 98765 43210",
      address: "100, Corporate Boulevard, Connaught Place, New Delhi, India",
      jobTitle: "HR Director",
      department: "Human Resources",
      joinDate: "2026-01-15",
      status: "Active",
      profilePicture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      salaryStructure: { base: 120000, allowance: 15000, deductions: 8000 },
      documents: [
        { id: "doc-101", name: "Employment_Agreement_Priya_Sharma.pdf", url: "#", uploadedAt: "2026-01-15T10:00:00Z" }
      ],
      achievements: [
        { id: "ach-1", badgeName: "Leadership Excellence", description: "Successfully established the corporate HR guidelines", icon: "Award", awardedAt: "2026-05-15" }
      ]
    },
    {
      id: "EMP-002",
      userId: "u-002",
      name: "Aarav Patel",
      email: "aarav.patel@hrms.com",
      phone: "+91 91234 56789",
      address: "123, Tech Park Lane, Whitefield, Bengaluru, Karnataka, India",
      jobTitle: "Senior Software Engineer",
      department: "Engineering",
      joinDate: "2026-02-01",
      status: "Active",
      profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      salaryStructure: { base: 95000, allowance: 8000, deductions: 5000 },
      documents: [
        { id: "doc-201", name: "Offer_Letter_Aarav_Patel.pdf", url: "#", uploadedAt: "2026-02-01T09:00:00Z" },
        { id: "doc-202", name: "NDA_Signed.pdf", url: "#", uploadedAt: "2026-02-01T14:30:00Z" }
      ],
      achievements: [
        { id: "ach-2", badgeName: "Perfect Attendance", description: "Zero absences for three consecutive months", icon: "CalendarCheck", awardedAt: "2026-05-01" },
        { id: "ach-3", badgeName: "Problem Solver", description: "Quick resolution of critical system bugs", icon: "Cpu", awardedAt: "2026-06-20" }
      ]
    },
    {
      id: "EMP-003",
      userId: "u-003",
      name: "Diya Iyer",
      email: "diya.iyer@hrms.com",
      phone: "+91 98765 12345",
      address: "456 Design Road, Chennai, Tamil Nadu, India",
      jobTitle: "Senior Product Manager",
      department: "Product Management",
      joinDate: "2026-03-10",
      status: "Active",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      salaryStructure: { base: 105000, allowance: 10000, deductions: 6000 },
      documents: [
        { id: "doc-301", name: "Signed_Contract_Diya_Iyer.pdf", url: "#", uploadedAt: "2026-03-10T10:00:00Z" }
      ],
      achievements: [
        { id: "ach-4", badgeName: "Rising Star", description: "Successfully delivered the HRMS product roadmap", icon: "Sparkles", awardedAt: "2026-06-15" }
      ]
    },
    {
      id: "EMP-004",
      userId: "u-004",
      name: "Amit Verma",
      email: "amit.verma@hrms.com",
      phone: "+91 99999 88888",
      address: "789 Testing Way, Mumbai, Maharashtra, India",
      jobTitle: "QA Engineer",
      department: "Quality Assurance",
      joinDate: "2026-07-01",
      status: "Onboarding",
      profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      salaryStructure: { base: 60000, allowance: 5000, deductions: 3500 },
      documents: [],
      achievements: []
    }
  ];

  // Prepopulate last 5 days of attendance
  // Dates: 2026-06-29, 2026-06-30, 2026-07-01, 2026-07-02, 2026-07-03
  const attendance: Attendance[] = [
    // Priya Sharma
    { id: "att-1", employeeId: "EMP-001", employeeName: "Priya Sharma", date: "2026-06-29", checkIn: "08:45:00", checkOut: "17:15:00", status: "Present", isApproved: true },
    { id: "att-2", employeeId: "EMP-001", employeeName: "Priya Sharma", date: "2026-06-30", checkIn: "08:52:00", checkOut: "17:05:00", status: "Present", isApproved: true },
    { id: "att-3", employeeId: "EMP-001", employeeName: "Priya Sharma", date: "2026-07-01", checkIn: "08:50:00", checkOut: "17:10:00", status: "Present", isApproved: true },
    { id: "att-4", employeeId: "EMP-001", employeeName: "Priya Sharma", date: "2026-07-02", checkIn: "08:42:00", checkOut: "17:30:00", status: "Present", isApproved: true },
    { id: "att-5", employeeId: "EMP-001", employeeName: "Priya Sharma", date: "2026-07-03", checkIn: "08:40:00", status: "Present", isApproved: false }, // Today, still active / checked-in

    // Aarav Patel (Senior Software Engineer, very punctual)
    { id: "att-6", employeeId: "EMP-002", employeeName: "Aarav Patel", date: "2026-06-29", checkIn: "08:55:00", checkOut: "17:30:00", status: "Present", isApproved: true },
    { id: "att-7", employeeId: "EMP-002", employeeName: "Aarav Patel", date: "2026-06-30", checkIn: "08:57:00", checkOut: "17:45:00", status: "Present", isApproved: true },
    { id: "att-8", employeeId: "EMP-002", employeeName: "Aarav Patel", date: "2026-07-01", checkIn: "08:48:00", checkOut: "17:35:00", status: "Present", isApproved: true },
    { id: "att-9", employeeId: "EMP-002", employeeName: "Aarav Patel", date: "2026-07-02", checkIn: "08:51:00", checkOut: "17:50:00", status: "Present", isApproved: true },
    { id: "att-10", employeeId: "EMP-002", employeeName: "Aarav Patel", date: "2026-07-03", checkIn: "08:50:00", status: "Present", isApproved: false }, // Checked-in today

    // Diya Iyer (Senior PM, was sick 1 day, half-day 1 day)
    { id: "att-11", employeeId: "EMP-003", employeeName: "Diya Iyer", date: "2026-06-29", checkIn: "09:15:00", checkOut: "17:00:00", status: "Present", isApproved: true },
    { id: "att-12", employeeId: "EMP-003", employeeName: "Diya Iyer", date: "2026-06-30", checkIn: "09:30:00", checkOut: "13:30:00", status: "Half-day", note: "Doctor appointment", isApproved: true },
    { id: "att-13", employeeId: "EMP-003", employeeName: "Diya Iyer", date: "2026-07-01", status: "Absent", note: "Unannounced sickness", isApproved: true },
    { id: "att-14", employeeId: "EMP-003", employeeName: "Diya Iyer", date: "2026-07-02", checkIn: "09:05:00", checkOut: "17:05:00", status: "Present", isApproved: true },
    { id: "att-15", employeeId: "EMP-003", employeeName: "Diya Iyer", date: "2026-07-03", status: "Leave", note: "Approved Leave", isApproved: true },

    // Amit Verma (New starter onboarding)
    { id: "att-16", employeeId: "EMP-004", employeeName: "Amit Verma", date: "2026-07-01", checkIn: "08:58:00", checkOut: "17:00:00", status: "Present", isApproved: true },
    { id: "att-17", employeeId: "EMP-004", employeeName: "Amit Verma", date: "2026-07-02", checkIn: "09:02:00", checkOut: "17:00:00", status: "Present", isApproved: true },
    { id: "att-18", employeeId: "EMP-004", employeeName: "Amit Verma", date: "2026-07-03", checkIn: "09:00:00", status: "Present", isApproved: false }
  ];

  const leaveRequests: LeaveRequest[] = [
    {
      id: "leave-1",
      employeeId: "EMP-003",
      employeeName: "Diya Iyer",
      leaveType: "Sick Leave",
      startDate: "2026-07-03",
      endDate: "2026-07-03",
      remarks: "Recovering from throat infection, doctor advised complete rest",
      status: "Approved",
      adminComments: "Approved, hope you recover quickly!",
      createdAt: "2026-07-02T16:00:00Z"
    },
    {
      id: "leave-2",
      employeeId: "EMP-002",
      employeeName: "Aarav Patel",
      leaveType: "Paid Leave",
      startDate: "2026-07-10",
      endDate: "2026-07-14",
      remarks: "Family vacation trip",
      status: "Pending",
      createdAt: "2026-07-03T11:30:00Z"
    },
    {
      id: "leave-3",
      employeeId: "EMP-004",
      employeeName: "Amit Verma",
      leaveType: "Unpaid Leave",
      startDate: "2026-07-20",
      endDate: "2026-07-21",
      remarks: "Personal commitments back home",
      status: "Pending",
      createdAt: "2026-07-03T14:15:00Z"
    }
  ];

  const payrollList: Payroll[] = [
    // June 2026 Payroll for Priya Sharma
    {
      id: "pay-101",
      employeeId: "EMP-001",
      employeeName: "Priya Sharma",
      month: "June 2026",
      baseSalary: 120000,
      allowances: 15000,
      deductions: 8000,
      netSalary: 127000,
      status: "Paid",
      paidAt: "2026-06-30T10:00:00Z"
    },
    // June 2026 Payroll for Aarav Patel
    {
      id: "pay-102",
      employeeId: "EMP-002",
      employeeName: "Aarav Patel",
      month: "June 2026",
      baseSalary: 95000,
      allowances: 8000,
      deductions: 5000,
      netSalary: 98000,
      status: "Paid",
      paidAt: "2026-06-30T10:00:00Z"
    },
    // June 2026 Payroll for Diya Iyer
    {
      id: "pay-103",
      employeeId: "EMP-003",
      employeeName: "Diya Iyer",
      month: "June 2026",
      baseSalary: 105000,
      allowances: 10000,
      deductions: 6000,
      netSalary: 109000,
      status: "Paid",
      paidAt: "2026-06-30T10:00:00Z"
    }
  ];

  const activities: HRActivity[] = [
    { id: "act-1", employeeId: "EMP-001", employeeName: "Priya Sharma", action: "Approved Leave", details: "Approved Sick Leave request for Diya Iyer", timestamp: "2026-07-02T18:30:00Z" },
    { id: "act-2", employeeId: "EMP-002", employeeName: "Aarav Patel", action: "Applied Leave", details: "Submitted a Paid Leave request for July 10-14", timestamp: "2026-07-03T11:30:00Z" },
    { id: "act-3", employeeId: "EMP-004", employeeName: "Amit Verma", action: "Sign Up", details: "Registered Amit Verma on HRMS", timestamp: "2026-07-01T11:00:00Z" },
    { id: "act-4", employeeId: "EMP-002", employeeName: "Aarav Patel", action: "Badge Earned", details: "Earned badge: 'Problem Solver' for critical resolution", timestamp: "2026-06-20T16:00:00Z" }
  ];

  const notifications: HRNotification[] = [
    { id: "not-1", userId: "u-003", title: "Leave Approved", message: "Your Sick Leave request for 2026-07-03 has been approved.", isRead: false, createdAt: "2026-07-02T18:30:00Z" },
    { id: "not-2", userId: "u-001", title: "New Leave Application", message: "Aarav Patel has submitted a leave request for July 10-14.", isRead: false, createdAt: "2026-07-03T11:30:00Z" },
    { id: "not-3", userId: "u-001", title: "New Leave Application", message: "Amit Verma has submitted a leave request for July 20-21.", isRead: false, createdAt: "2026-07-03T14:15:00Z" }
  ];

  return { users, employees, attendance, leaveRequests, payrollList, activities, notifications };
}

export function readDB(): DBState {
  ensureDirExists();
  let data: DBState;
  if (!fs.existsSync(DATA_FILE)) {
    data = getInitialState();
    writeDB(data);
  } else {
    try {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      data = JSON.parse(raw);
    } catch (err) {
      console.error("Error reading database file, returning default data:", err);
      data = getInitialState();
    }
  }

  // Ensure all seed users have bcrypt password hashes (Password123!)
  let hasUpdates = false;
  data.users.forEach(u => {
    if (!u.passwordHash) {
      u.passwordHash = bcryptjs.hashSync("Password123!", 10);
      hasUpdates = true;
    }
  });

  if (hasUpdates) {
    writeDB(data);
  }

  return data;
}

export function writeDB(state: DBState): void {
  ensureDirExists();
  fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
}
