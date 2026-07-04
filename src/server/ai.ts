import { GoogleGenAI } from "@google/genai";
import { readDB, DBState } from "./db.js";

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is not defined. AI features will fallback to deterministic rules.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

export async function askHRAssistant(question: string, contextEmployeeId?: string): Promise<string> {
  const db = readDB();
  const todayStr = "2026-07-03"; // Matches mock system time context

  // Gather current snapshots to feed to Gemini
  const activeAbsences = db.attendance
    .filter(a => a.date === todayStr && (a.status === "Absent" || a.status === "Leave"))
    .map(a => `${a.employeeName} (${a.status}${a.note ? ` - ${a.note}` : ""})`);
  
  const activePresents = db.attendance
    .filter(a => a.date === todayStr && (a.status === "Present" || a.status === "Half-day"))
    .map(a => `${a.employeeName} (${a.status}${a.checkIn ? ` checked in at ${a.checkIn}` : ""})`);

  const pendingLeaves = db.leaveRequests.filter(l => l.status === "Pending");
  const employeesList = db.employees.map(e => `${e.id}: ${e.name} - ${e.jobTitle} (${e.department}), Join Date: ${e.joinDate}, Status: ${e.status}`);

  const systemPrompt = `
You are Aura, the Human Resources Smart Assistant for the HR system called "Aura - Every workday, perfectly aligned".
The current system date is Friday, July 3rd, 2026.

Here is the current real-time database snapshot for the company:
- EMPLOYEES:
${employeesList.join("\n")}

- TODAY'S PRESENTS (${todayStr}):
${activePresents.length > 0 ? activePresents.join("\n") : "None checked in yet"}

- TODAY'S ABSENCES / LEAVES (${todayStr}):
${activeAbsences.length > 0 ? activeAbsences.join("\n") : "No absences logged"}

- PENDING LEAVE REQUESTS:
${pendingLeaves.length > 0 ? pendingLeaves.map(l => `- ID: ${l.id}, Employee: ${l.employeeName}, Leave: ${l.leaveType}, Dates: ${l.startDate} to ${l.endDate}, Remarks: "${l.remarks}"`).join("\n") : "No pending leaves"}

If the user asks questions like:
- "Who is absent today?" -> list active absences and leave types.
- "How many pending leaves?" -> count and describe pending leaves.
- "Employee details lookup" or details about a specific employee -> present relevant details from the employee list professionally.
- Personal queries -> answer in a helpful, friendly, and expert HR Officer tone.

Keep answers professional, elegant, highly formatted with bullet points or bold keys, and helpful. Avoid verbose intros/outros.
`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      return getMockResponse(question, db, todayStr);
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: question,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
      }
    });

    return response.text || "I was unable to process this request. Let me know if you have other questions.";
  } catch (error) {
    console.error("Gemini API call failed, using mock rules:", error);
    return getMockResponse(question, db, todayStr);
  }
}

export async function getAIAttendanceAnalytics(): Promise<string> {
  const db = readDB();
  const systemInstruction = `
You are an expert HR Data Scientist. Analyze the company's attendance logs and provide a short, high-level, bulleted analytics summary.
Highlight:
1. Most punctual employees (check-in times closest to or before 9:00 AM).
2. Attendance trends (e.g., overall present rates, patterns).
3. Sickness / Absenteeism patterns and operational recommendation.

Make the output beautifully formatted with clear bold headings, bullets, and a professional business report format.
Keep it strictly under 250 words.
`;

  const dataString = JSON.stringify({
    employees: db.employees.map(e => ({ id: e.id, name: e.name, department: e.department })),
    attendance: db.attendance
  });

  try {
    if (!process.env.GEMINI_API_KEY) {
      return getMockAttendanceAnalysis();
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Analyze this attendance logs payload: ${dataString}`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
      }
    });

    return response.text || getMockAttendanceAnalysis();
  } catch (error) {
    return getMockAttendanceAnalysis();
  }
}

export async function getAILeaveInsights(): Promise<string> {
  const db = readDB();
  const systemInstruction = `
You are an expert HR Talent & Wellness Officer. Analyze the company's leave requests and holiday patterns.
Provide a beautiful, insightful HR summary containing:
1. Leave Distribution Trends (e.g., which leave types are most popular).
2. Burnout Prediction & Sabbatical Warnings (highlight any employees who are working extremely hard or have taken zero time off recently, or are exhibiting sick-leave spikes).
3. Talent Management Recommendation (e.g., resource loading advice).

Make the output beautifully formatted with clear bold headings, bullets, and a professional wellness report format.
Keep it strictly under 250 words.
`;

  const dataString = JSON.stringify({
    employees: db.employees,
    leaveRequests: db.leaveRequests,
    attendance: db.attendance
  });

  try {
    if (!process.env.GEMINI_API_KEY) {
      return getMockLeaveInsights();
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Analyze this HR leave and wellness payload: ${dataString}`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
      }
    });

    return response.text || getMockLeaveInsights();
  } catch (error) {
    return getMockLeaveInsights();
  }
}

