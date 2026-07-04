import React, { useState, useEffect } from "react";
import { 
  Briefcase, Users, UserPlus, CheckCircle, Clock, Plus, Search, 
  Trash2, Mail, Phone, MapPin, Award, Filter, Sparkles, Building, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  status: "Active" | "Closed" | "Draft";
  applicantsCount: number;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedPosition: string;
  status: "Applied" | "Screened" | "Interviewing" | "Offered" | "Hired" | "Rejected";
  experience: string;
  rating: number;
}

export default function Recruitment() {
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem("hrms_recruitment_jobs");
    if (saved) return JSON.parse(saved);
    return [
      { id: "JOB-101", title: "Senior React Developer", department: "Engineering", location: "Bengaluru, IN (Hybrid)", type: "Full-Time", salary: "₹18L - ₹24L L.A.", status: "Active", applicantsCount: 14 },
      { id: "JOB-102", title: "Product Manager - HR Tech", department: "Product", location: "Mumbai, IN (Remote)", type: "Full-Time", salary: "₹22L - ₹28L L.A.", status: "Active", applicantsCount: 8 },
      { id: "JOB-103", title: "Talent Acquisition Specialist", department: "Human Resources", location: "New Delhi, IN (On-Site)", type: "Full-Time", salary: "₹8L - ₹12L L.A.", status: "Active", applicantsCount: 19 },
      { id: "JOB-104", title: "UI/UX Visual Designer", department: "Design", location: "Bengaluru, IN (Hybrid)", type: "Contract", salary: "₹12L - ₹15L L.A.", status: "Draft", applicantsCount: 0 }
    ];
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem("hrms_recruitment_candidates");
    if (saved) return JSON.parse(saved);
    return [
      { id: "CAN-001", name: "Ananya Sharma", email: "ananya.sharma@gmail.com", phone: "+91 98765 43210", appliedPosition: "Senior React Developer", status: "Interviewing", experience: "5.5 Years", rating: 5 },
      { id: "CAN-002", name: "Rohan Das", email: "rohan.das@outlook.com", phone: "+91 87654 32109", appliedPosition: "Product Manager - HR Tech", status: "Offered", experience: "7 Years", rating: 4 },
      { id: "CAN-003", name: "Pooja Malhotra", email: "pooja.m@techcorp.in", phone: "+91 76543 21098", appliedPosition: "Talent Acquisition Specialist", status: "Hired", experience: "3 Years", rating: 5 },
      { id: "CAN-004", name: "Kabir Mehta", email: "kabir.mehta@yahoo.com", phone: "+91 95432 10987", appliedPosition: "Senior React Developer", status: "Screened", experience: "4 Years", rating: 3 },
      { id: "CAN-005", name: "Meera Nair", email: "meera.nair@gmail.com", phone: "+91 81234 56789", appliedPosition: "UI/UX Visual Designer", status: "Applied", experience: "2 Years", rating: 4 }
    ];
  });

  const [activeTab, setActiveTab] = useState<"jobs" | "candidates">("candidates");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Job form states
  const [showAddJob, setShowAddJob] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDept, setNewDept] = useState("Engineering");
  const [newLoc, setNewLoc] = useState("");
  const [newType, setNewType] = useState("Full-Time");
  const [newSalary, setNewSalary] = useState("");

  // Candidate form states
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [newCanName, setNewCanName] = useState("");
  const [newCanEmail, setNewCanEmail] = useState("");
  const [newCanPhone, setNewCanPhone] = useState("");
  const [newCanPosition, setNewCanPosition] = useState("");
  const [newCanExp, setNewCanExp] = useState("");

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("hrms_recruitment_jobs", JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem("hrms_recruitment_candidates", JSON.stringify(candidates));
  }, [candidates]);

  const showNotificationMsg = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLoc.trim() || !newSalary.trim()) {
      showNotificationMsg("Please provide all required fields for the Job Opening.");
      return;
    }

    const newJob: Job = {
      id: `JOB-${Math.floor(105 + Math.random() * 800)}`,
      title: newTitle,
      department: newDept,
      location: newLoc,
      type: newType,
      salary: newSalary,
      status: "Active",
      applicantsCount: 0
    };

    setJobs(prev => [...prev, newJob]);
    setNewTitle("");
    setNewLoc("");
    setNewSalary("");
    setShowAddJob(false);
    showNotificationMsg(`Successfully published new vacancy: ${newJob.title}!`);
  };

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCanName.trim() || !newCanEmail.trim() || !newCanPosition) {
      showNotificationMsg("Please provide Candidate Name, Email, and Position.");
      return;
    }

    const newCandidate: Candidate = {
      id: `CAN-${String(candidates.length + 1).padStart(3, "0")}`,
      name: newCanName,
      email: newCanEmail,
      phone: newCanPhone || "N/A",
      appliedPosition: newCanPosition,
      status: "Applied",
      experience: newCanExp || "Not specified",
      rating: 4
    };

    setCandidates(prev => [newCandidate, ...prev]);
    
    // Update candidate count on job
    setJobs(prevJobs => prevJobs.map(j => j.title === newCanPosition ? { ...j, applicantsCount: j.applicantsCount + 1 } : j));

    setNewCanName("");
    setNewCanEmail("");
    setNewCanPhone("");
    setNewCanExp("");
    setShowAddCandidate(false);
    showNotificationMsg(`Registered candidate ${newCandidate.name} successfully!`);
  };

  const handleDeleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    showNotificationMsg("Job vacancy has been deleted.");
  };

  const handleDeleteCandidate = (id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
    showNotificationMsg("Candidate profile removed.");
  };

  const handleUpdateCandidateStatus = (id: string, newStatus: Candidate["status"]) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === id) {
        // If candidate gets hired, let's trigger a success notification
        if (newStatus === "Hired") {
          showNotificationMsg(`🎉 Congratulations! ${c.name} has been marked as HIRED! Onboarding is scheduled.`);
        }
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Hired":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Offered":
        return "bg-teal-500/10 text-teal-400 border-teal-500/20";
      case "Interviewing":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse";
      case "Screened":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Rejected":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const filteredCandidates = candidates.filter(can => {
    const matchesSearch = can.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          can.appliedPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          can.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || can.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredJobs = jobs.filter(job => {
    return job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           job.department.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div id="recruitment-hub" className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-yellow-500 animate-pulse" /> Talent Recruitment Desk
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Manage corporate careers, publish vacancies, evaluate candidate pipelines, and schedule interviews.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-center">
          <button
            onClick={() => { setActiveTab("candidates"); setSearchTerm(""); setStatusFilter("All"); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "candidates" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Candidate Pipeline ({candidates.length})
          </button>
          <button
            onClick={() => { setActiveTab("jobs"); setSearchTerm(""); setStatusFilter("All"); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "jobs" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Active Openings ({jobs.length})
          </button>
        </div>
      </div>

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Job Openings</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white">{jobs.filter(j => j.status === "Active").length}</span>
            <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">Live</span>
          </div>
        </div>
        <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Pipeline Size</span>
          <span className="text-2xl font-black text-blue-400">{candidates.length}</span>
        </div>
        <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Interviewing Now</span>
          <span className="text-2xl font-black text-indigo-400">{candidates.filter(c => c.status === "Interviewing").length}</span>
        </div>
        <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Successful Offers</span>
          <span className="text-2xl font-black text-emerald-400">{candidates.filter(c => c.status === "Offered" || c.status === "Hired").length}</span>
        </div>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 bg-yellow-500/10 text-yellow-400 text-xs font-bold rounded-xl border border-yellow-500/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow text-yellow-400" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Sections */}
      {activeTab === "candidates" ? (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search candidates by name, position or email..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Pipeline Stages</option>
                <option value="Applied">Applied</option>
                <option value="Screened">Screened</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offered">Offered</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button 
                onClick={() => setShowAddCandidate(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Candidate
              </button>
            </div>
          </div>

          {/* Add Candidate Form Modal Overlay */}
          {showAddCandidate && (
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-4">
              <h3 className="font-extrabold text-xs text-slate-200 uppercase tracking-widest">Register New Candidate Profile</h3>
              <form onSubmit={handleCreateCandidate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Candidate Name</label>
                  <input
                    type="text"
                    required
                    value={newCanName}
                    onChange={e => setNewCanName(e.target.value)}
                    placeholder="E.g., Priya Sen"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newCanEmail}
                    onChange={e => setNewCanEmail(e.target.value)}
                    placeholder="E.g., priya@example.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Phone Contact</label>
                  <input
                    type="text"
                    value={newCanPhone}
                    onChange={e => setNewCanPhone(e.target.value)}
                    placeholder="+91 99000 88000"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Applied Position</label>
                  <select
                    value={newCanPosition}
                    onChange={e => setNewCanPosition(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 focus:outline-none"
                  >
                    <option value="">-- Choose Job Posting --</option>
                    {jobs.map(j => (
                      <option key={j.id} value={j.title}>{j.title}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Candidate Experience (Years/Brief profile)</label>
                  <input
                    type="text"
                    value={newCanExp}
                    onChange={e => setNewCanExp(e.target.value)}
                    placeholder="E.g., 4 Years React, ex-Wipro"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2 flex items-end gap-2">
                  <button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black py-2 rounded-lg cursor-pointer">
                    Publish Candidate
                  </button>
                  <button type="button" onClick={() => setShowAddCandidate(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg cursor-pointer">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Candidate pipeline list */}
          <div className="bg-slate-950 rounded-xl border border-slate-850 overflow-hidden divide-y divide-slate-800/60">
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No candidate profiles found matching search criteria.
              </div>
            ) : (
              filteredCandidates.map(can => (
                <div key={can.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <h4 className="font-bold text-slate-200 text-sm">{can.name}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">ID: {can.id}</span>
                      <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-full uppercase tracking-wider ${getStatusStyle(can.status)}`}>
                        {can.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-blue-400 shrink-0" /> {can.appliedPosition}</div>
                      <div className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {can.email}</div>
                      <div className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {can.phone}</div>
                      <div className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Exp: {can.experience}</div>
                    </div>
                  </div>

                  {/* Dynamic control buttons to advance stages */}
                  <div className="flex items-center gap-2 self-start md:self-center">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase mr-1">Stage Action:</span>
                    <select
                      value={can.status}
                      onChange={e => handleUpdateCandidateStatus(can.id, e.target.value as any)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Screened">Screened</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offered">Offered</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => handleDeleteCandidate(can.id)}
                      className="p-1.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 rounded-lg cursor-pointer transition-colors"
                      title="Remove candidate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Jobs Vacancies List Section */
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search job postings..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              />
            </div>
            <button 
              onClick={() => setShowAddJob(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" /> Create New Job Opening
            </button>
          </div>

          {/* Add Job vacancy Overlay form */}
          {showAddJob && (
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-4">
              <h3 className="font-extrabold text-xs text-slate-200 uppercase tracking-widest">Post Corporate Vacancy</h3>
              <form onSubmit={handleCreateJob} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="E.g. Senior Node.js Specialist"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Corporate Department</label>
                  <select
                    value={newDept}
                    onChange={e => setNewDept(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Location Details</label>
                  <input
                    type="text"
                    required
                    value={newLoc}
                    onChange={e => setNewLoc(e.target.value)}
                    placeholder="E.g., Bengaluru, IN (Remote)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Employment Nature</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Salary Range (Comp structure)</label>
                  <input
                    type="text"
                    required
                    value={newSalary}
                    onChange={e => setNewSalary(e.target.value)}
                    placeholder="E.g. ₹15L - ₹20L L.A."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black py-2 rounded-lg cursor-pointer">
                    Publish Live
                  </button>
                  <button type="button" onClick={() => setShowAddJob(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg cursor-pointer">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Job listings list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map(job => (
              <div key={job.id} className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-extrabold">{job.id}</span>
                    <span className={`px-2 py-0.5 border text-[9px] font-extrabold rounded-full ${
                      job.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-slate-200 text-sm mt-1">{job.title}</h4>
                  <p className="text-xs text-blue-400 mt-0.5">{job.department}</p>

                  <div className="mt-3.5 space-y-1.5 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}</div>
                    <div className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-slate-500" /> {job.type}</div>
                    <div className="flex items-center gap-1.5 font-semibold text-slate-300"><span className="text-emerald-500 font-bold">Comp:</span> {job.salary}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-900 flex justify-between items-center text-xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    {job.applicantsCount} Applicants Linked
                  </span>

                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/15 rounded-lg cursor-pointer transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
