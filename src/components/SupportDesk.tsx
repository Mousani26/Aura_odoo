import React, { useState, useEffect } from "react";
import { LifeBuoy, AlertCircle, CheckCircle2, Trash2, Clock, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Ticket {
  id: string;
  topic: string;
  priority: "Low" | "Normal" | "High" | "Critical";
  description: string;
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
}

export default function SupportDesk() {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem("hrms_support_tickets");
    return saved ? JSON.parse(saved) : [];
  });

  const [topic, setTopic] = useState("");
  const [priority, setPriority] = useState<"Low" | "Normal" | "High" | "Critical">("Normal");
  const [description, setDescription] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("hrms_support_tickets", JSON.stringify(tickets));
  }, [tickets]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !description.trim()) {
      setNotification("Please fill in all fields.");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const newTicket: Ticket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      topic,
      priority,
      description,
      status: "Open",
      createdAt: new Date().toLocaleString(),
    };

    setTickets((prev) => [newTicket, ...prev]);
    setTopic("");
    setPriority("Normal");
    setDescription("");
    setNotification(`Ticket ${newTicket.id} filed successfully!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDelete = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "Critical":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "High":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Normal":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div id="support-desk" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <LifeBuoy className="w-5 h-5 text-blue-500" /> Employee Help Desk
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
          Submit tickets, view resolutions, or read platform documentation
        </p>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl border border-blue-500/20 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-850">
          <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">
            Open Help Desk Ticket
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                Issue Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Geofence Check-in Error"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                Description Details
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please elaborate..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md hover:shadow-blue-600/10 cursor-pointer active:scale-95"
            >
              File Support Ticket
            </button>
          </form>
        </div>

        {/* Right Tickets List Column */}
        <div className="lg:col-span-7 flex flex-col">
          <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">
            Your Support Tickets ({tickets.length})
          </h3>

          <div className="flex-1 overflow-y-auto max-h-[380px] space-y-3 pr-1">
            {tickets.length === 0 ? (
              <div className="h-48 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 italic text-xs">
                <AlertCircle className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                No tickets filed yet by you.
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-750 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-extrabold text-slate-400 uppercase bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-2 py-0.5 rounded">
                            {t.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${getPriorityColor(t.priority)}`}>
                            {t.priority}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-2">{t.topic}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-normal whitespace-pre-line">{t.description}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer rounded-lg hover:bg-rose-500/10"
                        title="Delete ticket record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Filed: {t.createdAt}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        <strong className="text-blue-500 font-extrabold uppercase">{t.status}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
