import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { motion, AnimatePresence } from "motion/react";
import { 
  Award, Gift, Sparkles, CheckCircle2, ShoppingBag, Coffee, Laptop, Heart, 
  Compass, ShieldAlert, Send, History, PlusCircle, User, RefreshCw, Star, Trophy
} from "lucide-react";

interface Voucher {
  id: string;
  brand: string;
  value: string;
  pointsRequired: number;
  icon: "shopping" | "coffee" | "tech" | "health";
  description: string;
  code?: string;
  isRedeemed: boolean;
}

interface Employee {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  achievements: Array<{
    id: string;
    badgeName: string;
    description: string;
    icon: string;
    awardedAt: string;
    points?: number;
  }>;
}

export default function RewardsVouchers() {
  const { token, employee, activeRole } = useAuth();
  
  // COMMON STATE
  const [notification, setNotification] = useState<{ message: string; code?: string } | null>(null);

  // --- EMPLOYEE VIEW STATE ---
  const [points, setPoints] = useState<number>(350); 
  const [vouchers, setVouchers] = useState<Voucher[]>([
    { id: "v-1", brand: "Amazon Corporate Pay", value: "₹2,500", pointsRequired: 150, icon: "shopping", description: "Universal corporate reward voucher valid on all Amazon store listings.", isRedeemed: false },
    { id: "v-2", brand: "Starbucks Elite Break", value: "₹500", pointsRequired: 40, icon: "coffee", description: "Enjoy premium espresso beverages at any partner location.", isRedeemed: false },
    { id: "v-3", brand: "Flipkart Tech Upgrade", value: "₹5,000", pointsRequired: 280, icon: "tech", description: "Electronics and work-from-home device subsidy voucher.", isRedeemed: false },
    { id: "v-4", brand: "Apollo Wellness Care", value: "₹1,500", pointsRequired: 90, icon: "health", description: "Preventative medical health diagnostics and pharmacy products.", isRedeemed: false }
  ]);

  const activeBadges = [
    { name: "Perfect Attendance", description: "Earned for zero absences in 3 consecutive months", rewardPoints: 100 },
    { name: "Problem Solver", description: "Quick resolution of critical system bugs", rewardPoints: 150 },
    { name: "Rising Star", description: "Successful delivery of the HRMS product roadmap", rewardPoints: 100 }
  ];

  // --- HR/ADMIN VIEW STATE ---
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [badgeName, setBadgeName] = useState("Perfect Attendance");
  const [customBadgeName, setCustomBadgeName] = useState("");
  const [badgeDescription, setBadgeDescription] = useState("");
  const [awardPoints, setAwardPoints] = useState(100);
  const [badgeIcon, setBadgeIcon] = useState("Award");

  const badgePresets = [
    { name: "Perfect Attendance", description: "Awarded for zero absences in 3 consecutive months", points: 100, icon: "CheckCircle2" },
    { name: "Problem Solver", description: "Quick resolution of critical system bugs and outages", points: 150, icon: "Sparkles" },
    { name: "Rising Star", description: "Outstanding performance and exceeding team goals", points: 100, icon: "Star" },
    { name: "Leadership Excellence", description: "Exhibiting stellar mentorship and guidance to team members", points: 200, icon: "Trophy" },
    { name: "Innovation Champion", description: "Pioneered novel solutions and corporate improvements", points: 150, icon: "Award" },
    { name: "Custom Commendation", description: "", points: 50, icon: "Award" }
  ];

  // Fetch employees on Admin load
  const fetchEmployees = async () => {
    if (!token || activeRole !== "ADMIN") return;
    setLoading(true);
    try {
      const res = await fetch("/api/employees", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Filter out Priya Sharma so HR doesn't award themselves
        const filtered = data.filter((e: Employee) => e.id !== "EMP-001" && e.name !== "Priya Sharma");
        setEmployees(filtered);
        if (filtered.length > 0) {
          setSelectedEmpId(filtered[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching employees", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeRole === "ADMIN") {
      fetchEmployees();
    }
  }, [token, activeRole]);

  // Sync preset description and points when select badge changes
  useEffect(() => {
    const preset = badgePresets.find(b => b.name === badgeName);
    if (preset && badgeName !== "Custom Commendation") {
      setBadgeDescription(preset.description);
      setAwardPoints(preset.points);
      setBadgeIcon(preset.icon);
    } else if (badgeName === "Custom Commendation") {
      setBadgeDescription("");
      setAwardPoints(50);
      setBadgeIcon("Award");
    }
  }, [badgeName]);

  const handleRedeem = (id: string, brand: string, pointsRequired: number) => {
    if (points < pointsRequired) {
      setNotification({ message: `Insufficient performance points. You need ${pointsRequired - points} more points.` });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const mockCode = "CORP-" + Math.random().toString(36).substring(2, 8).toUpperCase() + "-" + pointsRequired;
    setPoints(prev => prev - pointsRequired);
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, isRedeemed: true, code: mockCode } : v));

    setNotification({
      message: `Successfully redeemed! Your corporate coupon code for ${brand} is:`,
      code: mockCode
    });
  };

  const handleAwardBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId || !token) return;

    const finalBadgeName = badgeName === "Custom Commendation" ? customBadgeName : badgeName;
    if (!finalBadgeName.trim()) {
      alert("Please provide a badge name.");
      return;
    }
    if (!badgeDescription.trim()) {
      alert("Please enter a description or reason for this award.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/employees/${selectedEmpId}/achievements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          badgeName: finalBadgeName,
          description: badgeDescription,
          icon: badgeIcon,
          points: awardPoints
        })
      });

      if (res.ok) {
        setNotification({
          message: `Successfully awarded the '${finalBadgeName}' badge (${awardPoints} PTS) to employee.`
        });
        setTimeout(() => setNotification(null), 4000);

        // Reset fields
        if (badgeName === "Custom Commendation") {
          setCustomBadgeName("");
        }
        setBadgeDescription("");
        
        // Refresh employee list to display the new badge
        await fetchEmployees();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to award badge.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  // Find currently selected employee's achievements
  const currentEmp = employees.find(e => e.id === selectedEmpId);
  const currentEmpAchievements = currentEmp?.achievements || [];

  // --- HR/ADMIN VIEW ---
  if (activeRole === "ADMIN") {
    return (
      <div id="rewards-vouchers" className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 relative text-left">
        {/* Toast Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 right-6 z-50 bg-slate-950 border-2 border-emerald-500/30 text-slate-100 p-5 rounded-2xl shadow-2xl max-w-sm text-left space-y-3"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Recognition Success</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">{notification.message}</p>
              <button
                onClick={() => setNotification(null)}
                className="w-full bg-slate-800 hover:bg-slate-700 py-1.5 rounded-xl text-[10px] font-bold uppercase text-slate-300 transition-colors cursor-pointer border-none"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400 animate-pulse" /> Achievements & Recognition Management
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Design performance badges, commend employee milestones, and allocate corporate recognition points directly to the staff ledger.
            </p>
          </div>

          {/* Allocation Point Budget Balance */}
          <div className="bg-[#000000] px-4 py-2 rounded-2xl border border-amber-500/20 flex items-center gap-3">
            <div className="p-1.5 bg-amber-500/10 rounded-xl text-amber-400 animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-left font-mono">
              <span className="text-[9px] uppercase font-bold text-[#ffffff] block">Available HR Budget</span>
              <strong className="text-amber-400 text-sm font-extrabold">10,000 PTS</strong>
            </div>
          </div>
        </div>

        {/* Main Grid splitting Action Form and Current Employee Badges list */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column - Award Badge Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4 text-left shadow-lg">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-indigo-500" /> Award New Commendation
              </h3>

              <form onSubmit={handleAwardBadge} className="space-y-4">
                {/* Select Employee */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Employee</label>
                  <div className="relative">
                    <select
                      value={selectedEmpId}
                      onChange={e => setSelectedEmpId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 cursor-pointer focus:outline-none focus:border-indigo-500"
                    >
                      {loading ? (
                        <option>Loading employees...</option>
                      ) : employees.length === 0 ? (
                        <option>No eligible employees found</option>
                      ) : (
                        employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name} ({emp.jobTitle})</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Select Badge Preset */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Badge Preset</label>
                  <select
                    value={badgeName}
                    onChange={e => setBadgeName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 cursor-pointer focus:outline-none focus:border-indigo-500"
                  >
                    {badgePresets.map((preset, idx) => (
                      <option key={idx} value={preset.name}>{preset.name}</option>
                    ))}
                  </select>
                </div>

                {/* Custom Badge name field (if custom commendation) */}
                {badgeName === "Custom Commendation" && (
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Custom Badge Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Peer Mentor Extraordinaire"
                      value={customBadgeName}
                      onChange={e => setCustomBadgeName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* Points and Icon Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Points to Award</label>
                    <input
                      type="number"
                      min="10"
                      max="1000"
                      required
                      value={awardPoints}
                      onChange={e => setAwardPoints(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Icon Vibe</label>
                    <select
                      value={badgeIcon}
                      onChange={e => setBadgeIcon(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 cursor-pointer focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Award">🏆 Award Cup</option>
                      <option value="Star">⭐ Star Burst</option>
                      <option value="Trophy">🥇 Trophy Golden</option>
                      <option value="Sparkles">✨ Sparkles Magic</option>
                      <option value="CheckCircle2">✅ Verified Check</option>
                    </select>
                  </div>
                </div>

                {/* Commendation Details / Description */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Commendation Reason / Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe why this employee is being recognized today. This will be published to their talent ledger and trigger an email notification."
                    value={badgeDescription}
                    onChange={e => setBadgeDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting || employees.length === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md shadow-indigo-600/20 border-none disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> {submitting ? "Awarding..." : "Award Achievement Badge"}
                </button>
              </form>
            </div>

            {/* Compliance Note */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 flex items-center gap-2.5 text-[10px] text-slate-500">
              <ShieldAlert className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="leading-normal">
                Corporate recognitions are bound directly to active HR payroll metrics and will influence year-end evaluation audits automatically.
              </span>
            </div>
          </div>

          {/* Right Column - Employee Achievements Ledger list */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl text-left shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3 mb-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 text-[#fafbff]">
                    <History className="w-4 h-4 text-indigo-500" /> Active Employee Achievements Ledger
                  </h3>
                  {currentEmp && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      {currentEmp.name}
                    </span>
                  )}
                </div>

                {/* Dynamic Achievements List */}
                {selectedEmpId ? (
                  currentEmpAchievements.length === 0 ? (
                    <div className="text-center py-24 text-slate-400 dark:text-slate-600 space-y-2">
                      <Star className="w-10 h-10 text-slate-300 dark:text-slate-800 mx-auto animate-pulse" />
                      <p className="text-xs font-medium">No performance badges awarded to this employee yet.</p>
                      <p className="text-[10px]">Use the left form to deploy their very first commendation badge!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
                      {currentEmpAchievements.map((badge: any, bIdx: number) => {
                        let IconComp = Award;
                        if (badge.icon === "Star") IconComp = Star;
                        else if (badge.icon === "Trophy") IconComp = Trophy;
                        else if (badge.icon === "Sparkles") IconComp = Sparkles;
                        else if (badge.icon === "CheckCircle2") IconComp = CheckCircle2;

                        let cardBg = "bg-slate-50 dark:bg-slate-900";
                        let descColor = "text-slate-500 dark:text-slate-400";
                        if (bIdx === 0) {
                          cardBg = "bg-[#0e023f]";
                          descColor = "text-[#ffffff]";
                        } else if (bIdx === 1) {
                          cardBg = "bg-[#0e023f]";
                          descColor = "text-[#fbfcff]";
                        }

                        return (
                          <div
                            key={badge.id}
                            className={`${cardBg} border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors`}
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <div className="p-2 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl text-amber-500">
                                  <IconComp className="w-4.5 h-4.5" />
                                </div>
                                <span className="text-[10px] font-mono font-bold text-indigo-500 dark:text-indigo-400">
                                  +{badge.points || 100} PTS
                                </span>
                              </div>

                              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                {badge.badgeName}
                              </h4>
                              <p className={`text-[10px] leading-normal ${descColor}`}>
                                {badge.description}
                              </p>
                            </div>

                            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-850/60 flex justify-between text-[9px] text-slate-400 uppercase font-mono font-bold">
                              <span>Issued Ledger</span>
                              <span>{badge.awardedAt}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  <div className="text-center py-24 text-slate-500">
                    Select an employee to examine their current talent rewards ledger.
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850/60 text-[10px] text-slate-500 flex justify-between items-center">
                <span>Direct integration with active employee profiles.</span>
                <button
                  onClick={fetchEmployees}
                  className="bg-transparent border-none text-indigo-500 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1 font-bold text-[10px]"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh Ledger
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    );
  }

  // --- EMPLOYEE VIEW (DEFAULT) ---
  return (
    <div id="rewards-vouchers" className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 relative text-left">
      
      {/* Toast Notification with Redeem Code */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-slate-950 border-2 border-indigo-500/30 text-slate-100 p-5 rounded-2xl shadow-2xl max-w-sm text-left space-y-3"
          >
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs font-mono uppercase">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Voucher Status Notification</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">{notification.message}</p>
            {notification.code && (
              <div className="bg-slate-900 border border-indigo-500/20 p-2.5 rounded-xl text-center select-all cursor-pointer font-mono font-extrabold text-sm text-amber-400 tracking-wider">
                {notification.code}
              </div>
            )}
            <button
              onClick={() => setNotification(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 py-1.5 rounded-xl text-[10px] font-bold uppercase text-slate-300 transition-colors cursor-pointer border-none"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400 animate-bounce" /> Performance Gift Vouchers
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Redeem high-value brand vouchers powered by your performance badges, stellar teamwork, and perfect attendance milestones.
          </p>
        </div>

        {/* Current Reward Points Balance */}
        <div className="bg-[#000000] px-4 py-2 rounded-2xl border border-indigo-500/20 flex items-center gap-3">
          <div className="p-1.5 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-left font-mono">
            <span className="text-[9px] uppercase font-bold text-[#ffffff] block">Available Points</span>
            <strong className="text-[#c2f800] text-sm font-extrabold">{points} PTS</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Work badges/achievements tracking */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-3.5 shadow-sm text-left">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Earning Milestones
            </h3>
            <div className="space-y-3">
              {activeBadges.map((badge, idx) => (
                <div key={idx} className="border-l-2 border-indigo-500/40 pl-3.5 space-y-0.5">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex justify-between items-center">
                    <span>{badge.name}</span>
                    <span className="text-[10px] text-indigo-500 font-bold">+{badge.rewardPoints} PTS</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#aeaeae] p-4 rounded-xl border border-slate-850 flex items-center gap-2.5 text-[10px] text-[#0c0c0c]">
            <ShieldAlert className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="text-left leading-normal text-[#0c0c0c]">
              Vouchers are funded directly by corporate rewards and team performance budgets. Redemptions are permanent.
            </span>
          </div>
        </div>

        {/* Right Column: Vouchers Listing Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vouchers.map((v, idx) => {
            let iconComponent = <ShoppingBag className="w-5 h-5" />;
            if (v.icon === "coffee") iconComponent = <Coffee className="w-5 h-5" />;
            else if (v.icon === "tech") iconComponent = <Laptop className="w-5 h-5" />;
            else if (v.icon === "health") iconComponent = <Heart className="w-5 h-5" />;

            // Custom color presets defined by CSS Selectors in focus-mode
            let cardBg = "bg-white dark:bg-slate-950";
            let titleColor = "text-slate-800 dark:text-slate-200 group-hover:text-indigo-400";
            if (idx === 0) {
              cardBg = "bg-[#f90005]";
              titleColor = "text-[#000000]";
            } else if (idx === 1) {
              cardBg = "bg-[#ffb200]";
              titleColor = "text-[#090909]";
            } else if (idx === 2) {
              cardBg = "bg-[#fff900]";
              titleColor = "text-[#000000]";
            } else if (idx === 3) {
              cardBg = "bg-[#00ff2b]";
              titleColor = "text-[#020202]";
            }

            return (
              <div
                key={v.id}
                className={`${cardBg} border rounded-3xl p-4 flex flex-col justify-between transition-all text-left group ${
                  v.isRedeemed
                    ? "border-emerald-500/20 bg-emerald-500/[0.01]"
                    : "border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 transition-colors">
                      {iconComponent}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Voucher Value</span>
                      <strong className="text-emerald-500 text-sm font-extrabold">{v.value}</strong>
                    </div>
                  </div>

                  <h4 className={`font-extrabold text-xs ${titleColor} transition-colors`}>
                    {v.brand}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    {v.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    {v.pointsRequired} PTS Required
                  </span>

                  {v.isRedeemed ? (
                    <span className="text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
                      Redeemed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRedeem(v.id, v.brand, v.pointsRequired)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase cursor-pointer transition-all ${
                        points >= v.pointsRequired
                          ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                          : "bg-slate-200 dark:bg-slate-900 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      Redeem
                    </button>
                  )}
                </div>

                {v.code && (
                  <div className="mt-3 bg-slate-950 p-2 rounded-xl text-center border border-dashed border-emerald-500/20 font-mono text-[10px] text-emerald-400 font-extrabold tracking-widest">
                    CODE: {v.code}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
