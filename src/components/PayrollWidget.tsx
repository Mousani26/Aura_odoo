import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { 
  CreditCard, FileText, Download, CheckSquare, PlusCircle, 
  User, RefreshCw, Landmark, ShieldAlert, Check 
} from "lucide-react";
import { Payroll, Employee } from "../types.js";

export const PayrollWidget: React.FC = () => {
  const { token, employee, activeRole } = useAuth();
  const [payrollList, setPayrollList] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"slips" | "structures">("slips");

  // Edit Salary Structure Form (Admin Only)
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [base, setBase] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [updating, setUpdating] = useState(false);

  // Print overlay state
  const [printSlip, setPrintSlip] = useState<Payroll | null>(null);

  const fetchPayroll = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const pRes = await fetch("/api/payroll", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (pRes.ok) {
        const pData = await pRes.json();
        setPayrollList(pData);
      }

      if (activeRole === "ADMIN") {
        const eRes = await fetch("/api/employees", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (eRes.ok) {
          const eData = await eRes.json();
          setEmployees(eData);
          if (eData.length > 0) {
            handleSelectEmployee(eData[0].id, eData);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [token, activeRole]);

  const handleSelectEmployee = (empId: string, empList: Employee[] = employees) => {
    setSelectedEmpId(empId);
    const target = empList.find(e => e.id === empId);
    if (target) {
      setBase(target.salaryStructure.base);
      setAllowance(target.salaryStructure.allowance);
      setDeductions(target.salaryStructure.deductions);
    }
  };

  const handleUpdateStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/payroll/structure/${selectedEmpId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ base, allowance, deductions })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Salary structure updated successfully!");
        await fetchPayroll();
      } else {
        alert(data.error || "Update failed");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setUpdating(false);
    }
  };

  const handlePay = async (id: string) => {
    try {
      const res = await fetch(`/api/payroll/${id}/pay`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPayrollList(prev => prev.map(p => p.id === id ? { ...p, status: "Paid", paidAt: new Date().toISOString() } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const mySlips = activeRole === "ADMIN" 
    ? payrollList.filter(p => p.employeeId !== "EMP-001" && p.employeeName !== "Priya Sharma") 
    : payrollList.filter(p => p.employeeId === employee?.id);

  // Dynamic calculations for preview
  const previewNet = Number(base) + Number(allowance) - Number(deductions);

  return (
    <div id="payroll-widget" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[520px]">
      {/* Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">PAYROLL & COMP</h3>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab("slips")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "slips" ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Payslips
          </button>
          {activeRole === "ADMIN" && (
            <button
              onClick={() => setActiveTab("structures")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === "structures" ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Comp Structures
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
        {activeTab === "slips" && (
          <div className="flex-1 flex flex-col justify-between h-full">
            {/* List and Slippdf split */}
            <div className="flex-1 overflow-y-auto max-h-[360px] border border-slate-800/60 rounded-xl divide-y divide-slate-800/60 bg-slate-950/20 pr-1">
              {mySlips.length === 0 ? (
                <div className="text-center py-12">
                  <Landmark className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-xs text-slate-500">No active processed payslips found.</p>
                </div>
              ) : (
                mySlips.map((slip, idx) => (
                  <div key={slip.id} className="p-3.5 flex items-center justify-between hover:bg-slate-900/40 transition-colors">
                    <div className="text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-200">
                        <span>{slip.employeeName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">( {slip.employeeId} )</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-slate-400 text-[11px]">
                        <span>Month: <strong className="text-slate-300">{slip.month}</strong></span>
                        <span>Net Paid: <strong className="text-emerald-400">₹{slip.netSalary}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                        slip.status === "Paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400 animate-pulse"
                      }`}>
                        {slip.status}
                      </span>

                      {/* Slip Operations */}
                      {slip.status === "Paid" ? (
                        <button
                          onClick={() => setPrintSlip(slip)}
                          className="bg-yellow-400 text-slate-950 hover:bg-yellow-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border-none transition-all"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-950" /> View Slip
                        </button>
                      ) : activeRole === "ADMIN" ? (
                        <button
                          onClick={() => handlePay(slip.id)}
                          style={{ backgroundColor: "#ecff00", color: "#000000" }}
                          className="hover:bg-yellow-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Mark Paid
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Processing...</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-2 text-center text-[10px] text-slate-500">
              *All financial data is secure, encrypted, and governed under Corporate Compliance.
            </div>
          </div>
        )}

        {activeTab === "structures" && activeRole === "ADMIN" && (
          <div className="flex-1 flex flex-col justify-between h-full">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Adjust Employee Salary Structure</h4>

            <form onSubmit={handleUpdateStructure} className="space-y-3.5 flex-1 bg-slate-950 p-4 border border-slate-850 rounded-2xl">
              {/* Employee selection */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Employee</label>
                <select
                  value={selectedEmpId}
                  onChange={e => handleSelectEmployee(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.jobTitle})</option>
                  ))}
                </select>
              </div>

              {/* Salary Fields */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Base (₹)</label>
                  <input
                    type="number"
                    value={base}
                    onChange={e => setBase(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Allowance (₹)</label>
                  <input
                    type="number"
                    value={allowance}
                    onChange={e => setAllowance(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deductions (₹)</label>
                  <input
                    type="number"
                    value={deductions}
                    onChange={e => setDeductions(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Real-time Dynamic Math Preview */}
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs text-slate-300">
                <span>Calculated Monthly Net:</span>
                <strong className="text-emerald-400 text-sm">₹{previewNet}</strong>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Apply Structure Change
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Slip PDF Emulator Print Dialog Overlay */}
      {printSlip && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-lg p-6 relative border border-slate-200 shadow-2xl">
            {/* Header branding */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h4 className="font-extrabold text-blue-600 tracking-tight text-lg">HRMS INVOICING</h4>
                <p className="text-[10px] text-slate-400 font-medium">Every workday, perfectly aligned.</p>
              </div>
              <div className="text-right">
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                  PAID IN FULL
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Slip ID: {printSlip.id}</p>
              </div>
            </div>

            {/* Recipient details */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">RECIPIENT STAFF</span>
                <strong className="text-slate-800">{printSlip.employeeName}</strong>
                <p className="text-slate-500">{printSlip.employeeId}</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">PAYMENT WINDOW</span>
                <strong className="text-slate-800">{printSlip.month}</strong>
                {printSlip.paidAt && <p className="text-slate-500">Credited: {printSlip.paidAt.split("T")[0]}</p>}
              </div>
            </div>

            {/* Invoice Table Breakdown */}
            <div className="border border-slate-150 rounded-xl overflow-hidden text-xs mt-2">
              <div className="bg-slate-50 grid grid-cols-3 p-2.5 font-bold text-slate-500 border-b border-slate-150">
                <span>ITEM DESCRIPTION</span>
                <span className="text-center">TYPE</span>
                <span className="text-right">AMOUNT</span>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="grid grid-cols-3 p-2.5">
                  <span className="font-semibold text-slate-700">Base Corporate Salary</span>
                  <span className="text-center text-slate-500">Credit</span>
                  <span className="text-right font-medium text-slate-800">₹{printSlip.baseSalary}</span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="font-semibold text-slate-700">Corporate Allowance & Bonus</span>
                  <span className="text-center text-slate-500">Credit</span>
                  <span className="text-right font-medium text-slate-800">₹{printSlip.allowances}</span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="font-semibold text-slate-700">Health & Tax Deductions</span>
                  <span className="text-center text-rose-500">Debit</span>
                  <span className="text-right font-medium text-rose-600">-₹{printSlip.deductions}</span>
                </div>
              </div>
              <div className="bg-slate-50 grid grid-cols-3 p-3 font-extrabold text-sm border-t border-slate-150 text-slate-800">
                <span>Net Salary</span>
                <span></span>
                <span className="text-right text-emerald-600">₹{printSlip.netSalary}</span>
              </div>
            </div>

            {/* Print trigger action */}
            <div className="flex gap-3 mt-6 border-t border-slate-100 pt-4">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer transition-all"
              >
                Print Invoice PDF
              </button>
              <button
                onClick={() => setPrintSlip(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl cursor-pointer transition-all"
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
