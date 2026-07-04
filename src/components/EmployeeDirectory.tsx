import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { 
  Users, Search, Filter, Mail, Phone, MapPin, 
  Briefcase, Landmark, ShieldCheck, FileText, Upload, 
  Award, Edit2, CheckCircle2, UserCheck, AlertCircle 
} from "lucide-react";
import { Employee } from "../types.js";

export const EmployeeDirectory: React.FC = () => {
  const { token, employee: selfEmployee, activeRole, updateProfile } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Search & Filters
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  // Edit Forms State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editJobTitle, setEditJobTitle] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editPic, setEditPic] = useState("");
  const [editStatus, setEditStatus] = useState<"Active" | "Onboarding" | "Terminated">("Active");

  // Document Upload State
  const [docName, setDocName] = useState("");
  const [docUrl, setDocUrl] = useState("");

  const fetchEmployees = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/employees", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
        if (data.length > 0) {
          // Select either self or the first employee by default
          const defaultEmp = data.find((e: Employee) => e.id === selfEmployee?.id) || data[0];
          setSelectedEmp(defaultEmp);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [token, activeRole, selfEmployee]);

  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmp(emp);
    setIsEditing(false);
    setEditName(emp.name);
    setEditPhone(emp.phone);
    setEditAddress(emp.address);
    setEditJobTitle(emp.jobTitle);
    setEditDepartment(emp.department);
    setEditPic(emp.profilePicture);
    setEditStatus(emp.status);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    const payload = activeRole === "ADMIN" 
      ? {
          name: editName,
          phone: editPhone,
          address: editAddress,
          jobTitle: editJobTitle,
          department: editDepartment,
          profilePicture: editPic,
          status: editStatus
        }
      : {
          phone: editPhone,
          address: editAddress,
          profilePicture: editPic
        };

    const success = await updateProfile(selectedEmp.id, payload);
    if (success) {
      alert("Employee profile updated successfully!");
      setIsEditing(false);
      await fetchEmployees();
    } else {
      alert("Failed to update profile.");
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp || !docName || !docUrl) return;

    try {
      const res = await fetch(`/api/employees/${selectedEmp.id}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: docName, url: docUrl })
      });
      if (res.ok) {
        setDocName("");
        setDocUrl("");
        alert("Document linked successfully!");
        await fetchEmployees();
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Switch Emulation Callback (emulate switching active user profile for review)
  const handleSwitchEmulation = (emp: Employee) => {
    // For demo flow we can just swap the highlighted selected detail, but wait:
    // User role-switching triggers via global toggleRole. We can set the active selected employee 
    // to render in detail so that HR is emulating and viewing their personal files cleanly.
    handleSelectEmployee(emp);
  };

  const departments = ["All", ...Array.from(new Set(employees.map(e => e.department)))];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || 
                          emp.jobTitle.toLowerCase().includes(search.toLowerCase()) || 
                          emp.id.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "All" || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div id="employee-directory" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[520px]">
      {/* Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">ORGANIZATIONAL DIRECTORY</h3>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden h-full">
        {/* Left Side: List (Col-span 5) */}
        <div className="md:col-span-5 p-4 border-r border-slate-800/80 bg-slate-950/20 flex flex-col justify-between overflow-y-auto">
          {/* Controls */}
          <div className="space-y-2 mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search staff..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              />
            </div>
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>
              ))}
            </select>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50 pr-1">
            {filteredEmployees.map(emp => (
              <div
                key={emp.id}
                onClick={() => handleSwitchEmulation(emp)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer rounded-xl transition-all mb-1 ${
                  selectedEmp?.id === emp.id ? "bg-blue-600/10 border border-blue-500/30 shadow-md" : "hover:bg-slate-900/30 border border-transparent"
                }`}
              >
                <img
                  src={emp.profilePicture}
                  alt={emp.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-700"
                />
                <div className="text-xs min-w-0 flex-1">
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span className="truncate">{emp.name}</span>
                    <span className="text-[9px] text-slate-500 font-mono shrink-0">{emp.id}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] truncate mt-0.5">{emp.jobTitle}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">{emp.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Detail Panel (Col-span 7) */}
        <div className="md:col-span-7 p-4 flex flex-col justify-between overflow-y-auto bg-slate-900">
          {selectedEmp ? (
            <div className="space-y-4">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-500 mb-1">
                Profile Card
              </div>
              {/* Profile Card Header */}
              <div className="flex gap-4 items-start pb-4 border-b border-slate-800">
                <img
                  src={selectedEmp.profilePicture}
                  alt={selectedEmp.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-800"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100">{selectedEmp.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                      selectedEmp.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {selectedEmp.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-blue-500" /> {selectedEmp.jobTitle}</p>
                  <p className="text-xs text-slate-500">{selectedEmp.department}</p>
                </div>
              </div>

              {/* Edit vs Info forms */}
              {!isEditing ? (
                <div className="space-y-3.5 text-xs">
                  {/* Contact Grid */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="bg-slate-950/40 p-2.5 border border-slate-800/80 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Contact</span>
                      <p className="text-slate-200 truncate flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedEmp.email}</p>
                    </div>
                    <div className="bg-slate-950/40 p-2.5 border border-slate-800/80 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Contact</span>
                      <p className="text-slate-200 truncate flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedEmp.phone || "Not set"}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-slate-950/40 p-2.5 border border-slate-800/80 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Address</span>
                    <p className="text-slate-200 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedEmp.address || "Not set"}</p>
                  </div>

                  {/* Compensation Summary */}
                  <div className="bg-slate-950/40 p-2.5 border border-slate-800/80 rounded-xl flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Comp Structure</span>
                      <p className="text-slate-300">Base salary with associated company health allowances.</p>
                    </div>
                    <div className="text-right font-mono font-bold text-emerald-400 text-sm">
                      ₹{selectedEmp.salaryStructure.base + selectedEmp.salaryStructure.allowance - selectedEmp.salaryStructure.deductions}/mo
                    </div>
                  </div>

                  {/* Badges / Achievements */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Milestone Badges ({selectedEmp.achievements.length})</span>
                    {selectedEmp.achievements.length === 0 ? (
                      <p className="text-slate-500 italic text-[11px]">No milestones or badges earned yet.</p>
                    ) : (
                      <div className="flex gap-2 flex-wrap">
                        {selectedEmp.achievements.map(ach => (
                          <span key={ach.id} className="bg-blue-600/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded-xl text-[10px] flex items-center gap-1 font-semibold">
                            <Award className="w-3.5 h-3.5 text-amber-400 animate-bounce" /> {ach.badgeName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Documents & PDF storage */}
                  <div className="space-y-2 border-t border-slate-800/80 pt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Documents & Attachments</span>
                    {selectedEmp.documents.length === 0 ? (
                      <p className="text-slate-500 italic text-[11px]">No folders or documents archived.</p>
                    ) : (
                      <div className="space-y-1">
                        {selectedEmp.documents.map(doc => (
                          <div key={doc.id} className="bg-slate-950/40 border border-slate-850/60 p-2 rounded-lg flex justify-between items-center text-[11px] text-slate-300">
                            <span className="flex items-center gap-1.5 truncate"><FileText className="w-3.5 h-3.5 text-red-500" /> {doc.name}</span>
                            <span className="text-[9px] text-slate-500 shrink-0">{doc.uploadedAt.split("T")[0]}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Link Document Input */}
                    <form onSubmit={handleUploadDocument} className="flex gap-2 mt-2 pt-2 border-t border-dashed border-slate-800">
                      <input
                        type="text"
                        placeholder="File name (e.g. Agreement.pdf)..."
                        value={docName}
                        onChange={e => setDocName(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-[11px] text-slate-200"
                      />
                      <input
                        type="text"
                        placeholder="URL (mock)..."
                        value={docUrl}
                        onChange={e => setDocUrl(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-[11px] text-slate-200"
                      />
                      <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg p-1 px-2 text-[11px] flex items-center gap-1 cursor-pointer">
                        <Upload className="w-3.5 h-3.5" /> Attach
                      </button>
                    </form>
                  </div>

                  {/* Edit action triggers */}
                  {(activeRole === "ADMIN" || selfEmployee?.id === selectedEmp.id) && (
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{ backgroundColor: "#facc15", color: "#0f172a" }}
                      className="w-full hover:bg-yellow-300 font-extrabold border border-yellow-500/60 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-950" /> Modify Profile Details
                    </button>
                  )}
                </div>
              ) : (
                // Edit details form
                <form onSubmit={handleUpdate} className="space-y-3 text-xs bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Update Profile Form</h4>

                  {/* Edit Name / Job title / Department (Admin Only) */}
                  {activeRole === "ADMIN" ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Full Name</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Profile Picture URL</label>
                          <input
                            type="text"
                            value={editPic}
                            onChange={e => setEditPic(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 font-mono text-[10px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Job Title</label>
                          <input
                            type="text"
                            value={editJobTitle}
                            onChange={e => setEditJobTitle(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Department</label>
                          <input
                            type="text"
                            value={editDepartment}
                            onChange={e => setEditDepartment(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Onboarding Status</label>
                        <select
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200"
                        >
                          <option value="Active">Active</option>
                          <option value="Onboarding">Onboarding</option>
                          <option value="Terminated">Terminated</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <div className="bg-slate-900/60 p-2 border border-slate-800 rounded-lg flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] text-slate-400 leading-normal">
                        Self-edit restriction active. Job parameters are locked by corporate compliance.
                      </span>
                    </div>
                  )}

                  {/* Fields editable by both Employee and Admin */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Phone Contact</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={e => setEditPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Home Address</label>
                      <input
                        type="text"
                        value={editAddress}
                        onChange={e => setEditAddress(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-xs text-slate-500">Loading organizational directory snapshots...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