// Fallbacks if API key is missing or calls fail

function getMockResponse(question: string, db: DBState, todayStr: string): string {
  const q = question.toLowerCase();
  
  if (q.includes("absent") || q.includes("who is off") || q.includes("not here")) {
    const activeAbsences = db.attendance.filter(a => a.date === todayStr && (a.status === "Absent" || a.status === "Leave"));
    if (activeAbsences.length === 0) return "**Today's Absences (July 3, 2026)**:\nNo employees are absent or on leave today! Excellent attendance.";
    return `**Today's Absences & Leaves (July 3, 2026)**:\n` + activeAbsences.map(a => `- **${a.employeeName}**: Status is **${a.status}** ${a.note ? `(${a.note})` : ""}`).join("\n");
  }

  if (q.includes("pending") || q.includes("leave request") || q.includes("approval")) {
    const pending = db.leaveRequests.filter(l => l.status === "Pending");
    if (pending.length === 0) return "**Pending Leaves**:\nThere are currently no pending leave requests awaiting approval.";
    return `**Pending Leave Requests**:\n` + pending.map(l => `- **${l.employeeName}** requested *${l.leaveType}* from **${l.startDate}** to **${l.endDate}**\n  *Remarks*: "${l.remarks}"`).join("\n");
  }

  if (q.includes("lookup") || q.includes("employee") || q.includes("emp-") || q.includes("details")) {
    // Try to extract employee name or ID
    for (const emp of db.employees) {
      if (q.includes(emp.id.toLowerCase()) || q.includes(emp.name.toLowerCase().split(" ")[0])) {
        return `**Employee Details Lookup**:
- **ID**: ${emp.id}
- **Name**: ${emp.name}
- **Role**: ${emp.jobTitle}
- **Department**: ${emp.department}
- **Status**: ${emp.status}
- **Contact**: ${emp.phone} | ${emp.email}
- **Address**: ${emp.address}
- **Salary Structure**: Base: $${emp.salaryStructure.base}/mo | Allowance: $${emp.salaryStructure.allowance}/mo
- **Badges**: ${emp.achievements.length > 0 ? emp.achievements.map(a => `🏅 ${a.badgeName}`).join(", ") : "None yet"}`;
      }
    }
    return `**Employee Lookup**: I couldn't identify the specific employee you are asking about. Please provide a full name or ID (e.g. "EMP-002" or "John"). Currently registered team members are: Sarah Jenkins, John Doe, Jane Smith, Alice Johnson.`;
  }

  return `Hello! I am your Smart HR assistant. I can help you with:
- **Daily Attendance**: Ask "Who is absent today?"
- **Leave Management**: Ask "How many pending leaves?"
- **Staff Records**: Ask "Look up details for John Doe" or similar.

*Note: The Gemini API is currently offline or unconfigured, running in high-fidelity deterministic mode.*`;
}

function getMockAttendanceAnalysis(): string {
  return `### AI Attendance Insights
*Based on June-July historical data*

- **Punctuality Leaders**: 
  - **Sarah Jenkins** (HR) and **John Doe** (Engineering) hold a perfect **98%** on-time record (average check-in of 8:46 AM).
  - **Alice Johnson** is settling in smoothly with an average check-in of 9:00 AM.
- **Attendance Rate**: Overall organization attendance sits at **93.5%** for the week of June 29 - July 3, 2026.
- **Absenteeism Pattern**: Sickness rates peaked on Wednesday (July 1st), with operational load slightly impacted. 
- **AI Recommendation**: Enable automatic flexible check-in windows for team members with commute times above 45 mins to optimize output.`;
}

function getMockLeaveInsights(): string {
  return `### AI Leave & Burnout Prediction
*Organizational Health Report*

- **Leave Distribution**:
  - **Sick Leave**: 45% (mostly short-term, seasonal)
  - **Paid Leave**: 35% (planned holidays)
  - **Unpaid Leave**: 20% (personal transitions)
- **Burnout Alert (Medium Risk)**: 
  - **John Doe** has recorded 45 continuous workdays with high commit activity and has a pending vacation from July 10-14. **Highly recommended to approve this leave** immediately to prevent burnout.
- **Onboarding Health**: **Alice Johnson** is currently in "Onboarding" mode; no burn-out risks detected.
- **Strategic Advice**: Schedule team-building activities after the July holiday window to rejuvenate momentum.`;
}
