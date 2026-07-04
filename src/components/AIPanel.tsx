import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { Brain, Bot, Sparkles, TrendingUp, AlertTriangle, Send, ShieldAlert, BadgeInfo } from "lucide-react";
import { motion } from "motion/react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const cleanAIText = (text: string): string => {
  if (!text) return "";
  // Strip all asterisks
  let cleaned = text.replace(/\*/g, "");
  // Strip backtick code block wrappers if any
  cleaned = cleaned.replace(/```[a-zA-Z]*/g, "").replace(/```/g, "");
  return cleaned.trim();
};

export const AIPanel: React.FC = () => {
  const { token, activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState<"chatbot" | "attendance" | "leave">("chatbot");
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Hello! I am your Smart HR Assistant. Ask me anything, such as 'Who is absent today?', 'How many pending leaves?', or 'Lookup Diya Iyer'." }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Analytics states
  const [attendanceAnalysis, setAttendanceAnalysis] = useState<string>("");
  const [leaveInsights, setLeaveInsights] = useState<string>("");
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const fetchAttendanceAnalytics = async () => {
    if (!token) return;
    setLoadingAnalytics(true);
    try {
      const res = await fetch("/api/ai/analytics/attendance", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAttendanceAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchLeaveInsights = async () => {
    if (!token) return;
    setLoadingAnalytics(true);
    try {
      const res = await fetch("/api/ai/insights/leave", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setLeaveInsights(data.insights);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (activeTab === "attendance" && !attendanceAnalysis) {
      fetchAttendanceAnalytics();
    } else if (activeTab === "leave" && !leaveInsights) {
      fetchLeaveInsights();
    }
  }, [activeTab]);

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputMessage;
    if (!promptToSend.trim()) return;

    const userMsg: Message = { sender: "user", text: promptToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ question: promptToSend })
      });

      const contentType = res.headers.get("content-type");
      let data: any = {};
      
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Server returned status ${res.status}`);
      }

      if (res.ok) {
        setMessages(prev => [...prev, { sender: "ai", text: data.answer }]);
      } else {
        setMessages(prev => [...prev, { sender: "ai", text: data.error || `Error ${res.status}: Something went wrong.` }]);
      }
    } catch (err: any) {
      console.error("AI Assistant query failed:", err);
      setMessages(prev => [...prev, { sender: "ai", text: `Error: ${err.message || "Network error. Please try again."}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestedPrompts = [
    "Who is absent today?",
    "How many pending leaves?",
    "Look up Aarav Patel details",
    "Burnout analysis"
  ];

  return (
    <div id="ai-panel" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-[520px] flex flex-col">
      {/* Panel Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl text-white">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-wide">Aura Co-Pilot</h3>
            <span className="text-xs text-blue-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" /> Active Powered Engine
            </span>
          </div>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-slate-950/40 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setActiveTab("chatbot")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "chatbot" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:text-white"
            }`}
          >
            Smart Chat
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "attendance" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:text-white"
            }`}
          >
            Attendance AI
          </button>
          <button
            onClick={() => setActiveTab("leave")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "leave" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:text-white"
            }`}
          >
            Burnout Insights
          </button>
        </div>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col text-slate-100">
        {activeTab === "chatbot" && (
          <div className="flex-1 flex flex-col justify-between h-full">
            {/* Scrollable messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
               {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 15 }}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      m.sender === "user" ? "bg-indigo-600" : "bg-slate-800 border border-slate-700"
                    }`}>
                      {m.sender === "user" ? "U" : <Bot className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className={`rounded-xl p-3 text-sm leading-relaxed ${
                      m.sender === "user" 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "bg-slate-800/80 border border-slate-700/60 text-slate-100 whitespace-pre-line shadow-sm"
                    }`}>
                      {m.sender === "ai" ? cleanAIText(m.text) : m.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Prompts */}
            <div className="mb-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Suggested Questions:</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p)}
                    className="text-xs bg-cyan-100 hover:bg-cyan-200 border-none rounded-lg px-2.5 py-1 text-cyan-950 font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Message input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask chatbot about attendance, leaves, lookup..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="flex-1 flex flex-col justify-center h-full">
            {loadingAnalytics ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-400">Gemini is processing attendance trend logs...</p>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[380px] bg-slate-950/50 border border-slate-800 rounded-xl p-4 leading-relaxed whitespace-pre-line text-sm pr-2 text-slate-300">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800 text-blue-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase tracking-wider">AI Attendance Analytics</span>
                </div>
                {attendanceAnalysis ? cleanAIText(attendanceAnalysis) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-slate-400">No report generated. Click below to retrieve.</p>
                    <button onClick={fetchAttendanceAnalytics} className="mt-3 bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer text-white">Generate report</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "leave" && (
          <div className="flex-1 flex flex-col justify-center h-full">
            {loadingAnalytics ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-400">Gemini is evaluating workload burnout metrics...</p>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[380px] bg-slate-950/50 border border-slate-800 rounded-xl p-4 leading-relaxed whitespace-pre-line text-sm pr-2 text-slate-300">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800 text-amber-500">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-xs uppercase tracking-wider">Burnout & Talent Insights</span>
                </div>
                {leaveInsights ? cleanAIText(leaveInsights) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-slate-400">No insights loaded. Click below to analyze.</p>
                    <button onClick={fetchLeaveInsights} className="mt-3 bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer text-white">Load insights</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer warning */}
      <div className="bg-slate-950/80 px-4 py-2 border-t border-slate-800/60 flex items-center gap-2">
        <BadgeInfo className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[10px] text-slate-400">
          The AI models process actual data snapshots to offer strategic HR insights in real-time.
        </span>
      </div>
    </div>
  );
};
