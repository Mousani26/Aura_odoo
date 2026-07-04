import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import { AttendanceWidget } from "./components/AttendanceWidget.tsx";
import { LeaveWidget } from "./components/LeaveWidget.tsx";
import { PayrollWidget } from "./components/PayrollWidget.tsx";
import { EmployeeDirectory } from "./components/EmployeeDirectory.tsx";
import { AIPanel } from "./components/AIPanel.tsx";
import OrgStructure from "./components/OrgStructure.tsx";
import DocLocker from "./components/DocLocker.tsx";
import AttendanceHeatmap from "./components/AttendanceHeatmap.tsx";
import PaycheckSimulator from "./components/PaycheckSimulator.tsx";
import RewardsVouchers from "./components/RewardsVouchers.tsx";
import SupportDesk from "./components/SupportDesk.tsx";
import Recruitment from "./components/Recruitment.tsx";
import AnalyticsHub from "./components/AnalyticsHub.tsx";
import { 
  Users, Calendar, CreditCard, Clock, Bot, LogOut, Sun, Moon, 
  Bell, Award, Briefcase, Activity, CalendarDays, ShieldAlert,
  ArrowRight, Key, Mail, CheckCircle2, AlertTriangle, ShieldCheck,
  Network, Lock, CalendarRange, Landmark, Gift, LifeBuoy, UserPlus,
  BarChart2, CalendarCheck, Palmtree, Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import auraBotImg from "./assets/images/aura_bot_1783154193905.jpg";

function RootApp() {
  const { 
    token, user, employee, notifications, activeRole, markAsRead,
    signUp, verifyEmail, signIn, signOut, toggleRole, isLoading
  } = useAuth();

  const [darkMode, setDarkMode] = useState(false);
  const [activeModule, setActiveModule] = useState<
    "directory" | "org" | "attendance" | "heatmap" | "leave" | "payroll" | "simulator" | "locker" | "rewards" | "ai" | "support" | "recruitment" | "analytics"
  >("directory");
  const [showNotifications, setShowNotifications] = useState(false);
  const [readEmpNotifIds, setReadEmpNotifIds] = useState<string[]>([]);
  
  // Sign In / Up State
  const [isSignUp, setIsSignUp] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  // Input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  
  const [verificationCode, setVerificationCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Stats / Dashboard snapshots
  const [summaryData, setSummaryData] = useState<any>(null);

  const fetchSummary = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/dashboard/summary", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSummaryData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Re-evaluate user token and trigger immediate dashboard data fetch upon successful session establishment
  useEffect(() => {
    if (token) {
      // Clear form states & verification overlays to transition cleanly to authorized dashboard view
      setFormError(null);
      setSuccessMsg(null);
      setVerificationRequired(false);
      
      // Perform immediate dashboard data fetch
      fetchSummary();
    }
  }, [token, activeRole, activeModule]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);
    try {
      await signIn({ email, password });
      setEmail("");
      setPassword("");
    } catch (err: any) {
      if (err.message.startsWith("UNVERIFIED:")) {
        const code = err.message.split(":")[1];
        setVerificationEmail(email);
        setVerificationRequired(true);
        setFormError(`Your email is not verified yet. Verification code is: ${code}`);
      } else {
        setFormError(err.message || "Failed to sign in.");
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    try {
      const res = await signUp({
        email, password, role, name, phone, address, jobTitle, department
      });
      setVerificationEmail(email);
      setVerificationRequired(true);
      setSuccessMsg(`Registration initiated! Your 6-digit email verification code is: ${res.verificationCode}`);
    } catch (err: any) {
      setFormError(err.message || "Failed to register.");
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const success = await verifyEmail(verificationEmail, verificationCode);
    if (success) {
      setVerificationRequired(false);
      setVerificationCode("");
      setEmail("");
      setPassword("");
    } else {
      setFormError("Invalid verification code. Please try again.");
    }
  };

  const defaultEmpNotifications = [
    {
      id: "emp-notif-1",
      userId: user?.id || "u-002",
      title: "🏆 Achievement Unlocked",
      message: "Congratulations! You've earned the Innovation Excellence Award. +150 reward points have been added to your account.",
      isRead: readEmpNotifIds.includes("emp-notif-1"),
      createdAt: "2026-07-04T02:00:00Z"
    },
    {
      id: "emp-notif-2",
      userId: user?.id || "u-002",
      title: "💳 Salary Credited",
      message: "Your July 2026 salary has been successfully credited to your registered bank account.",
      isRead: readEmpNotifIds.includes("emp-notif-2"),
      createdAt: "2026-07-03T10:00:00Z"
    },
    {
      id: "emp-notif-3",
      userId: user?.id || "u-002",
      title: "📄 Payslip Available",
      message: "Your July 2026 payslip is now available. You can download it from the Payroll section.",
      isRead: readEmpNotifIds.includes("emp-notif-3"),
      createdAt: "2026-07-03T09:00:00Z"
    },
    {
      id: "emp-notif-4",
      userId: user?.id || "u-002",
      title: "📅 Leave Request Approved",
      message: "Your leave request for 10–14 July 2026 has been approved by your reporting manager.",
      isRead: readEmpNotifIds.includes("emp-notif-4"),
      createdAt: "2026-07-02T15:00:00Z"
    },
    {
      id: "emp-notif-5",
      userId: user?.id || "u-002",
      title: "🤖 Aura AI Insight",
      message: "Great job! Your attendance this month is 98%, placing you among the Top 10% of employees in your department.",
      isRead: readEmpNotifIds.includes("emp-notif-5"),
      createdAt: "2026-07-02T08:00:00Z"
    }
  ];

  const currentNotifications = activeRole === "EMPLOYEE" ? defaultEmpNotifications : notifications;

  const unreadNotifsCount = currentNotifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    if (id.startsWith("emp-notif-")) {
      setReadEmpNotifIds(prev => [...prev, id]);
    } else {
      markAsRead(id);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-blue-600/20 border-t-blue-600 animate-spin"></div>
            <ShieldCheck className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="font-extrabold text-sm tracking-tight uppercase text-blue-500">Aura Engine</h3>
            <span className="text-[10px] text-slate-400 block tracking-wider uppercase mt-1 animate-pulse">Loading secure profile...</span>
          </div>
        </div>
      </div>
    );
  }

  // Render Authentication and Onboarding Splash Screens
  if (!token) {
    return (
      <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
        {/* Landing Page Navbar */}
        <header className={`p-4 border-b flex items-center justify-between ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-xl text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight">Aura Portal</h1>
              <span className="text-[9px] uppercase tracking-wider text-blue-500 font-bold block">Every workday, perfectly aligned</span>
            </div>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl bg-slate-800/10 hover:bg-slate-800/20 text-slate-400">
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </header>

        {/* Hero Landing + Auth Forms */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Landing Side */}
          <div className="md:col-span-6 space-y-5">
            <span className="bg-blue-600/10 text-blue-400 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-blue-500/20">
              Demo Ready Platform
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              A Complete <span className="text-blue-500">Corporate Aura</span> Experience
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              A unified system designed to manage staff profiles, coordinate attendance workflows, process leaves, and generate payroll slips under precise real-time AI talent guidelines.
            </p>

            {/* Quick Demo Preloads */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl max-w-md space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-blue-500" /> Preloaded Demo Credentials:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button 
                  onClick={() => { setEmail("admin@hrms.com"); setPassword("Password123!"); setIsSignUp(false); }}
                  className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl hover:border-slate-700 text-left cursor-pointer transition-colors"
                >
                  <strong className="text-blue-400 block">HR / Admin Login</strong>
                  admin@hrms.com
                </button>
                <button 
                  onClick={() => { setEmail("aarav.patel@hrms.com"); setPassword("Password123!"); setIsSignUp(false); }}
                  className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl hover:border-slate-700 text-left cursor-pointer transition-colors"
                >
                  <strong className="text-indigo-400 block">Employee Login</strong>
                  aarav.patel@hrms.com
                </button>
              </div>
              <p className="text-[10px] text-slate-500">*Password for all preloaded records is: <strong>Password123!</strong></p>
            </div>
          </div>

          {/* Form Side */}
          <div className="md:col-span-6">
            <div className={`p-6 md:p-8 rounded-3xl border shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
              {verificationRequired ? (
                /* Verification View */
                <form onSubmit={handleVerificationSubmit} className="space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold">Email Verification Required</h3>
                    <p className="text-xs text-slate-400">We've sent a 6-digit confirmation code to {verificationEmail}</p>
                  </div>

                  {successMsg && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs leading-normal">
                      {successMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-400">Verification Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 123456"
                      value={verificationCode}
                      onChange={e => setVerificationCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none"
                    />
                  </div>

                  {formError && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs">
                      {formError}
                    </div>
                  )}

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1">
                    Verify & Login <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
              ) : isSignUp ? (
                /* Register Form */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold">Create Corporate Profile</h3>
                    <p className="text-xs text-slate-400">Submit parameters to trigger HR onboarding workflows.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Full Name</label>
                      <input
                        type="text"
                        placeholder="Aarav Patel"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Contact Phone</label>
                      <input
                        type="text"
                        placeholder="+91 91234 56789"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Email Address</label>
                      <input
                        type="email"
                        placeholder="aarav.patel@company.com"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Corporate Role</label>
                      <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                      >
                        <option value="EMPLOYEE">Employee</option>
                        <option value="ADMIN">HR Admin / Officer</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Job Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Software Engineer"
                        value={jobTitle}
                        onChange={e => setJobTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Department</label>
                      <input
                        type="text"
                        placeholder="e.g. Engineering"
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Secure Password</label>
                    <input
                      type="password"
                      placeholder="Minimum 8 chars, Upper, Special..."
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    />
                  </div>

                  {formError && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-2.5 rounded-lg text-xs leading-normal">
                      {formError}
                    </div>
                  )}

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-xs cursor-pointer">
                    Register Profile
                  </button>

                  <div className="text-center text-xs mt-3 text-slate-400">
                    Already registered?{" "}
                    <button type="button" onClick={() => { setIsSignUp(false); setFormError(null); }} className="text-blue-400 font-bold underline cursor-pointer">
                      Sign In here
                    </button>
                  </div>
                </form>
              ) : (
                /* Login Form */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold">Secure Access Terminal</h3>
                    <p className="text-xs text-slate-400">Enter registered email credentials to authenticate.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-400">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. admin@hrms.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-400">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200"
                    />
                  </div>

                  {formError && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-2.5 rounded-lg text-xs">
                      {formError}
                    </div>
                  )}

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer">
                    Log In Snapshot
                  </button>

                  <div className="text-center text-xs mt-3 text-slate-400">
                    Need onboarding?{" "}
                    <button type="button" onClick={() => { setIsSignUp(true); setFormError(null); }} className="text-blue-400 font-bold underline cursor-pointer">
                      Create an account
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>

        <footer className="p-4 text-center border-t border-slate-900 text-xs text-slate-500">
          © 2026 Aura Solutions. All workflows and analytics verified under strict sandbox credentials.
        </footer>
      </div>
    );
  }

  // Auth is validated, render standard Employee or Admin application shell
  return (
    <div className={`min-h-screen flex transition-all duration-300 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      {/* Side Control Rail (Unified Glassmorphism Bento Side Menu) */}
      <aside className={`w-64 border-r p-4 flex flex-col justify-between shrink-0 ${darkMode ? "bg-slate-900/40 border-slate-850" : "bg-white border-slate-200"}`}>
        <div className="space-y-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800/40">
            <div className="bg-blue-600 p-1.5 rounded-xl text-white">
              <ShieldCheck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-xs tracking-tight uppercase">Aura Engine</h2>
              <span className="text-[9px] text-blue-500 font-bold block tracking-wider uppercase">Aligned Workflow</span>
            </div>
          </div>

          {/* User profile segment */}
          <div style={{ backgroundColor: "#f9ff00", borderColor: "#8b9ad4", borderRadius: "18px", borderWidth: "2.666667px" }} className="p-3 border flex items-center gap-3 bg-slate-50 dark:bg-slate-950/40">
            <img
              src={employee?.profilePicture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
              alt="Profile"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-800"
            />
            <div className="min-w-0 text-xs">
              <span style={{ borderColor: "#2e2d97", borderStyle: "ridge", borderWidth: "0px", color: "#000000" }} className="font-bold block truncate text-slate-800 dark:text-slate-200 text-sm">{employee?.name || "User"}</span>
              <span className="block truncate text-slate-500 dark:text-slate-400 text-[11px]">{employee?.jobTitle || "Corporate Member"}</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveModule("directory")}
              className={`w-full px-4 py-2 text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                activeModule === "directory" ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-4 h-4" /> Company Directory
            </button>
            <button
              onClick={() => setActiveModule("org")}
              className={`w-full px-4 py-2 text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                activeModule === "org" ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Network className="w-4 h-4" /> Org Structure
            </button>
            <button
              onClick={() => setActiveModule("attendance")}
              className={`w-full px-4 py-2 text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                activeModule === "attendance" ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Clock className="w-4 h-4" /> Attendance Track
            </button>
            <button
              onClick={() => setActiveModule("heatmap")}
              className={`w-full px-4 py-2 text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                activeModule === "heatmap" ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <CalendarRange className="w-4 h-4" /> Yearly Heatmap
            </button>
            <button
              onClick={() => setActiveModule("leave")}
              className={`w-full px-4 py-2 text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                activeModule === "leave" ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Calendar className="w-4 h-4" /> Leave Management
            </button>
            <button
              onClick={() => setActiveModule("payroll")}
              className={`w-full px-4 py-2 text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                activeModule === "payroll" ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <CreditCard className="w-4 h-4" /> Compensation & Pay
            </button>
            <button
              onClick={() => setActiveModule("simulator")}
              className={`w-full px-4 py-2 text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                activeModule === "simulator" ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Landmark className="w-4 h-4" /> Paycheck Simulator
            </button>
            <button
              onClick={() => setActiveModule("locker")}
              className={`w-full px-4 py-2 text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                activeModule === "locker" ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Lock className="w-4 h-4" /> Document Locker
            </button>
            <button
              onClick={() => setActiveModule("rewards")}
              className={`w-full px-4 py-2 text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                activeModule === "rewards" ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Gift className="w-4 h-4" /> Performance Rewards
            </button>
            <button
              onClick={() => setActiveModule("ai")}
              className={`w-full px-4 py-2 text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                activeModule === "ai" ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Bot className="w-4 h-4" /> Aura Co-Pilot
            </button>
            <button
              onClick={() => setActiveModule("support")}
              className={`w-full px-4 py-2 text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                activeModule === "support" ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LifeBuoy className="w-4 h-4" /> Support Desk
            </button>
            <button
              onClick={() => setActiveModule("analytics")}
              className={`w-full px-4 py-2 text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                activeModule === "analytics" ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Analytics & Reports
            </button>
            {activeRole === "ADMIN" && (
              <button
                onClick={() => setActiveModule("recruitment")}
                className={`w-full px-4 py-2 text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                  activeModule === "recruitment" ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <UserPlus className="w-4 h-4" /> Recruitment
              </button>
            )}
          </nav>
        </div>

        {/* Foot Control */}
        <div className="space-y-2">
          {/* Admin Switching Emulation trigger */}
          {user?.role === "ADMIN" && (
            <button
              onClick={toggleRole}
              className="w-full text-left p-3 rounded-2xl bg-[#000000] border border-dashed border-indigo-500/30 hover:border-indigo-500/60 flex items-center gap-2 text-[10px] text-indigo-400 cursor-pointer font-bold tracking-wide uppercase transition-colors"
            >
              <Award className="w-4 h-4 text-amber-400 animate-bounce" />
              Switch view as {activeRole === "ADMIN" ? "Employee" : "Admin"}
            </button>
          )}

          <div className="flex gap-1 justify-between">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 hover:bg-slate-900 cursor-pointer text-slate-400">
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={signOut}
              className="flex-1 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 p-2.5 rounded-xl text-xs font-bold text-rose-400 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Upper Header segment */}
        <header className={`px-6 py-4 flex items-center justify-between border-b ${darkMode ? "bg-slate-900/20 border-slate-900" : "bg-white border-slate-200"}`}>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-extrabold text-blue-500 bg-blue-600/10 border border-blue-500/20 px-2.5 py-1 rounded-xl">
              System Context
            </span>
            <div className="text-[11px] text-slate-400 font-medium">
              System Date: <strong className="text-slate-300">Friday, July 3rd, 2026</strong>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications trigger */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ backgroundColor: "#d4ffe8" }}
                className="p-2 rounded-xl border border-slate-850 hover:text-white relative cursor-pointer"
              >
                <Bell style={{ color: "#065f46" }} className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-[10px] text-white flex items-center justify-center font-bold">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs"
                  >
                    <div className="bg-slate-950 p-3 border-b border-slate-800 flex justify-between items-center">
                      <span className="font-bold text-slate-200">Alert Notification Center</span>
                      <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white">Close</button>
                    </div>
                    <div className="divide-y divide-slate-850 max-h-[250px] overflow-y-auto">
                      {currentNotifications.length === 0 ? (
                        <p className="p-4 text-slate-500 text-center italic">No new notifications.</p>
                      ) : (
                        currentNotifications.map(notif => (
                          <div 
                            key={notif.id} 
                            onClick={() => handleMarkAsRead(notif.id)}
                            className={`p-3 cursor-pointer transition-colors ${notif.isRead ? "bg-slate-900/20" : "bg-blue-600/5 hover:bg-blue-600/10"}`}
                          >
                            <div className="flex justify-between items-center font-bold">
                              <span className="text-slate-200">{notif.title}</span>
                              <span className="text-[9px] text-slate-500">{notif.createdAt.split("T")[0]}</span>
                            </div>
                            <p className="text-slate-400 mt-1 leading-normal text-[11px]">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick stats tags */}
            <div className="text-xs bg-slate-950/40 p-2 border border-slate-850 rounded-xl font-medium text-slate-300">
              Logged in: <strong className="text-slate-100">{employee?.name}</strong> as <strong className="text-blue-400">{activeRole}</strong>
            </div>
          </div>
        </header>

        {/* Dashboard Panels Area */}
        <div className="p-6 space-y-6 flex-1">
          {/* Stats Bento Grid Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[20px]">
            {activeRole === "ADMIN" ? (
              <>
                {/* Admin Card 1 - Company Staff */}
                <div 
                  className={`relative p-6 rounded-[24px] border transition-all duration-300 hover:shadow-xl hover:scale-[1.01] overflow-hidden flex flex-col justify-between h-[230px] ${
                    darkMode 
                      ? "bg-slate-900/90 border-blue-500/30" 
                      : "bg-gradient-to-br from-[#ebf5ff] via-[#e5f1ff] to-[#dcf0ff] border-[#bfe0ff]"
                  }`}
                >
                  {/* Dot Grid Pattern */}
                  <div className={`absolute top-4 right-4 ${darkMode ? "text-blue-500/10" : "text-blue-400/30"}`}>
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="currentColor">
                      <circle cx="4" cy="4" r="1.5" />
                      <circle cx="12" cy="4" r="1.5" />
                      <circle cx="20" cy="4" r="1.5" />
                      <circle cx="28" cy="4" r="1.5" />
                      <circle cx="4" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="20" cy="12" r="1.5" />
                      <circle cx="28" cy="12" r="1.5" />
                      <circle cx="4" cy="20" r="1.5" />
                      <circle cx="12" cy="20" r="1.5" />
                      <circle cx="20" cy="20" r="1.5" />
                      <circle cx="28" cy="20" r="1.5" />
                    </svg>
                  </div>

                  {/* Wave Layer decoration at the bottom right */}
                  <div className="absolute bottom-0 right-0 left-0 h-[45%] pointer-events-none overflow-hidden rounded-b-[24px]">
                    <svg className="absolute bottom-0 right-0 w-full h-full opacity-70" viewBox="0 0 160 80" preserveAspectRatio="none" fill="none">
                      <path d="M-20 80 Q 40 40 100 65 T 180 30 L 180 80 Z" fill={darkMode ? "#1e3a8a" : "#93c5fd"} opacity={darkMode ? "0.2" : "0.35"} />
                      <path d="M-20 80 Q 50 25 110 50 T 180 15 L 180 80 Z" fill={darkMode ? "#3b82f6" : "#60a5fa"} opacity={darkMode ? "0.15" : "0.2"} />
                    </svg>
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-500/20">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[14px] font-bold leading-tight ${darkMode ? "text-slate-200" : "text-[#0f172a]"}`}>
                          Company
                        </span>
                        <span className={`text-[14px] font-bold leading-tight ${darkMode ? "text-slate-200" : "text-[#0f172a]"}`}>
                          Staff
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col">
                      <span className={`text-[52px] font-extrabold leading-none tracking-tight ${darkMode ? "text-blue-400" : "text-[#0052ff]"}`}>
                        {summaryData?.stats?.totalEmployees || 0}
                      </span>
                      <span className={`text-[14px] font-semibold mt-1 ${darkMode ? "text-slate-400" : "text-[#334155]"}`}>
                        Members
                      </span>
                    </div>
                  </div>

                  {/* Bottom Badge */}
                  <div className="relative z-10 mt-auto">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border text-[12.5px] font-bold shadow-sm ${
                      darkMode 
                        ? "text-blue-400 border-slate-700/80" 
                        : "text-blue-600 border-blue-100"
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Active HQ
                    </div>
                  </div>
                </div>

                {/* Admin Card 2 - Leaves Awaiting */}
                <div 
                  className={`relative p-6 rounded-[24px] border transition-all duration-300 hover:shadow-xl hover:scale-[1.01] overflow-hidden flex flex-col justify-between h-[230px] ${
                    darkMode 
                      ? "bg-slate-900/90 border-purple-500/30" 
                      : "bg-gradient-to-br from-[#f5f0ff] via-[#f0e5ff] to-[#ebdfff] border-[#e1ccff]"
                  }`}
                >
                  {/* Dot Grid Pattern */}
                  <div className={`absolute top-4 right-4 ${darkMode ? "text-purple-500/10" : "text-purple-400/30"}`}>
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="currentColor">
                      <circle cx="4" cy="4" r="1.5" />
                      <circle cx="12" cy="4" r="1.5" />
                      <circle cx="20" cy="4" r="1.5" />
                      <circle cx="28" cy="4" r="1.5" />
                      <circle cx="4" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="20" cy="12" r="1.5" />
                      <circle cx="28" cy="12" r="1.5" />
                      <circle cx="4" cy="20" r="1.5" />
                      <circle cx="12" cy="20" r="1.5" />
                      <circle cx="20" cy="20" r="1.5" />
                      <circle cx="28" cy="20" r="1.5" />
                    </svg>
                  </div>

                  {/* Wave Layer decoration at the bottom right */}
                  <div className="absolute bottom-0 right-0 left-0 h-[45%] pointer-events-none overflow-hidden rounded-b-[24px]">
                    <svg className="absolute bottom-0 right-0 w-full h-full opacity-70" viewBox="0 0 160 80" preserveAspectRatio="none" fill="none">
                      <path d="M-20 80 Q 40 40 100 65 T 180 30 L 180 80 Z" fill={darkMode ? "#3b0764" : "#ddd6fe"} opacity={darkMode ? "0.2" : "0.35"} />
                      <path d="M-20 80 Q 50 25 110 50 T 180 15 L 180 80 Z" fill={darkMode ? "#8b5cf6" : "#c084fc"} opacity={darkMode ? "0.15" : "0.2"} />
                    </svg>
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white shrink-0 shadow-sm shadow-purple-500/20">
                        <CalendarRange className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[14px] font-bold leading-tight ${darkMode ? "text-slate-200" : "text-[#0f172a]"}`}>
                          Leaves
                        </span>
                        <span className={`text-[14px] font-bold leading-tight ${darkMode ? "text-slate-200" : "text-[#0f172a]"}`}>
                          Awaiting
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col">
                      <span className={`text-[52px] font-extrabold leading-none tracking-tight ${darkMode ? "text-purple-400" : "text-[#7c3aed]"}`}>
                        {summaryData?.stats?.pendingLeavesCount || 0}
                      </span>
                      <span className={`text-[14px] font-semibold mt-1 ${darkMode ? "text-slate-400" : "text-[#334155]"}`}>
                        Pending
                      </span>
                    </div>
                  </div>

                  {/* Bottom Badge */}
                  <div className="relative z-10 mt-auto">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border text-[12.5px] font-bold shadow-sm ${
                      darkMode 
                        ? "text-purple-400 border-slate-700/80" 
                        : "text-purple-600 border-purple-100"
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Workflow
                    </div>
                  </div>
                </div>

                {/* Admin Card 3 - Today Absent */}
                <div 
                  className={`relative p-6 rounded-[24px] border transition-all duration-300 hover:shadow-xl hover:scale-[1.01] overflow-hidden flex flex-col justify-between h-[230px] ${
                    darkMode 
                      ? "bg-slate-900/90 border-amber-500/30" 
                      : "bg-gradient-to-br from-[#fffbeb] via-[#fef6d5] to-[#fef2c3] border-[#fde68a]"
                  }`}
                >
                  {/* Dot Grid Pattern */}
                  <div className={`absolute top-4 right-4 ${darkMode ? "text-amber-500/10" : "text-amber-400/30"}`}>
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="currentColor">
                      <circle cx="4" cy="4" r="1.5" />
                      <circle cx="12" cy="4" r="1.5" />
                      <circle cx="20" cy="4" r="1.5" />
                      <circle cx="28" cy="4" r="1.5" />
                      <circle cx="4" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="20" cy="12" r="1.5" />
                      <circle cx="28" cy="12" r="1.5" />
                      <circle cx="4" cy="20" r="1.5" />
                      <circle cx="12" cy="20" r="1.5" />
                      <circle cx="20" cy="20" r="1.5" />
                      <circle cx="28" cy="20" r="1.5" />
                    </svg>
                  </div>

                  {/* Wave Layer decoration at the bottom right */}
                  <div className="absolute bottom-0 right-0 left-0 h-[45%] pointer-events-none overflow-hidden rounded-b-[24px]">
                    <svg className="absolute bottom-0 right-0 w-full h-full opacity-70" viewBox="0 0 160 80" preserveAspectRatio="none" fill="none">
                      <path d="M-20 80 Q 40 40 100 65 T 180 30 L 180 80 Z" fill={darkMode ? "#78350f" : "#fde68a"} opacity={darkMode ? "0.2" : "0.35"} />
                      <path d="M-20 80 Q 50 25 110 50 T 180 15 L 180 80 Z" fill={darkMode ? "#d97706" : "#fcd34d"} opacity={darkMode ? "0.15" : "0.2"} />
                    </svg>
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-amber-500/20">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[14px] font-bold leading-tight ${darkMode ? "text-slate-200" : "text-[#0f172a]"}`}>
                          Today
                        </span>
                        <span className={`text-[14px] font-bold leading-tight ${darkMode ? "text-slate-200" : "text-[#0f172a]"}`}>
                          Absent
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col">
                      <span className={`text-[52px] font-extrabold leading-none tracking-tight ${darkMode ? "text-amber-400" : "text-[#d97706]"}`}>
                        {summaryData?.stats?.todayAbsents || 0}
                      </span>
                      <span className={`text-[14px] font-semibold mt-1 ${darkMode ? "text-slate-400" : "text-[#334155]"}`}>
                        Absences
                      </span>
                    </div>
                  </div>

                  {/* Bottom Badge */}
                  <div className="relative z-10 mt-auto">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border text-[12.5px] font-bold shadow-sm ${
                      darkMode 
                        ? "text-amber-400 border-slate-700/80" 
                        : "text-amber-600 border-amber-100"
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Not Clocked
                    </div>
                  </div>
                </div>

                {/* Admin Card 4 - Today Present */}
                <div 
                  className={`relative p-6 rounded-[24px] border transition-all duration-300 hover:shadow-xl hover:scale-[1.01] overflow-hidden flex flex-col justify-between h-[230px] ${
                    darkMode 
                      ? "bg-slate-900/90 border-emerald-500/30" 
                      : "bg-gradient-to-br from-[#f0fdf4] via-[#e6fcf0] to-[#dbfce9] border-[#bbf7d0]"
                  }`}
                >
                  {/* Dot Grid Pattern */}
                  <div className={`absolute top-4 right-4 ${darkMode ? "text-emerald-500/10" : "text-emerald-400/30"}`}>
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="currentColor">
                      <circle cx="4" cy="4" r="1.5" />
                      <circle cx="12" cy="4" r="1.5" />
                      <circle cx="20" cy="4" r="1.5" />
                      <circle cx="28" cy="4" r="1.5" />
                      <circle cx="4" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="20" cy="12" r="1.5" />
                      <circle cx="28" cy="12" r="1.5" />
                      <circle cx="4" cy="20" r="1.5" />
                      <circle cx="12" cy="20" r="1.5" />
                      <circle cx="20" cy="20" r="1.5" />
                      <circle cx="28" cy="20" r="1.5" />
                    </svg>
                  </div>

                  {/* Wave Layer decoration at the bottom right */}
                  <div className="absolute bottom-0 right-0 left-0 h-[45%] pointer-events-none overflow-hidden rounded-b-[24px]">
                    <svg className="absolute bottom-0 right-0 w-full h-full opacity-70" viewBox="0 0 160 80" preserveAspectRatio="none" fill="none">
                      <path d="M-20 80 Q 40 40 100 65 T 180 30 L 180 80 Z" fill={darkMode ? "#064e3b" : "#bbf7d0"} opacity={darkMode ? "0.2" : "0.35"} />
                      <path d="M-20 80 Q 50 25 110 50 T 180 15 L 180 80 Z" fill={darkMode ? "#10b981" : "#86efac"} opacity={darkMode ? "0.15" : "0.2"} />
                    </svg>
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#10b981] flex items-center justify-center text-white shrink-0 shadow-sm shadow-emerald-500/20">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[14px] font-bold leading-tight ${darkMode ? "text-slate-200" : "text-[#0f172a]"}`}>
                          Today
                        </span>
                        <span className={`text-[14px] font-bold leading-tight ${darkMode ? "text-slate-200" : "text-[#0f172a]"}`}>
                          Present
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col">
                      <span className={`text-[52px] font-extrabold leading-none tracking-tight ${darkMode ? "text-emerald-400" : "text-[#059669]"}`}>
                        {summaryData?.stats?.todayPresents || 0}
                      </span>
                      <span className={`text-[14px] font-semibold mt-1 ${darkMode ? "text-slate-400" : "text-[#334155]"}`}>
                        Staff
                      </span>
                    </div>
                  </div>

                  {/* Bottom Badge */}
                  <div className="relative z-10 mt-auto">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border text-[12.5px] font-bold shadow-sm ${
                      darkMode 
                        ? "text-emerald-400 border-slate-700/80" 
                        : "text-emerald-600 border-emerald-100"
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Checked-In
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Card 1 – Self Checked-In Days */}
                <div 
                  className={`relative p-6 rounded-[24px] border transition-all duration-300 hover:shadow-xl hover:scale-[1.01] overflow-hidden flex flex-col justify-between h-[230px] ${
                    darkMode 
                      ? "bg-slate-900/90 border-blue-500/30" 
                      : "bg-gradient-to-br from-[#ebf5ff] via-[#e5f1ff] to-[#dcf0ff] border-[#bfe0ff]"
                  }`}
                >
                  {/* Dot Grid Pattern */}
                  <div className={`absolute top-4 right-4 ${darkMode ? "text-blue-500/10" : "text-blue-400/30"}`}>
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="currentColor">
                      <circle cx="4" cy="4" r="1.5" />
                      <circle cx="12" cy="4" r="1.5" />
                      <circle cx="20" cy="4" r="1.5" />
                      <circle cx="28" cy="4" r="1.5" />
                      <circle cx="4" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="20" cy="12" r="1.5" />
                      <circle cx="28" cy="12" r="1.5" />
                      <circle cx="4" cy="20" r="1.5" />
                      <circle cx="12" cy="20" r="1.5" />
                      <circle cx="20" cy="20" r="1.5" />
                      <circle cx="28" cy="20" r="1.5" />
                    </svg>
                  </div>

                  {/* Wave Layer decoration at the bottom right */}
                  <div className="absolute bottom-0 right-0 left-0 h-[45%] pointer-events-none overflow-hidden rounded-b-[24px]">
                    <svg className="absolute bottom-0 right-0 w-full h-full opacity-70" viewBox="0 0 160 80" preserveAspectRatio="none" fill="none">
                      <path d="M-20 80 Q 40 40 100 65 T 180 30 L 180 80 Z" fill={darkMode ? "#1e3a8a" : "#93c5fd"} opacity={darkMode ? "0.2" : "0.35"} />
                      <path d="M-20 80 Q 50 25 110 50 T 180 15 L 180 80 Z" fill={darkMode ? "#3b82f6" : "#60a5fa"} opacity={darkMode ? "0.15" : "0.2"} />
                    </svg>
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-500/20">
                        <CalendarCheck className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[14px] font-bold leading-tight ${darkMode ? "text-slate-200" : "text-[#0f172a]"}`}>
                          Self Checked-In
                        </span>
                        <span className={`text-[14px] font-bold leading-tight ${darkMode ? "text-slate-200" : "text-[#0f172a]"}`}>
                          Days
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col">
                      <span className={`text-[52px] font-extrabold leading-none tracking-tight ${darkMode ? "text-blue-400" : "text-[#0052ff]"}`}>
                        {summaryData?.stats?.presentCount || 0}
                      </span>
                      <span className={`text-[14px] font-semibold mt-1 ${darkMode ? "text-slate-400" : "text-[#334155]"}`}>
                        Days
                      </span>
                    </div>
                  </div>

                  {/* Bottom Badge */}
                  <div className="relative z-10 mt-auto">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border text-[12.5px] font-bold shadow-sm ${
                      darkMode 
                        ? "text-blue-400 border-slate-700/80" 
                        : "text-blue-600 border-blue-100"
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Punctual
                    </div>
                  </div>
                </div>

                {/* Card 2 – Remaining Vacation */}
                <div 
                  className={`relative p-6 rounded-[24px] border transition-all duration-300 hover:shadow-xl hover:scale-[1.01] overflow-hidden flex flex-col justify-between h-[230px] ${
                    darkMode 
                      ? "bg-slate-900/90 border-purple-500/30" 
                      : "bg-gradient-to-br from-[#f5f0ff] via-[#f0e5ff] to-[#ebdfff] border-[#e1ccff]"
                  }`}
                >
                  {/* Dot Grid Pattern */}
                  <div className={`absolute top-4 right-4 ${darkMode ? "text-purple-500/10" : "text-purple-400/30"}`}>
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="currentColor">
                      <circle cx="4" cy="4" r="1.5" />
                      <circle cx="12" cy="4" r="1.5" />
                      <circle cx="20" cy="4" r="1.5" />
                      <circle cx="28" cy="4" r="1.5" />
                      <circle cx="4" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="20" cy="12" r="1.5" />
                      <circle cx="28" cy="12" r="1.5" />
                      <circle cx="4" cy="20" r="1.5" />
                      <circle cx="12" cy="20" r="1.5" />
                      <circle cx="20" cy="20" r="1.5" />
                      <circle cx="28" cy="20" r="1.5" />
                    </svg>
                  </div>

                  {/* Wave Layer decoration at the bottom right */}
                  <div className="absolute bottom-0 right-0 left-0 h-[45%] pointer-events-none overflow-hidden rounded-b-[24px]">
                    <svg className="absolute bottom-0 right-0 w-full h-full opacity-70" viewBox="0 0 160 80" preserveAspectRatio="none" fill="none">
                      <path d="M-20 80 Q 40 40 100 65 T 180 30 L 180 80 Z" fill={darkMode ? "#3b0764" : "#ddd6fe"} opacity={darkMode ? "0.2" : "0.35"} />
                      <path d="M-20 80 Q 50 25 110 50 T 180 15 L 180 80 Z" fill={darkMode ? "#8b5cf6" : "#c084fc"} opacity={darkMode ? "0.15" : "0.2"} />
                    </svg>
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white shrink-0 shadow-sm shadow-purple-500/20">
                        <Palmtree className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[14px] font-bold leading-tight ${darkMode ? "text-slate-200" : "text-[#0f172a]"}`}>
                          Remaining
                        </span>
                        <span className={`text-[14px] font-bold leading-tight ${darkMode ? "text-slate-200" : "text-[#0f172a]"}`}>
                          Vacation
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col">
                      <span className={`text-[52px] font-extrabold leading-none tracking-tight ${darkMode ? "text-purple-400" : "text-[#7c3aed]"}`}>
                        {summaryData?.stats?.leaveBalance || 0}
                      </span>
                      <span className={`text-[14px] font-semibold mt-1 ${darkMode ? "text-slate-400" : "text-[#334155]"}`}>
                        Days
                      </span>
                    </div>
                  </div>

                  {/* Bottom Badge */}
                  <div className="relative z-10 mt-auto">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border text-[12.5px] font-bold shadow-sm ${
                      darkMode 
                        ? "text-purple-400 border-slate-700/80" 
                        : "text-purple-600 border-purple-100"
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Paid Leave
                    </div>
                  </div>
                </div>

                {/* Card 3 – Pending Leave Requests */}
                <div 
                  className={`relative p-6 rounded-[24px] border transition-all duration-300 hover:shadow-xl hover:scale-[1.01] overflow-hidden flex flex-col justify-between h-[230px] ${
                    darkMode 
                      ? "bg-slate-900/90 border-amber-500/30" 
                      : "bg-gradient-to-br from-[#fffbeb] via-[#fef6d5] to-[#fef2c3] border-[#fde68a]"
                  }`}
                >
                  {/* Dot Grid Pattern */}
                  <div className={`absolute top-4 right-4 ${darkMode ? "text-amber-500/10" : "text-amber-400/30"}`}>
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="currentColor">
                      <circle cx="4" cy="4" r="1.5" />
                      <circle cx="12" cy="4" r="1.5" />
                      <circle cx="20" cy="4" r="1.5" />
                      <circle cx="28" cy="4" r="1.5" />
                      <circle cx="4" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="20" cy="12" r="1.5" />
                      <circle cx="28" cy="12" r="1.5" />
                      <circle cx="4" cy="20" r="1.5" />
                      <circle cx="12" cy="20" r="1.5" />
                      <circle cx="20" cy="20" r="1.5" />
                      <circle cx="28" cy="20" r="1.5" />
                    </svg>
                  </div>

                  {/* Wave Layer decoration at the bottom right */}
                  <div className="absolute bottom-0 right-0 left-0 h-[45%] pointer-events-none overflow-hidden rounded-b-[24px]">
                    <svg className="absolute bottom-0 right-0 w-full h-full opacity-70" viewBox="0 0 160 80" preserveAspectRatio="none" fill="none">
                      <path d="M-20 80 Q 40 40 100 65 T 180 30 L 180 80 Z" fill={darkMode ? "#78350f" : "#fde68a"} opacity={darkMode ? "0.2" : "0.35"} />
                      <path d="M-20 80 Q 50 25 110 50 T 180 15 L 180 80 Z" fill={darkMode ? "#d97706" : "#fcd34d"} opacity={darkMode ? "0.15" : "0.2"} />
                    </svg>
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-amber-500/20">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[14px] font-bold leading-tight ${darkMode ? "text-slate-200" : "text-[#0f172a]"}`}>
                          Pending Leave
                        </span>
                        <span className={`text-[14px] font-bold leading-tight ${darkMode ? "text-slate-200" : "text-[#0f172a]"}`}>
                          Requests
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col">
                      <span className={`text-[52px] font-extrabold leading-none tracking-tight ${darkMode ? "text-amber-400" : "text-[#d97706]"}`}>
                        {summaryData?.stats?.pendingLeavesCount || 0}
                      </span>
                      <span className={`text-[14px] font-semibold mt-1 ${darkMode ? "text-slate-400" : "text-[#334155]"}`}>
                        Applied
                      </span>
                    </div>
                  </div>

                  {/* Bottom Badge */}
                  <div className="relative z-10 mt-auto">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border text-[12.5px] font-bold shadow-sm ${
                      darkMode 
                        ? "text-amber-400 border-slate-700/80" 
                        : "text-amber-600 border-amber-100"
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      In review
                    </div>
                  </div>
                </div>

                {/* Card 4 – Milestone Badge Awards */}
                <div 
                  className={`relative p-6 rounded-[24px] border transition-all duration-300 hover:shadow-xl hover:scale-[1.01] overflow-hidden flex flex-col justify-between h-[230px] ${
                    darkMode 
                      ? "bg-slate-900/90 border-emerald-500/30" 
                      : "bg-gradient-to-br from-[#f0fdf4] via-[#e6fcf0] to-[#dbfce9] border-[#bbf7d0]"
                  }`}
                >
                  {/* Dot Grid Pattern */}
                  <div className={`absolute top-4 right-4 ${darkMode ? "text-emerald-500/10" : "text-emerald-400/30"}`}>
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="currentColor">
                      <circle cx="4" cy="4" r="1.5" />
                      <circle cx="12" cy="4" r="1.5" />
                      <circle cx="20" cy="4" r="1.5" />
                      <circle cx="28" cy="4" r="1.5" />
                      <circle cx="4" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="20" cy="12" r="1.5" />
                      <circle cx="28" cy="12" r="1.5" />
                      <circle cx="4" cy="20" r="1.5" />
                      <circle cx="12" cy="20" r="1.5" />
                      <circle cx="20" cy="20" r="1.5" />
                      <circle cx="28" cy="20" r="1.5" />
                    </svg>
                  </div>

                  {/* Wave Layer decoration at the bottom right */}
                  <div className="absolute bottom-0 right-0 left-0 h-[45%] pointer-events-none overflow-hidden rounded-b-[24px]">
                    <svg className="absolute bottom-0 right-0 w-full h-full opacity-70" viewBox="0 0 160 80" preserveAspectRatio="none" fill="none">
                      <path d="M-20 80 Q 40 40 100 65 T 180 30 L 180 80 Z" fill={darkMode ? "#064e3b" : "#bbf7d0"} opacity={darkMode ? "0.2" : "0.35"} />
                      <path d="M-20 80 Q 50 25 110 50 T 180 15 L 180 80 Z" fill={darkMode ? "#10b981" : "#86efac"} opacity={darkMode ? "0.15" : "0.2"} />
                    </svg>
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#10b981] flex items-center justify-center text-white shrink-0 shadow-sm shadow-emerald-500/20">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[14px] font-bold leading-tight ${darkMode ? "text-slate-200" : "text-[#0f172a]"}`}>
                          Milestone Badge
                        </span>
                        <span className={`text-[14px] font-bold leading-tight ${darkMode ? "text-slate-200" : "text-[#0f172a]"}`}>
                          Awards
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col">
                      <span className={`text-[52px] font-extrabold leading-none tracking-tight ${darkMode ? "text-emerald-400" : "text-[#059669]"}`}>
                        {employee?.achievements?.length || 0}
                      </span>
                      <span className={`text-[14px] font-semibold mt-1 ${darkMode ? "text-slate-400" : "text-[#334155]"}`}>
                        Badges
                      </span>
                    </div>
                  </div>

                  {/* Bottom Badge */}
                  <div className="relative z-10 mt-auto">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border text-[12.5px] font-bold shadow-sm ${
                      darkMode 
                        ? "text-emerald-400 border-slate-700/80" 
                        : "text-emerald-600 border-emerald-100"
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                      Recognitions
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Module Grid Render */}
          {(() => {
            const isWideModule = ["org", "heatmap", "simulator", "locker", "rewards", "attendance", "support", "recruitment", "analytics"].includes(activeModule);
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Active Content Module (Col-span 7 or 8, or full-width 12 depending on context) */}
                <div className={isWideModule ? "lg:col-span-12" : "lg:col-span-8"}>
                  {activeModule === "directory" && <EmployeeDirectory />}
                  {activeModule === "org" && <OrgStructure />}
                  {activeModule === "attendance" && <AttendanceWidget />}
                  {activeModule === "heatmap" && <AttendanceHeatmap />}
                  {activeModule === "leave" && <LeaveWidget />}
                  {activeModule === "payroll" && <PayrollWidget />}
                  {activeModule === "simulator" && <PaycheckSimulator />}
                  {activeModule === "locker" && <DocLocker />}
                  {activeModule === "rewards" && <RewardsVouchers />}
                  {activeModule === "ai" && <AIPanel />}
                  {activeModule === "support" && <SupportDesk />}
                  {activeModule === "recruitment" && <Recruitment />}
                  {activeModule === "analytics" && <AnalyticsHub />}
                </div>

                {/* Sidebar widgets panel (Col-span 4) */}
                {!isWideModule && (
                  <div className="lg:col-span-4 space-y-6">
                    {/* AI Chat Bot Quick Access widget */}
                    {activeModule !== "ai" && (
                      <div className="bg-gradient-to-r from-[#0a0f24] via-[#0f173d] to-[#070b1e] border border-blue-900/40 p-5 rounded-[24px] flex items-center justify-between shadow-xl relative overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                          <img 
                            src={auraBotImg} 
                            alt="Aura Assistant Robot" 
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-blue-500/30 shrink-0"
                          />
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-[12px] uppercase tracking-wider text-[#38bdf8] flex items-center gap-1.5">
                              AURA ASSISTANT
                            </h4>
                            <p style={{ color: "#fdfcfc" }} className="text-[10px] max-w-[160px] leading-relaxed">
                              Ask chatbot to look up daily absentees and details.
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveModule("ai")}
                          className="bg-[#0052ff] hover:bg-blue-500 text-white rounded-xl px-3.5 py-2 text-xs font-bold cursor-pointer transition-all duration-300 shadow-md shadow-blue-500/20 shrink-0 relative z-10"
                        >
                          Launch Aura
                        </button>
                        
                        {/* Soft background glow */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
                      </div>
                    )}

                    {/* Holiday Calendar Tracker */}
                    <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-3 bg-white dark:bg-slate-900 shadow-sm">
                      <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-800 dark:text-slate-100">
                        <CalendarDays className="w-4 h-4 text-blue-500" /> Upcoming Holidays
                      </h4>
                      <div className="space-y-2">
                        {summaryData?.upcomingHolidays?.map((h: any, idx: number) => {
                          const getHolidaySpanStyle = (index: number) => {
                            if (index === 0) return { color: "#ef4444" };
                            if (index === 1) return { color: "#ef4444" };
                            if (index === 2) return { color: "#ef4444" };
                            if (index === 3) return { color: "#ef4444" };
                            if (index === 4) return { color: "#ef4444" };
                            return undefined;
                          };
                          return (
                            <motion.div 
                              key={idx}
                              whileHover={{ scale: 1.02, x: 2 }}
                              className="bg-slate-50 dark:bg-slate-950/80 p-2.5 rounded-xl flex items-center justify-between text-xs border border-slate-200 dark:border-slate-850/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-950 transition-all duration-300"
                            >
                              <span className="font-semibold text-slate-700 dark:text-slate-200">{h.name}</span>
                              <span style={getHolidaySpanStyle(idx)} className="font-mono text-[10px] bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/10 font-bold">{h.date}</span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recent Activity Log */}
                    <div style={{ backgroundColor: "#e0f7fa" }} className="border border-cyan-200 p-4 rounded-2xl space-y-3 shadow-sm text-cyan-950">
                      <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-cyan-900">
                        <Activity className="w-4 h-4 text-cyan-700 animate-pulse" /> Recent Activities
                      </h4>
                      <div className="space-y-2.5 max-h-[170px] overflow-y-auto pr-1">
                        {summaryData?.recentActivities?.length === 0 ? (
                          <p className="text-[11px] text-cyan-800 italic">No logged activity recorded.</p>
                        ) : (
                          summaryData?.recentActivities?.map((act: any) => (
                            <div key={act.id} className="text-xs border-l-2 border-cyan-300 pl-3 space-y-0.5 text-left">
                              <div className="flex justify-between font-semibold">
                                <span className="font-semibold text-cyan-950">{act.action}</span>
                                <span className="text-[9px] font-mono text-cyan-800">{act.timestamp.split("T")[1]?.slice(0, 5)}</span>
                              </div>
                              <p className="text-[11px] leading-normal text-cyan-900">{act.details}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootApp />
    </AuthProvider>
  );
}
