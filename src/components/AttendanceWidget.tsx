import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { 
  Clock, CheckCircle, XCircle, AlertCircle, Calendar, 
  MapPin, Check, FileCheck, Search, Filter, RefreshCw, Sparkles,
  Briefcase, User, Building, Landmark, ChevronRight
} from "lucide-react";
import { Attendance } from "../types.js";
import { motion, AnimatePresence } from "motion/react";

export const AttendanceWidget: React.FC = () => {
  const { token, employee, activeRole, refreshEmployee } = useAuth();
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"checkin" | "history" | "calendar">("checkin");
  const [checkingIn, setCheckingIn] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);
  
  // Real-time standard time clock & date states
  const [currentLiveTime, setCurrentLiveTime] = useState("");
  const [currentLiveDate, setCurrentLiveDate] = useState("");
  const [stopwatch, setStopwatch] = useState("00:00:00");

  // Search & Filters for Admin
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const showFeedback = (text: string, type: "success" | "error") => {
    setFeedback({ text, type });
    setTimeout(() => {
      setFeedback(null);
    }, 6000);
  };

  const fetchAttendance = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/attendance", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAttendanceList(data);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [token, activeRole]);

  // Interval for live clock, date, and stopwatch
  useEffect(() => {
    // Initial call
    const now = new Date();
    setCurrentLiveTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }));
    setCurrentLiveDate(now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }));

    const timer = setInterval(() => {
      const d = new Date();
      setCurrentLiveTime(d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }));
      setCurrentLiveDate(d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }));

      // Calculate stopwatch since clock-in
      const todayStr = d.toLocaleDateString("sv-SE");
      const record = attendanceList.find(a => a.employeeId === employee?.id && a.date === todayStr);

      if (record && record.checkIn) {
        const [h, m, s] = record.checkIn.split(":").map(Number);
        const checkInTime = new Date();
        checkInTime.setHours(h, m, s || 0, 0);

        if (record.checkOut) {
          // Already checked out, compute total elapsed time
          const [ch, cm, cs] = record.checkOut.split(":").map(Number);
          const checkOutTime = new Date();
          checkOutTime.setHours(ch, cm, cs || 0, 0);
          
          const diffMs = checkOutTime.getTime() - checkInTime.getTime();
          if (diffMs > 0) {
            const diffSecs = Math.floor(diffMs / 1000);
            const hours = Math.floor(diffSecs / 3600);
            const minutes = Math.floor((diffSecs % 3600) / 60);
            const seconds = diffSecs % 60;
            setStopwatch(
              `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
            );
          } else {
            setStopwatch("00:00:00");
          }
        } else {
          // Accruing live stopwatch
          const diffMs = d.getTime() - checkInTime.getTime();
          if (diffMs > 0) {
            const diffSecs = Math.floor(diffMs / 1000);
            const hours = Math.floor(diffSecs / 3600);
            const minutes = Math.floor((diffSecs % 3600) / 60);
            const seconds = diffSecs % 60;
            setStopwatch(
              `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
            );
          } else {
            setStopwatch("00:00:00");
          }
        }
      } else {
        setStopwatch("00:00:00");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [attendanceList, employee]);

  // Daily status logic - dynamic local date
  const todayStr = new Date().toLocaleDateString("sv-SE"); 
  const todayRecord = attendanceList.find(a => a.employeeId === employee?.id && a.date === todayStr);

  const handleCheckIn = async () => {
    if (!token) return;
    setCheckingIn(true);
    setFeedback(null);
    try {
      const localDate = new Date().toLocaleDateString("sv-SE");
      const localTime = new Date().toLocaleTimeString("en-US", { hour12: false });
      const res = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ localDate, localTime })
      });
      if (res.ok) {
        await fetchAttendance();
        showFeedback("Checked in successfully! Shift parameters are now accruing.", "success");
      } else {
        const err = await res.json();
        showFeedback(err.error || "Failed to check in", "error");
      }
    } catch (err) {
      showFeedback("Network error. Please check your connection.", "error");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!token) return;
    setCheckingIn(true);
    setFeedback(null);
    try {
      const localDate = new Date().toLocaleDateString("sv-SE");
      const localTime = new Date().toLocaleTimeString("en-US", { hour12: false });
      const res = await fetch("/api/attendance/check-out", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ localDate, localTime })
      });
      if (res.ok) {
        await fetchAttendance();
        showFeedback("Checked out successfully! Have a great evening.", "success");
      } else {
        const err = await res.json();
        showFeedback(err.error || "Failed to check out", "error");
      }
    } catch (err) {
      showFeedback("Network error. Please check your connection.", "error");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleResetToday = async () => {
    if (!token) return;
    setCheckingIn(true);
    setFeedback(null);
    try {
      const localDate = new Date().toLocaleDateString("sv-SE");
      const res = await fetch("/api/attendance/reset-today", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ localDate })
      });
      if (res.ok) {
        await fetchAttendance();
        showFeedback("Today's demo attendance log has been reset! You can now check in fresh.", "success");
      } else {
        const err = await res.json();
        showFeedback(err.error || "Failed to reset log", "error");
      }
    } catch (err) {
      showFeedback("Network error.", "error");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/attendance/approve/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setAttendanceList(prev => prev.map(a => a.id === id ? { ...a, isApproved: true } : a));
        refreshEmployee(); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Compute stats
  const myLogs = activeRole === "ADMIN" ? attendanceList : attendanceList.filter(a => a.employeeId === employee?.id);
  const presentDays = myLogs.filter(a => a.status === "Present" || a.status === "Half-day").length;
  const leaveDays = myLogs.filter(a => a.status === "Leave").length;
  const onTimeDays = myLogs.filter(a => a.status === "Present" && a.checkIn && a.checkIn <= "09:00:00").length;
  const punctualityRate = presentDays > 0 ? Math.round((onTimeDays / presentDays) * 100) : 100;

  // Custom Calendar Builder for July 2026 (31 Days)
  const daysInMonth = 31;
  const startDayOffset = 3; 
  const calendarDays = [];

  for (let i = 0; i < startDayOffset; i++) {
    calendarDays.push({ dayNum: null, dateStr: "" });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = `2026-07-${String(i).padStart(2, "0")}`;
    calendarDays.push({ dayNum: i, dateStr: dayStr });
  }

  const getDayStatusStyle = (status: string | undefined, isApproved: boolean) => {
    if (!status) return "bg-slate-50 dark:bg-slate-950 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-850";
    switch (status) {
      case "Present":
        return isApproved 
          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40" 
          : "bg-emerald-500/10 text-emerald-500 dark:text-emerald-300 border border-emerald-500/20 border-dashed animate-pulse";
      case "Half-day":
        return "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40";
      case "Absent":
        return "bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40";
      case "Leave":
        return "bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/40";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
    }
  };

  const filteredLogs = attendanceList.filter(log => {
    const matchesSearch = activeRole === "ADMIN" 
      ? log.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || log.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesStatus = statusFilter === "All" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Render proper dynamic working hours format (e.g., "0h 1m") from the stopwatch
  const getWorkingHoursDisplay = () => {
    if (!todayRecord || !todayRecord.checkIn) return "0h 0m";
    const parts = stopwatch.split(":");
    if (parts.length === 3) {
      const hrs = parseInt(parts[0], 10);
      const mins = parseInt(parts[1], 10);
      return `${hrs}h ${mins}m`;
    }
    return "0h 0m";
  };

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good Morning";
    if (hrs < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div id="attendance-widget" className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-[580px] text-left">
      {/* Header section */}
      <div className="bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500 animate-spin-slow" />
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-wider uppercase">ATTENDANCE HUB</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest">Real-time terminal & schedule desk</p>
          </div>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-850 self-start sm:self-center">
          <button
            onClick={() => setActiveTab("checkin")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "checkin" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-800" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            Terminal
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "history" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-800" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            Logs Table
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "calendar" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-800" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            Monthly Grid
          </button>
        </div>
      </div>

      {/* Main Body content */}
      <div className="flex-1 p-6">
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              className={`p-3.5 rounded-xl mb-5 text-xs font-bold flex items-center gap-2 border shadow-lg ${
                feedback.type === "success" 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
              }`}
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="flex-1">{feedback.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === "checkin" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
            {/* 1. Left Card: Employee Personal Details */}
            <div className="xl:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={employee?.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
                      alt={employee?.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 dark:border-slate-850 shadow-inner"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm leading-tight">
                        {getGreeting()}, {employee?.name || "Priyanka"}
                      </h4>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold mt-0.5">ENTERPRISE PORTAL ACTIVE</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 border ${
                    todayRecord 
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" 
                      : "bg-slate-150 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-250 dark:border-slate-800"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${todayRecord ? "bg-emerald-500 animate-ping" : "bg-slate-400"}`}></span>
                    {todayRecord ? "PRESENT" : "ABSENT"}
                  </span>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-850/80 pt-4 space-y-3.5">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Designation:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-bold">{employee?.jobTitle || "HR"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Clock In:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-bold">{todayRecord?.checkIn || "--:--"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Employee ID:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono font-bold">{employee?.id || "EMP-001"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Working Hours:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-bold">{getWorkingHoursDisplay()}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Department:</span>
                      <strong className="text-blue-600 dark:text-blue-400 font-bold">{employee?.department || "Engineering"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Attendance Status:</span>
                      <strong className={`font-bold ${
                        todayRecord 
                          ? (todayRecord.isApproved ? "text-emerald-500" : "text-amber-500") 
                          : "text-slate-500"
                      }`}>
                        {todayRecord ? (todayRecord.isApproved ? "Present" : "Pending Approval") : "Absent"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Reporting Manager:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-bold">Priya Verma</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Shift Schedule:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-bold">General</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-850/60 flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Real-time Indian shift parameters active.</span>
              </div>
            </div>

            {/* 2. Middle Card: LIVE SHIFT STANDARD TIME & stopwatch & Button */}
            <div className="xl:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm text-center flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
                  LIVE SHIFT STANDARD TIME
                </span>
                
                {/* Real-time Clock display */}
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-mono py-1">
                  {currentLiveTime || "12:53:59 PM"}
                </h2>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">
                  {currentLiveDate || "Saturday, July 4, 2026"}
                </p>

                {/* Active Working Stopwatch sub-panel */}
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 my-5">
                  <span className="text-[10px] tracking-widest uppercase text-slate-400 dark:text-slate-500 font-extrabold block">
                    ACTIVE WORKING STOPWATCH
                  </span>
                  
                  {/* Digital purple stopwatch */}
                  <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-widest font-mono mt-2 animate-pulse-subtle">
                    {stopwatch}
                  </div>
                  
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mt-1.5">
                    {todayRecord 
                      ? todayRecord.checkOut 
                        ? "Shift Logged & Concluded" 
                        : "Checked-In & Accruing Hours" 
                      : "Awaiting Shift Commencement"}
                  </span>
                </div>
              </div>

              <div className="space-y-3.5">
                {/* Big Action Buttons exactly based on reference image */}
                {!todayRecord ? (
                  <button
                    onClick={handleCheckIn}
                    disabled={checkingIn}
                    style={{ backgroundColor: "#0cff00", color: "#000000" }}
                    className="w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4 text-black" /> Clock In to Shift
                  </button>
                ) : !todayRecord.checkOut ? (
                  <button
                    onClick={handleCheckOut}
                    disabled={checkingIn}
                    style={{ backgroundColor: "#ff1616", color: "#ffffff" }}
                    className="w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-4 h-4 text-white animate-pulse" /> Clock Out of Shift
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider border border-dashed border-slate-250 dark:border-slate-800 flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" /> Shift Completed Today
                    </div>
                    <button
                      onClick={handleResetToday}
                      disabled={checkingIn}
                      className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-400 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 bg-slate-50/60 dark:bg-slate-900/60"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset Today's Log (Demo)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Right Card: Interactive Calendar and Today Schedule */}
            <div className="xl:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">
                  INTERACTIVE CALENDAR
                </span>
                
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-2">July 2026</h4>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] font-bold text-slate-400">
                  {["S", "M", "T", "W", "T", "F", "S"].map(d => (
                    <div key={d} className="py-0.5">{d}</div>
                  ))}
                  {calendarDays.map((cDay, idx) => {
                    if (!cDay.dayNum) return <div key={`empty-${idx}`} className="py-1"></div>;
                    const record = myLogs.find(a => a.date === cDay.dateStr);
                    const isSelectedDay = cDay.dayNum === 3 || cDay.dayNum === 4;
                    return (
                      <div
                        key={cDay.dayNum}
                        className={`py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                          isSelectedDay ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-400" : ""
                        } ${getDayStatusStyle(record?.status, record?.isApproved || false)}`}
                      >
                        {cDay.dayNum}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Schedule list from reference image */}
              <div className="border-t border-slate-100 dark:border-slate-850 pt-4">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2.5">
                  JULY 3 SCHEDULE
                </span>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 text-xs">
                    <span className="font-mono text-[9px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded shrink-0">09:00 AM</span>
                    <div>
                      <h5 className="font-bold text-slate-850 dark:text-slate-200">Daily Ops Team Sync</h5>
                      <p className="text-[9px] text-slate-400 mt-0.5">Conference Room A</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs">
                    <span className="font-mono text-[9px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded shrink-0">02:00 PM</span>
                    <div>
                      <h5 className="font-bold text-slate-850 dark:text-slate-200">Q3 OKRs Progress Review</h5>
                      <p className="text-[9px] text-slate-400 mt-0.5">Zoom Video Link</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs">
                    <span className="font-mono text-[9px] font-bold text-purple-500 bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 rounded shrink-0">04:30 PM</span>
                    <div>
                      <h5 className="font-bold text-slate-850 dark:text-slate-200">Engineering Onboarding</h5>
                      <p className="text-[9px] text-slate-400 mt-0.5">People Ops Desk</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between h-full">
            {/* Search and Filters for Admin */}
            {activeRole === "ADMIN" && (
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search name or ID..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Half-day">Half-day</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">Leave</option>
                </select>
              </div>
            )}

            {/* Logs List Container */}
            <div className="flex-1 overflow-y-auto max-h-[360px] border border-slate-200 dark:border-slate-800/80 rounded-xl divide-y divide-slate-100 dark:divide-slate-850 bg-slate-50 dark:bg-slate-950/40 pr-1">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No attendance logs found matching conditions.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredLogs.map(log => (
                    <div 
                      key={log.id} 
                      className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 dark:text-slate-100">{log.employeeName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({log.employeeId})</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                          <span>{log.date}</span>
                          {log.checkIn && <span>Clock-in: <strong className="text-slate-800 dark:text-slate-200 font-bold">{log.checkIn}</strong></span>}
                          {log.checkOut && <span>Clock-out: <strong className="text-slate-800 dark:text-slate-200 font-bold">{log.checkOut}</strong></span>}
                        </div>
                        {log.note && <span className="text-[10px] text-amber-500 italic block mt-1">Note: {log.note}</span>}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider ${
                          log.status === "Present" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                          log.status === "Half-day" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                          log.status === "Absent" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" :
                          "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                        }`}>
                          {log.status}
                        </span>

                        {log.isApproved ? (
                          <span className="text-emerald-500 flex items-center gap-0.5 font-bold text-[9px] uppercase tracking-wider">
                            <Check className="w-3.5 h-3.5" /> Approved
                          </span>
                        ) : activeRole === "ADMIN" ? (
                          <button
                            onClick={() => handleApprove(log.id)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-lg px-2.5 py-1 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <FileCheck className="w-3 h-3" /> Approve
                          </button>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 italic text-[10px] font-bold uppercase tracking-wider">Pending Approval</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={fetchAttendance} className="mt-4 text-xs text-blue-500 font-bold flex items-center justify-center gap-1 hover:text-blue-600 self-center cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
            </button>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">July 2026</span>
              <div className="flex gap-3 text-[9px] font-black uppercase tracking-wider">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500/40"></span> Present</span>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500/40"></span> Half</span>
                <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400"><span className="w-2 h-2 rounded-full bg-purple-500/40"></span> Leave</span>
                <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-500/40"></span> Absent</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                <div key={d} className="text-center font-mono font-extrabold text-[10px] text-slate-400 py-1">{d}</div>
              ))}
              {calendarDays.map((cDay, idx) => {
                if (!cDay.dayNum) return <div key={`empty-${idx}`}></div>;
                const record = myLogs.find(a => a.date === cDay.dateStr);
                return (
                  <div
                    key={cDay.dayNum}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-extrabold cursor-pointer transition-colors relative ${getDayStatusStyle(record?.status, record?.isApproved || false)}`}
                  >
                    <span>{cDay.dayNum}</span>
                    {record?.isApproved === false && (
                      <span className="absolute bottom-1 w-1 h-1 bg-amber-500 rounded-full animate-ping"></span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-4 font-semibold">
              *Calendar reflects approved and pending attendance states. Friday July 3rd is the current day context.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
