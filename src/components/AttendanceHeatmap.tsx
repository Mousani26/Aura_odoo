import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Flame, Clock, Award, ChevronDown, CheckCircle2, Info, X } from "lucide-react";

interface HeatmapCell {
  day: number;
  status: "Present" | "Late" | "Leave" | "Absent" | "Weekend" | "Future";
  checkIn?: string;
  checkOut?: string;
  note?: string;
}

interface MonthData {
  name: string;
  daysCount: number;
  startOffset: number; // For days of the week starting column (0 for Sunday, 1 for Monday etc.)
  cells: HeatmapCell[];
}

export default function AttendanceHeatmap() {
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [hoveredCell, setHoveredCell] = useState<{ monthName: string; cell: HeatmapCell } | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ monthName: string; cell: HeatmapCell } | null>(null);

  // Generate mock yearly attendance heatmap cells for 2026
  const months: MonthData[] = [
    { name: "January", daysCount: 31, startOffset: 4, cells: [] }, // 2026-01-01 is a Thursday (4)
    { name: "February", daysCount: 28, startOffset: 0, cells: [] }, // Sunday
    { name: "March", daysCount: 31, startOffset: 0, cells: [] }, // Sunday
    { name: "April", daysCount: 30, startOffset: 3, cells: [] }, // Wednesday
    { name: "May", daysCount: 31, startOffset: 5, cells: [] }, // Friday
    { name: "June", daysCount: 30, startOffset: 1, cells: [] }, // Monday
    { name: "July", daysCount: 31, startOffset: 3, cells: [] }, // Wednesday (we are around July 3rd, 2026)
    { name: "August", daysCount: 31, startOffset: 6, cells: [] }, // Saturday
    { name: "September", daysCount: 30, startOffset: 2, cells: [] }, // Tuesday
    { name: "October", daysCount: 31, startOffset: 4, cells: [] }, // Thursday
    { name: "November", daysCount: 30, startOffset: 0, cells: [] }, // Sunday
    { name: "December", daysCount: 31, startOffset: 2, cells: [] }  // Tuesday
  ];

  // Helper to determine status based on day index and month to make it look realistic
  const getMockStatus = (monthIdx: number, day: number, isFuture: boolean): HeatmapCell["status"] => {
    if (isFuture) return "Future";
    
    // Simulate weekends
    // In 2026, let's map actual weekend indices or just a simple algorithm
    const absoluteDay = day + (monthIdx * 3);
    if (absoluteDay % 7 === 0 || absoluteDay % 7 === 6) {
      return "Weekend";
    }

    // Unannounced absence
    if (monthIdx === 3 && day === 12) return "Absent";
    if (monthIdx === 2 && day === 15) return "Absent";
    if (monthIdx === 0 && day === 20) return "Absent";

    // Leaves
    if (monthIdx === 4 && (day === 5 || day === 6)) return "Leave";
    if (monthIdx === 6 && day === 3) return "Leave"; // Diya leave on July 3rd
    if (monthIdx === 1 && day === 18) return "Leave";

    // Late / Half Days
    if (absoluteDay % 13 === 0) return "Late";

    return "Present";
  };

  // Populate cells
  months.forEach((m, mIdx) => {
    m.cells = Array.from({ length: m.daysCount }, (_, i) => {
      const dayNum = i + 1;
      const isFuture = mIdx > 6 || (mIdx === 6 && dayNum > 3); // Current date is Friday, July 3rd, 2026
      const status = getMockStatus(mIdx, dayNum, isFuture);
      
      let checkIn = undefined;
      let checkOut = undefined;
      let note = undefined;

      if (status === "Present") {
        checkIn = "08:52:00";
        checkOut = "17:35:00";
      } else if (status === "Late") {
        checkIn = "09:42:00";
        checkOut = "13:30:00";
        note = "Half-day / Doctor appointment approval";
      } else if (status === "Leave") {
        note = "Approved Sick Leave (Medical Rest)";
      } else if (status === "Absent") {
        note = "Unexcused absence - SLA Deduction pending";
      }

      return { day: dayNum, status, checkIn, checkOut, note };
    });
  });

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  // Calculate consistency & hours based on past attendance
  const pastCells = months.flatMap((m, mIdx) => m.cells).filter(c => c.status !== "Future" && c.status !== "Weekend");
  const presentCount = pastCells.filter(c => c.status === "Present").length;
  const lateCount = pastCells.filter(c => c.status === "Late").length;
  const leaveCount = pastCells.filter(c => c.status === "Leave").length;
  const absentCount = pastCells.filter(c => c.status === "Absent").length;
  
  const consistencyScore = Math.round(((presentCount + (lateCount * 0.5)) / pastCells.length) * 100) || 89;
  const productiveHours = Math.round(presentCount * 8.2 + lateCount * 4.5) || 981;

  const filteredMonths = selectedMonth === "All" ? months : months.filter(m => m.name === selectedMonth);

  return (
    <div id="attendance-heatmap" className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" /> Yearly Attendance Heatmap (2026)
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Hover or click over any cell to review individual session check-in metrics, consistency scores, and corporate leave trends.
          </p>
        </div>
        
        {/* Month Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter Month:</span>
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 cursor-pointer focus:outline-none focus:border-indigo-500 appearance-none pr-8 min-w-[150px]"
            >
              <option value="All">Full Year (12 Months)</option>
              {months.map(m => (
                <option key={m.name} value={m.name}>{m.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Metrics Row Exactly as Requested in Image 3 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Consistency Score Card */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            <span>Consistency Score</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <strong className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{consistencyScore}%</strong>
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${consistencyScore}%` }}></div>
            </div>
            <p className="text-[9px] text-slate-500 block">Active working weekdays SLA</p>
          </div>
        </div>

        {/* Current Streak Card */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <strong className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">6 Days</strong>
          <p className="text-[9px] text-slate-500">Max Year Streak: <strong className="text-amber-500">11 Days</strong></p>
        </div>

        {/* Productive Hours Card */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            <span>Productive Hours</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <strong className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{productiveHours} Hrs</strong>
          <p className="text-[9px] text-slate-500">Estimated direct logs in 2026</p>
        </div>

        {/* Leave Days Card */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            <span>Leave Days</span>
            <span className="text-rose-500 font-extrabold">🎖️</span>
          </div>
          <strong className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{leaveCount} Days</strong>
          <p className="text-[9px] text-slate-500">Absences logged: <strong className="text-rose-500 font-bold">{absentCount} Days</strong></p>
        </div>
      </div>

      {/* Heatmap Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {filteredMonths.map((month, idx) => {
          const totalPresent = month.cells.filter(c => c.status === "Present").length;
          return (
            <div key={month.name} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-left">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wide">{month.name}</h4>
                <span className="text-[9px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                  {totalPresent} Present
                </span>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1.5">
                {weekdays.map((w, i) => (
                  <span key={i}>{w}</span>
                ))}
              </div>

              {/* Grid Cells */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty Offset columns */}
                {Array.from({ length: month.startOffset }).map((_, i) => (
                  <span key={`empty-${i}`} className="w-5 h-5"></span>
                ))}

                {month.cells.map((cell) => {
                  // Class and styling mapping
                  let cellClass = "bg-slate-100 dark:bg-slate-900/60";
                  if (cell.status === "Present") cellClass = "bg-emerald-500 hover:bg-emerald-400 cursor-pointer";
                  else if (cell.status === "Late") cellClass = "bg-amber-500 hover:bg-amber-400 cursor-pointer";
                  else if (cell.status === "Leave") cellClass = "bg-purple-500 hover:bg-purple-400 cursor-pointer";
                  else if (cell.status === "Absent") cellClass = "bg-rose-500 hover:bg-rose-400 cursor-pointer";
                  else if (cell.status === "Weekend") cellClass = "bg-slate-200 dark:bg-slate-800/40 opacity-40";
                  else if (cell.status === "Future") cellClass = "bg-slate-100 dark:bg-slate-900/10 opacity-10";

                  return (
                    <div
                      key={cell.day}
                      onMouseEnter={() => cell.status !== "Future" && cell.status !== "Weekend" && setHoveredCell({ monthName: month.name, cell })}
                      onMouseLeave={() => setHoveredCell(null)}
                      onClick={() => cell.status !== "Future" && cell.status !== "Weekend" && setSelectedCell({ monthName: month.name, cell })}
                      className={`w-5 h-5 rounded-md text-[9px] font-medium flex items-center justify-center transition-all ${cellClass}`}
                      title={`${month.name} ${cell.day}: ${cell.status}`}
                    >
                      {/* Quiet dot or digit */}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend Block */}
      <div className="flex flex-wrap items-center gap-4 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 justify-center">
        <span className="font-bold uppercase text-[9px] tracking-wider text-slate-500">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-emerald-500 rounded-md block"></span>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-amber-500 rounded-md block"></span>
          <span>Late / Half-day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-purple-500 rounded-md block"></span>
          <span>Approved Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-rose-500 rounded-md block"></span>
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-1.5 opacity-60">
          <span className="w-3.5 h-3.5 bg-slate-800 rounded-md block"></span>
          <span>Weekend</span>
        </div>
      </div>

      {/* Popups & Tooltips */}
      <AnimatePresence>
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 bg-slate-950 border border-slate-800 p-3.5 rounded-xl shadow-2xl text-left max-w-xs font-mono text-xs text-slate-200"
          >
            <div className="flex items-center gap-2 text-indigo-400 font-bold border-b border-slate-850 pb-1.5 mb-1.5">
              <Info className="w-4 h-4" />
              <span>{hoveredCell.monthName} {hoveredCell.cell.day}, 2026</span>
            </div>
            <p>Status: <strong className="text-slate-100">{hoveredCell.cell.status}</strong></p>
            {hoveredCell.cell.checkIn && <p>Check-In: <strong className="text-emerald-400">{hoveredCell.cell.checkIn}</strong></p>}
            {hoveredCell.cell.checkOut && <p>Check-Out: <strong className="text-amber-400">{hoveredCell.cell.checkOut}</strong></p>}
            {hoveredCell.cell.note && <p className="text-[10px] text-slate-400 mt-1 italic">*{hoveredCell.cell.note}</p>}
          </motion.div>
        )}

        {selectedCell && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 relative overflow-hidden shadow-2xl text-left"
            >
              <button
                onClick={() => setSelectedCell(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 uppercase tracking-wider">
                Attendance Detail Log
              </h3>

              <div className="py-4 space-y-3 text-xs font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Log Date:</span>
                  <span className="font-bold text-slate-100">{selectedCell.monthName} {selectedCell.cell.day}, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Day SLA Status:</span>
                  <span className="font-bold text-slate-100">{selectedCell.cell.status}</span>
                </div>
                {selectedCell.cell.checkIn && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Punch Check-In:</span>
                    <span className="font-bold text-emerald-400">{selectedCell.cell.checkIn}</span>
                  </div>
                )}
                {selectedCell.cell.checkOut && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Punch Check-Out:</span>
                    <span className="font-bold text-amber-400">{selectedCell.cell.checkOut}</span>
                  </div>
                )}
                {selectedCell.cell.note && (
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 mt-2">
                    <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-extrabold mb-1">HR Note / Remarks</p>
                    <p className="text-slate-400 text-[11px] font-sans leading-normal">{selectedCell.cell.note}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedCell(null)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-xs cursor-pointer transition-colors"
              >
                Dismiss Log Details
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
