import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { 
  BarChart2, FileText, Download, Printer, Filter, Calendar, 
  TrendingUp, DollarSign, Users, Clock, Briefcase, RefreshCw, 
  Search, ShieldAlert, Sparkles, Building, ChevronRight, PieChart, Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReportItem {
  id: string;
  category: string;
  title: string;
  meta1: string;
  meta2: string;
  status: string;
  date: string;
}

export default function AnalyticsHub() {
  const { token, employee, activeRole } = useAuth();
  
  // Tab states
  const [activeTab, setActiveTab] = useState<"dashboard" | "reports">("dashboard");
  const [selectedReportType, setSelectedReportType] = useState<"attendance" | "leave" | "payroll" | "recruitment">("attendance");
  const [timePeriod, setTimePeriod] = useState<"30days" | "q2" | "ytd">("30days");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Dynamic interactive chart states
  const [hoveredAttendanceDay, setHoveredAttendanceDay] = useState<number | null>(null);
  const [hoveredLeaveBar, setHoveredLeaveBar] = useState<{ category: string; type: "Remaining" | "Used" } | null>(null);
  const [activeSalarySlice, setActiveSalarySlice] = useState<string | null>(null);

  // Raw mock database entries to feed real-time dynamic calculations
  const [reportData, setReportData] = useState<ReportItem[]>([]);

  useEffect(() => {
    generateReportData();
  }, [selectedReportType, departmentFilter]);

  useEffect(() => {
    if (activeRole !== "ADMIN" && activeTab !== "dashboard") {
      setActiveTab("dashboard");
    }
  }, [activeRole, activeTab]);

  const generateReportData = () => {
    setLoading(true);
    setTimeout(() => {
      let data: ReportItem[] = [];
      if (selectedReportType === "attendance") {
        data = [
          { id: "REP-01", category: "Attendance", title: "Priyanka Sen", meta1: "95% Punctuality", meta2: "22 Checked-in", status: "Perfect", date: "2026-07-03" },
          { id: "REP-02", category: "Attendance", title: "Amit Verma", meta1: "88% Punctuality", meta2: "20 Checked-in", status: "On-Track", date: "2026-07-03" },
          { id: "REP-03", category: "Attendance", title: "Alice Johnson", meta1: "100% Punctuality", meta2: "23 Checked-in", status: "Perfect", date: "2026-07-03" },
          { id: "REP-04", category: "Attendance", title: "Rohan Das", meta1: "74% Punctuality", meta2: "17 Checked-in", status: "Needs Review", date: "2026-07-02" },
          { id: "REP-05", category: "Attendance", title: "Ananya Sharma", meta1: "91% Punctuality", meta2: "21 Checked-in", status: "On-Track", date: "2026-07-03" },
          { id: "REP-06", category: "Attendance", title: "Kabir Mehta", meta1: "82% Punctuality", meta2: "19 Checked-in", status: "On-Track", date: "2026-07-01" },
        ];
      } else if (selectedReportType === "leave") {
        data = [
          { id: "LVE-01", category: "Leave Utilization", title: "Amit Verma", meta1: "Sick Leave", meta2: "3 Days Used", status: "Approved", date: "2026-06-18" },
          { id: "LVE-02", category: "Leave Utilization", title: "Priyanka Sen", meta1: "Paid Leave", meta2: "5 Days Used", status: "Approved", date: "2026-06-24" },
          { id: "LVE-03", category: "Leave Utilization", title: "Kabir Mehta", meta1: "Unpaid Leave", meta2: "2 Days Used", status: "Rejected", date: "2026-06-29" },
          { id: "LVE-04", category: "Leave Utilization", title: "Rohan Das", meta1: "Sick Leave", meta2: "1 Day Used", status: "Approved", date: "2026-07-01" },
          { id: "LVE-05", category: "Leave Utilization", title: "Alice Johnson", meta1: "Paid Leave", meta2: "4 Days Used", status: "Pending", date: "2026-07-02" },
        ];
      } else if (selectedReportType === "payroll") {
        data = [
          { id: "PAY-01", category: "Invoicing", title: "Sarah Jenkins", meta1: "₹1,80,000 Base", meta2: "₹25,000 Bonus", status: "Disbursed", date: "2026-06-30" },
          { id: "PAY-02", category: "Invoicing", title: "Priyanka Sen", meta1: "₹1,20,000 Base", meta2: "₹15,000 Allowance", status: "Disbursed", date: "2026-06-30" },
          { id: "PAY-03", category: "Invoicing", title: "Amit Verma", meta1: "₹1,50,000 Base", meta2: "₹10,000 Allowance", status: "Disbursed", date: "2026-06-30" },
          { id: "PAY-04", category: "Invoicing", title: "Alice Johnson", meta1: "₹1,10,000 Base", meta2: "₹8,000 Allowance", status: "Disbursed", date: "2026-06-30" },
          { id: "PAY-05", category: "Invoicing", title: "John Doe", meta1: "₹2,10,000 Base", meta2: "₹30,000 Bonus", status: "Pending", date: "2026-06-30" },
        ];
      } else {
        data = [
          { id: "REC-01", category: "Recruitment", title: "Ananya Sharma", meta1: "Senior React Developer", meta2: "5.5 Yrs Exp", status: "Interviewing", date: "2026-07-03" },
          { id: "REC-02", category: "Recruitment", title: "Rohan Das", meta1: "Product Manager - HR Tech", meta2: "7 Yrs Exp", status: "Offered", date: "2026-07-02" },
          { id: "REC-03", category: "Recruitment", title: "Pooja Malhotra", meta1: "Talent Specialist", meta2: "3 Yrs Exp", status: "Hired", date: "2026-07-01" },
          { id: "REC-04", category: "Recruitment", title: "Kabir Mehta", meta1: "Senior React Developer", meta2: "4 Yrs Exp", status: "Screened", date: "2026-06-28" },
          { id: "REC-05", category: "Recruitment", title: "Meera Nair", meta1: "UI/UX Visual Designer", meta2: "2 Yrs Exp", status: "Applied", date: "2026-06-25" },
        ];
      }

      if (departmentFilter !== "All") {
        data = data.slice(0, 3);
      }
      setReportData(data);
      setLoading(false);
    }, 450);
  };

  const triggerCSVDownload = () => {
    let csvHeaders = "ID,Category,Name/Title,Primary Indicator,Secondary Indicator,Status,Timestamp\n";
    const csvRows = reportData.map(item => 
      `"${item.id}","${item.category}","${item.title}","${item.meta1.replace(/"/g, '""')}","${item.meta2.replace(/"/g, '""')}","${item.status}","${item.date}"`
    ).join("\n");
    
    const blob = new Blob([csvHeaders + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Aura_HRMS_Report_${selectedReportType}_${timePeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerPrint = () => {
    window.print();
  };

  const filteredRows = reportData.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.meta1.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dynamic values for Attendance line graph
  const attendanceDays = [
    { day: "Mon", base: 8.0, logged: 8.2, checkIn: "8:52 AM", remark: "On Time" },
    { day: "Tue", base: 8.0, logged: 8.5, checkIn: "8:45 AM", remark: "On Time" },
    { day: "Wed", base: 8.0, logged: 7.8, checkIn: "9:05 AM", remark: "Grace period" },
    { day: "Thu", base: 8.0, logged: 8.1, checkIn: "8:57 AM", remark: "On Time" },
    { day: "Fri", base: 8.0, logged: 8.4, checkIn: "8:41 AM", remark: "On Time" },
    { day: "Sat", base: 8.0, logged: 4.2, checkIn: "9:15 AM", remark: "Weekend Shift" },
    { day: "Sun", base: 0.0, logged: 0.0, checkIn: "N/A", remark: "Weekly Off" }
  ];

  // Dynamic values for Leave bar graph (Remaining vs Used)
  const leaveCategories = [
    { name: "Paid Leave", remaining: 14, used: 4 },
    { name: "Sick Leave", remaining: 8, used: 2 },
    { name: "Unpaid Leave", remaining: 15, used: 1 }
  ];

  // Dynamic values for Salary breakdown donut/list
  const salarySlices = [
    { key: "basic", label: "Basic Salary Payout", value: 27500, percent: 50, color: "#3b82f6", desc: "Core compensation package base" },
    { key: "hra", label: "House Rent Allowance", value: 11000, percent: 20, color: "#a855f7", desc: "Tax exempted home rental support" },
    { key: "special", label: "Special Allowances", value: 11000, percent: 20, color: "#facc15", desc: "Variable performance and travel allowances" },
    { key: "benefits", label: "Conveyance & Benefits", value: 5500, percent: 10, color: "#06b6d4", desc: "Medical coverages and transport incentives" }
  ];

  return (
    <div id="analytics-hub" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-left flex flex-col min-h-[600px]">
      
      {/* Header section with theme styles */}
      <div className="bg-slate-950 p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <BarChart2 className="w-5 h-5 text-blue-500 animate-pulse" />
          <div>
            <h3 className="font-extrabold text-slate-100 text-sm tracking-wider uppercase">ANALYTICS & AUDIT DESK</h3>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">Corporate KPI Engines & Data Export Center</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-center">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "dashboard" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Executive Dashboard
          </button>
          {activeRole === "ADMIN" && (
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "reports" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Audit Reports Center
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="p-6 flex-1 space-y-6">
        
        {/* Controls block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40 p-4 border border-slate-800 rounded-xl">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-blue-400" /> Report Config:
            </span>
            <select
              value={timePeriod}
              onChange={e => setTimePeriod(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="30days">Last 30 Days (July 2026)</option>
              <option value="q2">Q2 Fiscal Year 2026</option>
              <option value="ytd">Year-To-Date (YTD)</option>
            </select>

            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">Human Resources</option>
              <option value="Product">Product Management</option>
              <option value="Design">Visual Design</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerCSVDownload}
              className="bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-800 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" /> CSV Export
            </button>
            <button
              onClick={triggerPrint}
              className="bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-800 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" /> Print Layout
            </button>
          </div>
        </div>

        {activeTab === "dashboard" ? (
          /* Executive Dashboard tab with detailed custom charts */
          <div className="space-y-6">
            
            {/* Top Stats Cards: Dark background, light text, bold accents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average On-Time Rate</span>
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">94.2%</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">+1.8% MoM</span>
                </div>
                <p className="text-[10px] text-slate-400">Based on standard check-ins before 9:00 AM</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Payroll Expense</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">₹9,80,000</span>
                  <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded">Standard</span>
                </div>
                <p className="text-[10px] text-slate-400">Excludes variable performance vouchers</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Leave Burn Rate</span>
                  <Calendar className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">12%</span>
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">Optimal</span>
                </div>
                <p className="text-[10px] text-slate-400">Average paid leaves used per head</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FTE Hiring Goal</span>
                  <Briefcase className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">4 / 6 Filled</span>
                  <span className="text-[10px] text-yellow-400 font-bold bg-yellow-500/10 px-1.5 py-0.5 rounded">80% Rate</span>
                </div>
                <p className="text-[10px] text-slate-400">Active positions for Q2 2026</p>
              </div>
            </div>

            {/* Interactive Charts section matching the uploaded layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chart 1: Left Card - Attendance Line Graph */}
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Attendance & Logged Hours Shift Expectation</h4>
                    <p className="text-[10px] text-slate-400">Interactive daily biometric clock-in alignment</p>
                  </div>
                  {/* Legend */}
                  <div className="flex gap-3 text-[10px] font-bold">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2.5 h-0.5 border-t-2 border-dashed border-slate-500"></span> Base Shift
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-400">
                      <span className="w-2.5 h-0.5 bg-blue-500"></span> Logged Hours
                    </span>
                  </div>
                </div>

                {/* SVG Line Chart */}
                <div className="relative pt-2">
                  <svg viewBox="0 0 500 200" className="w-full h-56 overflow-visible select-none">
                    <defs>
                      <linearGradient id="loggedHoursGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35"/>
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0"/>
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Grid Lines */}
                    {[12, 9, 6, 3, 0].map((val, idx) => {
                      const y = 30 + idx * 35;
                      return (
                        <g key={val}>
                          <line x1="40" y1={y} x2="480" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray={val === 0 ? "" : "3,3"} />
                          <text x="30" y={y + 3} fill="#64748b" fontSize="10" textAnchor="end">{val}</text>
                        </g>
                      );
                    })}

                    {/* Gradient fill under Logged Hours */}
                    <path
                      d="M 60 43 L 125 39 L 190 47 L 255 43.5 L 320 40 L 385 89 L 450 170 L 450 170 L 60 170 Z"
                      fill="url(#loggedHoursGradient)"
                      className="transition-all duration-300"
                    />

                    {/* Dotted Line for Base Shift */}
                    <path
                      d="M 60 45 L 125 45 L 190 45 L 255 45 L 320 45 L 385 45 L 450 170"
                      fill="none"
                      stroke="#475569"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                    />

                    {/* Blue Solid Line for Logged Hours */}
                    {/* Logged values mapping: 8.2(42.5), 8.5(39), 7.8(47), 8.1(43.5), 8.4(40), 4.2(90), 0(170) */}
                    <path
                      d="M 60 43 L 125 39 L 190 47 L 255 43.5 L 320 40 L 385 89 L 450 170"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      filter="url(#glow)"
                    />

                    {/* Hover Hotspots / Interaction Vertical Guideline */}
                    {hoveredAttendanceDay !== null && (
                      <line
                        x1={60 + hoveredAttendanceDay * 65}
                        y1="30"
                        x2={60 + hoveredAttendanceDay * 65}
                        y2="170"
                        stroke="#3b82f6"
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                        className="pointer-events-none"
                      />
                    )}

                    {/* Node Circles */}
                    {attendanceDays.map((item, index) => {
                      const x = 60 + index * 65;
                      // Calculated y positions
                      const yMap = [43, 39, 47, 43.5, 40, 89, 170];
                      const y = yMap[index];
                      const isHovered = hoveredAttendanceDay === index;

                      return (
                        <g 
                          key={item.day}
                          onMouseEnter={() => setHoveredAttendanceDay(index)}
                          onMouseLeave={() => setHoveredAttendanceDay(null)}
                          onClick={() => {
                            setActiveTab("reports");
                            setSelectedReportType("attendance");
                            setSearchTerm(item.remark === "Weekly Off" ? "" : "Priyanka");
                          }}
                          className="cursor-pointer group"
                        >
                          {/* Invisible larger circle to make hover easier */}
                          <circle cx={x} cy={y} r="18" fill="transparent" />
                          <circle
                            cx={x}
                            cy={y}
                            r={isHovered ? "9" : "5.5"}
                            fill="#0f172a"
                            stroke={isHovered ? "#60a5fa" : "#2563eb"}
                            strokeWidth={isHovered ? "4" : "3"}
                            className="transition-all duration-200"
                          />
                          {isHovered && (
                            <circle
                              cx={x}
                              cy={y}
                              r="15"
                              fill="none"
                              stroke="#60a5fa"
                              strokeWidth="1.5"
                              strokeDasharray="3,3"
                              className="animate-spin"
                              style={{ transformOrigin: `${x}px ${y}px`, animationDuration: "6s" }}
                            />
                          )}
                          <text x={x} y="188" fill={isHovered ? "#60a5fa" : "#64748b"} fontSize="10.5" fontWeight={isHovered ? "bold" : "normal"} textAnchor="middle">{item.day}</text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Interactive Floating Tooltip inside container */}
                  <AnimatePresence>
                    {hoveredAttendanceDay !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        className="absolute bottom-16 left-[50%] translate-x-[-50%] bg-slate-950/95 border border-slate-800 p-3 rounded-xl shadow-2xl flex items-center gap-4 text-xs select-none pointer-events-none z-10"
                      >
                        <div className="space-y-0.5">
                          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Day Log: {attendanceDays[hoveredAttendanceDay].day}</p>
                          <p className="font-extrabold text-white text-sm">{attendanceDays[hoveredAttendanceDay].logged} Hrs Logged</p>
                        </div>
                        <div className="w-px h-8 bg-slate-800"></div>
                        <div className="space-y-0.5">
                          <p className="text-slate-500 font-bold uppercase text-[8px]">Daily Shift Base: {attendanceDays[hoveredAttendanceDay].base}h</p>
                          <p className="text-[10px] text-blue-400 font-bold flex items-center gap-1">
                            CheckIn: {attendanceDays[hoveredAttendanceDay].checkIn} ({attendanceDays[hoveredAttendanceDay].remark})
                          </p>
                        </div>
                        <div className="w-px h-8 bg-slate-800"></div>
                        <p className="text-[9px] text-slate-500 italic font-medium">Click to view audit log</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Chart 2: Right Card - Leave calendar year Double Bar Chart */}
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Leave Balance Log (Calendar Year)</h4>
                    <p className="text-[10px] text-slate-400">Annual remaining vs utilized corporate leave buckets</p>
                  </div>
                  {/* Legend */}
                  <div className="flex gap-3 text-[10px] font-bold">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Remaining
                    </span>
                    <span className="flex items-center gap-1 text-rose-400">
                      <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Used
                    </span>
                  </div>
                </div>

                {/* SVG Double Bar Chart */}
                <div className="relative pt-2">
                  <svg viewBox="0 0 500 200" className="w-full h-56 overflow-visible select-none">
                    {/* Grid Lines */}
                    {[16, 12, 8, 4, 0].map((val, idx) => {
                      const y = 30 + idx * 35;
                      return (
                        <g key={val}>
                          <line x1="40" y1={y} x2="480" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray={val === 0 ? "" : "3,3"} />
                          <text x="30" y={y + 3} fill="#64748b" fontSize="10" textAnchor="end">{val}</text>
                        </g>
                      );
                    })}

                    {/* Leave Categories */}
                    {leaveCategories.map((category, index) => {
                      const xBase = 70 + index * 140;
                      // Mapping values to SVG height scale: y = 170 - (val / 16) * 140
                      const remainingHeight = (category.remaining / 16) * 140;
                      const usedHeight = (category.used / 16) * 140;

                      const yRemaining = 170 - remainingHeight;
                      const yUsed = 170 - usedHeight;

                      const isRemainingHovered = hoveredLeaveBar?.category === category.name && hoveredLeaveBar?.type === "Remaining";
                      const isUsedHovered = hoveredLeaveBar?.category === category.name && hoveredLeaveBar?.type === "Used";

                      return (
                        <g key={category.name}>
                          {/* Used Bar (Red) */}
                          <g
                            onMouseEnter={() => setHoveredLeaveBar({ category: category.name, type: "Used" })}
                            onMouseLeave={() => setHoveredLeaveBar(null)}
                            onClick={() => {
                              setActiveTab("reports");
                              setSelectedReportType("leave");
                              setSearchTerm(category.name === "Paid Leave" ? "Paid Leave" : category.name === "Sick Leave" ? "Sick Leave" : "Unpaid Leave");
                            }}
                            className="cursor-pointer transition-all duration-200"
                          >
                            <rect
                              x={xBase}
                              y={yUsed}
                              width="30"
                              height={usedHeight}
                              fill={isUsedHovered ? "#f43f5e" : "#e11d48"}
                              rx="5"
                              opacity={hoveredLeaveBar && !isUsedHovered ? 0.45 : 1}
                              className="transition-all duration-200"
                            />
                            {isUsedHovered && (
                              <g>
                                <rect x={xBase - 15} y={yUsed - 25} width="60" height="18" fill="#9f1239" rx="4" />
                                <text x={xBase + 15} y={yUsed - 13} fill="#fda4af" fontSize="9" fontWeight="extrabold" textAnchor="middle">{category.used} Days Used</text>
                              </g>
                            )}
                          </g>

                          {/* Remaining Bar (Green) */}
                          <g
                            onMouseEnter={() => setHoveredLeaveBar({ category: category.name, type: "Remaining" })}
                            onMouseLeave={() => setHoveredLeaveBar(null)}
                            onClick={() => {
                              setActiveTab("reports");
                              setSelectedReportType("leave");
                              setSearchTerm(category.name === "Paid Leave" ? "Paid Leave" : category.name === "Sick Leave" ? "Sick Leave" : "Unpaid Leave");
                            }}
                            className="cursor-pointer transition-all duration-200"
                          >
                            <rect
                              x={xBase + 36}
                              y={yRemaining}
                              width="30"
                              height={remainingHeight}
                              fill={isRemainingHovered ? "#34d399" : "#10b981"}
                              rx="5"
                              opacity={hoveredLeaveBar && !isRemainingHovered ? 0.45 : 1}
                              className="transition-all duration-200"
                            />
                            {isRemainingHovered && (
                              <g>
                                <rect x={xBase + 16} y={yRemaining - 25} width="70" height="18" fill="#065f46" rx="4" />
                                <text x={xBase + 51} y={yRemaining - 13} fill="#a7f3d0" fontSize="9" fontWeight="extrabold" textAnchor="middle">{category.remaining} Days Left</text>
                              </g>
                            )}
                          </g>

                          {/* X Axis label */}
                          <text x={xBase + 33} y="188" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle">{category.name}</text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Leave interactive message */}
                  <AnimatePresence>
                    {hoveredLeaveBar !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-16 left-[50%] translate-x-[-50%] bg-slate-950 border border-slate-800 p-2.5 px-4 rounded-xl shadow-2xl text-[10px] text-slate-300 font-extrabold select-none pointer-events-none flex items-center gap-2"
                      >
                        <span>{hoveredLeaveBar.category} →</span>
                        <span className={hoveredLeaveBar.type === "Remaining" ? "text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded" : "text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded"}>
                          {hoveredLeaveBar.type} Bucket
                        </span>
                        <span className="text-slate-500 text-[9px] font-normal italic">| Click to pre-filter logs</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>

            {/* Chart 3: Bottom Full-Width Card - Compensation & Deductions Breakdown */}
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Compensation & Deductions Breakdown</h4>
                <p className="text-[10px] text-slate-400">Visual chart of how your gross salary is allocated this month</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
                {/* Left Side: Gorgeous Interactive Donut */}
                <div className="lg:col-span-5 flex justify-center relative">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      {/* Grey Background track */}
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1e293b" strokeWidth="11" />
                      
                      {/* Segment 1: Blue (Basic Salary) 50% */}
                      {/* Circumference = 2 * PI * 38 = 238.76 */}
                      {/* 50% = 119.38 */}
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#3b82f6" strokeWidth={activeSalarySlice === "basic" ? "14" : "11"}
                        strokeDasharray="119.38 238.76" strokeDashoffset="0"
                        onMouseEnter={() => setActiveSalarySlice("basic")}
                        onMouseLeave={() => setActiveSalarySlice(null)}
                        className="cursor-pointer transition-all duration-150 hover:stroke-blue-400"
                        id="donut-slice-basic"
                      />

                      {/* Segment 2: Purple (HRA) 20% -> 47.75 */}
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#a855f7" strokeWidth={activeSalarySlice === "hra" ? "14" : "11"}
                        strokeDasharray="47.75 238.76" strokeDashoffset="-119.38"
                        onMouseEnter={() => setActiveSalarySlice("hra")}
                        onMouseLeave={() => setActiveSalarySlice(null)}
                        className="cursor-pointer transition-all duration-150 hover:stroke-purple-400"
                        id="donut-slice-hra"
                      />

                      {/* Segment 3: Yellow (Special Allowances) 20% -> 47.75 */}
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#facc15" strokeWidth={activeSalarySlice === "special" ? "14" : "11"}
                        strokeDasharray="47.75 238.76" strokeDashoffset="-167.13"
                        onMouseEnter={() => setActiveSalarySlice("special")}
                        onMouseLeave={() => setActiveSalarySlice(null)}
                        className="cursor-pointer transition-all duration-150 hover:stroke-yellow-400"
                        id="donut-slice-special"
                      />

                      {/* Segment 4: Cyan (Benefits) 10% -> 23.88 */}
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#06b6d4" strokeWidth={activeSalarySlice === "benefits" ? "14" : "11"}
                        strokeDasharray="23.88 238.76" strokeDashoffset="-214.88"
                        onMouseEnter={() => setActiveSalarySlice("benefits")}
                        onMouseLeave={() => setActiveSalarySlice(null)}
                        className="cursor-pointer transition-all duration-150 hover:stroke-cyan-400"
                        id="donut-slice-benefits"
                      />
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">
                      {activeSalarySlice ? (
                        <>
                          <span className="text-lg font-black text-white">
                            {salarySlices.find(s => s.key === activeSalarySlice)?.percent}%
                          </span>
                          <span className="text-[8px] text-slate-400 uppercase tracking-widest font-extrabold">
                            {salarySlices.find(s => s.key === activeSalarySlice)?.key} share
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-base font-black text-white">₹55,000</span>
                          <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">Total Gross</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Compensation Cards Grid */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {salarySlices.map((slice) => {
                    const isActive = activeSalarySlice === slice.key;
                    return (
                      <div
                        key={slice.key}
                        onMouseEnter={() => setActiveSalarySlice(slice.key)}
                        onMouseLeave={() => setActiveSalarySlice(null)}
                        className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                          isActive 
                            ? "bg-slate-900 border-blue-500/50 shadow-lg translate-x-1" 
                            : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                        }`}
                        id={`comp-card-${slice.key}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">{slice.label}</span>
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: slice.color }}></span>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-xl font-black text-white">₹{slice.value.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-slate-400">({slice.percent}%)</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{slice.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Audit Reports Center with fully searchable and exportable reports */
          <div className="space-y-4">
            
            {/* Search and Category Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap bg-slate-950 p-1 rounded-xl border border-slate-850">
                <button
                  onClick={() => { setSelectedReportType("attendance"); setSearchTerm(""); }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedReportType === "attendance" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Attendance Audit
                </button>
                <button
                  onClick={() => { setSelectedReportType("leave"); setSearchTerm(""); }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedReportType === "leave" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Leave Balance Log
                </button>
                <button
                  onClick={() => { setSelectedReportType("payroll"); setSearchTerm(""); }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedReportType === "payroll" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Payroll Outlays
                </button>
                <button
                  onClick={() => { setSelectedReportType("recruitment"); setSearchTerm(""); }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedReportType === "recruitment" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Hiring Pipeline
                </button>
              </div>

              <div className="relative min-w-[200px] sm:w-64">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search current report..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Dynamic tabular audit output */}
            <div className="bg-slate-950 rounded-xl border border-slate-850 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-800">
                  <thead className="bg-slate-950/80 text-slate-400 font-extrabold uppercase tracking-widest text-[9px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Reference ID</th>
                      <th className="p-3">Employee Name</th>
                      <th className="p-3">Primary Parameter</th>
                      <th className="p-3">Secondary Metric</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date Record</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-slate-850/80">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold italic">
                          <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-blue-500" />
                          Calculating formulas & consolidating payroll logs...
                        </td>
                      </tr>
                    ) : filteredRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold italic">
                          No matching records found for this period.
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map(row => (
                        <tr key={row.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-400">{row.id}</td>
                          <td className="p-3 font-extrabold text-slate-200">{row.title}</td>
                          <td className="p-3 text-slate-300 font-medium">{row.meta1}</td>
                          <td className="p-3 text-slate-400">{row.meta2}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-wider ${
                              ["Perfect", "Approved", "Disbursed", "Hired"].includes(row.status) 
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                : ["On-Track", "Pending", "Offered", "Screened", "Interviewing"].includes(row.status)
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[10px] text-slate-500">{row.date}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom explanation */}
            <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-850 flex items-start gap-2 text-[10px] text-slate-400">
              <Info className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <span>
                Report records are derived from corporate biometric logs, registered HRMS user forms, and payroll ledger ledgers. CSV outputs match international audit standards. 
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
