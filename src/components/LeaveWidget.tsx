import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { 
  Calendar, CheckCircle2, XCircle, Clock, FileText, Send, 
  MessageSquare, User, RefreshCw, AlertTriangle 
} from "lucide-react";
import { LeaveRequest } from "../types.js";

export const LeaveWidget: React.FC = () => {
  const { token, employee, activeRole } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Apply Form State
  const [leaveType, setLeaveType] = useState<"Paid Leave" | "Sick Leave" | "Unpaid Leave">("Paid Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Admin approval comments state
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  const fetchLeaves = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/leave", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [token, activeRole]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !remarks) {
      alert("Please fill in all leave request fields.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date must be before or equal to End date.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ leaveType, startDate, endDate, remarks })
      });
      const data = await res.json();
      if (res.ok) {
        setStartDate("");
        setEndDate("");
        setRemarks("");
        await fetchLeaves();
        alert("Leave request submitted successfully!");
      } else {
        alert(data.error || "Submission failed");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproval = async (id: string, isApprove: boolean) => {
    if (!token) return;
    const url = `/api/leave/${id}/${isApprove ? "approve" : "reject"}`;
    const adminComments = comments[id] || "";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ adminComments })
      });
      if (res.ok) {
        setRequests(prev => prev.map(req => req.id === id ? { 
          ...req, 
          status: isApprove ? "Approved" : "Rejected",
          adminComments 
        } : req));
        // Clear comments state for this req
        setComments(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } else {
        const err = await res.json();
        alert(err.error || "Action failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Split calculations
  const myRequests = activeRole === "ADMIN" ? requests : requests.filter(r => r.employeeId === employee?.id);
  const pendingRequests = myRequests.filter(r => r.status === "Pending");
  const historyRequests = myRequests.filter(r => r.status !== "Pending");

  return (
    <div id="leave-widget" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[520px]">
      {/* Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">LEAVE WORKFLOWS</h3>
        </div>
        <button onClick={fetchLeaves} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
          <RefreshCw className="w-3.5 h-3.5" /> Reload
        </button>
      </div>

      {/* Split Screens */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left Side: Form (Only for Employee Mode) */}
        {activeRole === "EMPLOYEE" && (
          <div className="md:col-span-5 p-4 border-r border-slate-800/80 bg-slate-950/20 overflow-y-auto flex flex-col justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Apply for Leave</h4>
            
            <form onSubmit={handleApply} className="space-y-3.5 flex-1">
              {/* Type Select */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Paid Leave">Paid Leave (Vacation)</option>
                  <option value="Sick Leave">Sick Leave (Medical)</option>
                  <option value="Unpaid Leave">Unpaid Leave (Personal)</option>
                </select>
              </div>

              {/* Date Ranges */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Remarks / Comments</label>
                <textarea
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="Specify details, cover arrangement..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Submit Request
              </button>
            </form>
          </div>
        )}

        {/* Right Side: List Views */}
        <div className={`p-4 flex flex-col justify-between overflow-y-auto ${activeRole === "EMPLOYEE" ? "md:col-span-7" : "md:col-span-12"}`}>
          {/* Active Pending Leaves */}
          <div className="flex-1 overflow-y-auto pr-1">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" /> Pending Approval ({pendingRequests.length})
            </h4>

            {pendingRequests.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 bg-slate-950/20 border border-slate-850 rounded-xl text-center">No pending leave requests found.</p>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map(req => (
                  <div key={req.id} className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl text-xs">
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className="text-slate-200 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {req.employeeName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider bg-indigo-500/10 text-indigo-400">
                        {req.leaveType}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 mb-2">
                      Period: <strong className="text-slate-300">{req.startDate}</strong> to <strong className="text-slate-300">{req.endDate}</strong>
                    </div>

                    <p className="bg-slate-950/80 border border-slate-850/50 p-2 rounded-lg text-slate-300 italic text-[11px] mb-2 leading-relaxed">
                      "{req.remarks}"
                    </p>

                    {/* Admin Workflow controls */}
                    {activeRole === "ADMIN" ? (
                      <div className="mt-3 pt-3 border-t border-slate-800">
                        <input
                          type="text"
                          placeholder="Admin reply comments (optional)..."
                          value={comments[req.id] || ""}
                          onChange={e => setComments({ ...comments, [req.id]: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-200 placeholder-slate-600 mb-2.5 focus:outline-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleApproval(req.id, false)}
                            className="bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 font-semibold rounded-lg px-2.5 py-1 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                          <button
                            onClick={() => handleApproval(req.id, true)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg px-2.5 py-1 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic block text-right">Awaiting HR feedback</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Past/Processed Leaves */}
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-5 mb-2.5">Processed Leaves ({historyRequests.length})</h4>
            {historyRequests.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-3 bg-slate-950/20 border border-slate-850 rounded-xl text-center">No historical requests found.</p>
            ) : (
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {historyRequests.map(req => (
                  <div key={req.id} className="bg-slate-950/20 border border-slate-850 p-2.5 rounded-xl text-[11px] flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300">{req.employeeName}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                        req.status === "Approved" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="text-slate-400">
                      {req.leaveType} | {req.startDate} to {req.endDate}
                    </div>

                    {req.adminComments && (
                      <p className="bg-slate-950/30 text-[10px] text-slate-400 p-1.5 rounded-md mt-1 border-l-2 border-indigo-500/50">
                        <strong>HR response:</strong> "{req.adminComments}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
