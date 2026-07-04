import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Mail, Phone, MapPin, Briefcase, Sparkles, X, ChevronRight, MessageSquare, ShieldCheck } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  jobTitle: string;
  level: string;
  department: string;
  profilePicture: string;
  phone: string;
  email: string;
  address: string;
  skills: string[];
}

export default function OrgStructure() {
  const [selectedNode, setSelectedNode] = useState<Employee | null>(null);

  const director: Employee = {
    id: "EMP-001",
    name: "Priya Sharma",
    jobTitle: "HR Director",
    level: "DIRECTOR LEVEL",
    department: "Human Resources",
    profilePicture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    phone: "+91 98765 43210",
    email: "admin@hrms.com",
    address: "100, Corporate Boulevard, Connaught Place, New Delhi, India",
    skills: ["Strategic HR", "Leadership", "Talent Acquisition", "Conflict Resolution", "Indian Labor Law"]
  };

  const seniorLeads: Employee[] = [
    {
      id: "EMP-002",
      name: "Aarav Patel",
      jobTitle: "Senior Software Engineer",
      level: "SENIOR LEAD",
      department: "Engineering",
      profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      phone: "+91 91234 56789",
      address: "123, Tech Park Lane, Whitefield, Bengaluru, Karnataka, India",
      email: "aarav.patel@hrms.com",
      skills: ["React", "TypeScript", "Node.js", "System Design", "MongoDB"]
    },
    {
      id: "EMP-003",
      name: "Diya Iyer",
      jobTitle: "Lead UX/UI Designer",
      level: "SENIOR LEAD",
      department: "Product Design",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      phone: "+91 88776 65544",
      address: "456, Creative Road, Bandra West, Mumbai, Maharashtra, India",
      email: "diya.iyer@hrms.com",
      skills: ["Figma", "User Research", "Wireframing", "Interaction Design", "Prototyping"]
    }
  ];

  const teamMembers: Employee[] = [
    {
      id: "EMP-004",
      name: "Amit Verma",
      jobTitle: "QA Engineer",
      level: "TEAM MEMBER",
      department: "Quality Assurance",
      profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      phone: "+91 77665 54433",
      address: "789, Quality Circle, Hitec City, Hyderabad, Telangana, India",
      email: "amit.verma@hrms.com",
      skills: ["Jest", "Playwright", "Selenium", "Manual Testing", "CI/CD"]
    },
    {
      id: "EMP-005",
      name: "Manoj Kumar",
      jobTitle: "Software Engineer",
      level: "TEAM MEMBER",
      department: "Engineering",
      profilePicture: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      phone: "+91 99887 76655",
      address: "Flat 402, Skyline Apartments, Gachibowli, Hyderabad, Telangana, India",
      email: "itsmkunofcl@gmail.com",
      skills: ["React", "Express", "TailwindCSS", "PostgreSQL", "Docker"]
    },
    {
      id: "EMP-006",
      name: "Jay Shankar",
      jobTitle: "Software Engineer",
      level: "TEAM MEMBER",
      department: "Engineering",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      phone: "+91 98989 87878",
      address: "Sector 62, Noida, Uttar Pradesh, India",
      email: "jay.shankar@hrms.com",
      skills: ["Vue.js", "Python", "Flask", "SQL", "Git"]
    },
    {
      id: "EMP-007",
      name: "Krish Sharma",
      jobTitle: "UX Designer",
      level: "TEAM MEMBER",
      department: "Product Design",
      profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      phone: "+91 95454 51212",
      address: "Salt Lake, Sector V, Kolkata, West Bengal, India",
      email: "krish.sharma@hrms.com",
      skills: ["Figma", "Design Systems", "Typography", "Illustrator"]
    }
  ];

  return (
    <div id="org-structure" className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-8 relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Interactive Org Structure
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Explore reporting structures, click on any team member to view their corporate card, skills overview, and active workplace metrics.
          </p>
        </div>
        <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Interactive Live Mode
        </div>
      </div>

      {/* Organizational chart rendering with lines exactly as requested */}
      <div className="flex flex-col items-center justify-center p-2 md:p-8 overflow-x-auto min-w-[700px]">
        
        {/* Director Node */}
        <div className="flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedNode(director)}
            className="bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-lg cursor-pointer flex items-center gap-4 max-w-sm transition-all relative z-10 hover:border-amber-400"
          >
            <img src={director.profilePicture} alt={director.name} className="w-12 h-12 rounded-full object-cover border-2 border-amber-500" />
            <div className="text-left">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{director.name}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-300 font-semibold">{director.jobTitle}</p>
              <span className="inline-block mt-1.5 text-[9px] font-extrabold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                {director.level}
              </span>
            </div>
          </motion.div>

          {/* Connection vertical line below Director */}
          <div className="w-0.5 h-8 bg-slate-200 dark:bg-slate-800"></div>
        </div>

        {/* Level 2 Nodes (Senior Leads) */}
        <div className="relative w-full flex flex-col items-center">
          {/* Horizontal Connector Line for Senior Leads */}
          <div className="absolute top-0 left-[25%] right-[25%] h-0.5 bg-slate-200 dark:bg-slate-800"></div>

          <div className="grid grid-cols-2 gap-x-24 w-full max-w-4xl relative">
            {seniorLeads.map((lead, idx) => (
              <div key={lead.id} className="flex flex-col items-center relative">
                {/* Short vertical connection line to the horizontal bar */}
                <div className="w-0.5 h-4 bg-slate-200 dark:bg-slate-800"></div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedNode(lead)}
                  className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-4 rounded-3xl shadow-md cursor-pointer flex items-center gap-4 w-full transition-all relative z-10 hover:border-blue-500"
                >
                  <img src={lead.profilePicture} alt={lead.name} className="w-11 h-11 rounded-full object-cover border border-blue-500/50" />
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{lead.name}</h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-300 font-semibold">{lead.jobTitle}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md">
                      {lead.level}
                    </span>
                  </div>
                </motion.div>

                {/* Connection line going down from senior leads */}
                <div className="w-0.5 h-8 bg-slate-200 dark:bg-slate-800"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Level 3 Nodes (Team Members) */}
        <div className="relative w-full flex flex-col items-center">
          {/* Horizontal Connector Line for Team Members */}
          <div className="absolute top-0 left-[12.5%] right-[12.5%] h-0.5 bg-slate-200 dark:bg-slate-800"></div>

          <div className="grid grid-cols-4 gap-4 w-full relative">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex flex-col items-center relative">
                {/* Short vertical connection line to the horizontal bar */}
                <div className="w-0.5 h-4 bg-slate-200 dark:bg-slate-800"></div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedNode(member)}
                  className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-3 rounded-2xl shadow-sm cursor-pointer flex flex-col items-center text-center w-full transition-all relative z-10 hover:border-indigo-500"
                >
                  <img src={member.profilePicture} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800" />
                  <h5 className="font-bold text-slate-900 dark:text-slate-100 text-[12px] mt-2 block truncate w-full">{member.name}</h5>
                  <p className="text-[10px] text-slate-400 dark:text-slate-300 block truncate w-full font-medium">{member.jobTitle}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Dialog/Drawer Overlay */}
      <AnimatePresence>
        {selectedNode && (
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
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 relative overflow-hidden shadow-2xl"
            >
              {/* Decorative graphic background */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl"></div>

              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
                <img src={selectedNode.profilePicture} alt={selectedNode.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-md" />
                <div className="text-left">
                  <span className="text-[9px] uppercase font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                    {selectedNode.level}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 mt-1">{selectedNode.name}</h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5 font-medium">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {selectedNode.jobTitle} • {selectedNode.department}
                  </p>
                </div>
              </div>

              <div className="py-5 space-y-4 text-xs">
                {/* Contact Info */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-300 text-[10px] uppercase tracking-wider">Corporate Contact & Logistics</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{selectedNode.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{selectedNode.phone}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 text-slate-400 pt-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{selectedNode.address}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-slate-300 text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Domain Competencies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-slate-950 text-slate-300 border border-slate-800 text-[11px] px-2.5 py-1 rounded-lg font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* HR Audit Status */}
                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  <span>Reporting to: Priya Sharma</span>
                  <span className="text-emerald-500">Security Cleared</span>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl text-xs cursor-pointer transition-all"
                >
                  OK, Close Card
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
