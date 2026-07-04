import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, RefreshCw, Sparkles, CheckCircle2, ChevronDown, DollarSign } from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";

export default function PaycheckSimulator() {
  const { employee, activeRole } = useAuth();
  const [overtime, setOvertime] = useState<number>(0);
  const [pension, setPension] = useState<number>(6); // 6% pension
  const [taxBracket, setTaxBracket] = useState<number>(20); // 20% mid
  const [healthGrade, setHealthGrade] = useState<number>(1200); // ₹1,200 standard
  const [notification, setNotification] = useState<string | null>(null);

  const isEmployeeMode = activeRole === "EMPLOYEE";

  // Constants
  const baseSalary = isEmployeeMode && employee?.salaryStructure ? employee.salaryStructure.base : 120000;
  const allowances = isEmployeeMode && employee?.salaryStructure ? employee.salaryStructure.allowance : 15000;
  const overtimeRate = isEmployeeMode ? 650 : 850; 
  const stdDeductions = isEmployeeMode && employee?.salaryStructure ? employee.salaryStructure.deductions : 8000;

  const empName = isEmployeeMode && employee ? employee.name : "Priya Sharma";
  const empDept = isEmployeeMode && employee ? employee.department : "Human Resources";
  const empId = isEmployeeMode && employee ? employee.id : "EMP-001";
  const empTitle = isEmployeeMode && employee ? employee.jobTitle : "HR Director";

  // Dynamic calculations
  const grossOvertime = overtime * overtimeRate;
  const totalEarnings = baseSalary + allowances + grossOvertime;

  // Deductions
  const taxAmount = Math.round(totalEarnings * (taxBracket / 100));
  const pensionAmount = Math.round(totalEarnings * (pension / 100));
  const healthPremium = healthGrade;
  
  // Net Take-Home Pay
  const takeHomePay = Math.max(0, totalEarnings - taxAmount - pensionAmount - healthPremium - stdDeductions);

  // Doughnut Chart Geometry
  const totalDeductionsAndPay = takeHomePay + taxAmount + pensionAmount + healthPremium + stdDeductions;
  
  // Percentages for rings
  const takeHomePct = takeHomePay / totalDeductionsAndPay;
  const taxPct = taxAmount / totalDeductionsAndPay;
  const pensionPct = pensionAmount / totalDeductionsAndPay;
  const healthPct = healthPremium / totalDeductionsAndPay;
  const stdPct = stdDeductions / totalDeductionsAndPay;

  // SVG ring properties
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // 314.159

  // Stroke offsets
  const stroke1 = circumference * takeHomePct;
  const stroke2 = circumference * taxPct;
  const stroke3 = circumference * pensionPct;
  const stroke4 = circumference * healthPct;
  const stroke5 = circumference * stdPct;

  const showToast = () => {
    setNotification("Benefits & Tax Simulation configuration saved to corporate ledger.");
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div id="paycheck-simulator" className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-emerald-950/90 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-mono"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Interactive Paycheck Simulator
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Toggle taxes, EPF pension deductions, healthcare packages, and overtime to simulate your net income take-home pay!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Interactive Controls */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Overtime Hours slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1">🕒 Overtime hours</span>
              <span className="text-indigo-400 font-mono">{overtime} hrs / month</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={overtime}
              onChange={e => setOvertime(parseInt(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 hours</span>
              <span>Rate: ₹450.00/hr</span>
              <span>40 hours</span>
            </div>
          </div>

          {/* 401k/EPF contribution slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1">⎔ EPF Pension Contribution</span>
              <span className="text-amber-400 font-mono">{pension}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              value={pension}
              onChange={e => setPension(parseInt(e.target.value))}
              className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (None)</span>
              <span className="text-emerald-500 font-semibold">Matched up to 4%</span>
              <span>15% (Max)</span>
            </div>
          </div>

          {/* Standard Tax Bracket tabs */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Standard Tax Bracket File</label>
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setTaxBracket(12)}
                className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  taxBracket === 12 ? "bg-slate-800 text-slate-100" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                12% Low
              </button>
              <button
                onClick={() => setTaxBracket(20)}
                className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  taxBracket === 20 ? "bg-[#bee200] text-slate-900" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                20% Mid
              </button>
              <button
                onClick={() => setTaxBracket(28)}
                className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  taxBracket === 28 ? "bg-slate-800 text-slate-100" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                28% High
              </button>
            </div>
          </div>

          {/* Healthcare package grade */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Healthcare Package Grade</label>
            <div className="relative">
              <select
                value={healthGrade}
                onChange={e => setHealthGrade(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 cursor-pointer focus:outline-none focus:border-indigo-500 appearance-none pr-8"
              >
                <option value={1200}>Standard (₹1,200/mo)</option>
                <option value={2500}>Premium Tier (₹2,500/mo)</option>
                <option value={4800}>Family Comprehensive (₹4,800/mo)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={showToast}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer transition-all shadow-md shadow-indigo-600/10"
          >
            Save Benefits & Tax Settings
          </button>

        </div>

        {/* Right Side: Doughnut Visualization & Salary Statement Receipt */}
        <div className="lg:col-span-7 bg-slate-950/30 border border-slate-800 p-5 rounded-3xl space-y-6">
          
          {/* Circular Doughnut Segment */}
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 bg-[#ffffff] p-4 rounded-2xl border border-slate-200 dark:border-slate-850">
            
            {/* Doughnut SVG */}
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* 1. Take-Home Pay ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="stroke-indigo-600"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={`${stroke1} ${circumference}`}
                  strokeDashoffset="0"
                />
                {/* 2. Taxes Withheld ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="stroke-rose-500"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={`${stroke2} ${circumference}`}
                  strokeDashoffset={-stroke1}
                />
                {/* 3. Pension (401k/EPF) */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="stroke-amber-400"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={`${stroke3} ${circumference}`}
                  strokeDashoffset={-(stroke1 + stroke2)}
                />
                {/* 4. Health Premium */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="stroke-cyan-400"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={`${stroke4} ${circumference}`}
                  strokeDashoffset={-(stroke1 + stroke2 + stroke3)}
                />
                {/* 5. Std Deductions */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="stroke-slate-400"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={`${stroke5} ${circumference}`}
                  strokeDashoffset={-(stroke1 + stroke2 + stroke3 + stroke4)}
                />
              </svg>
              {/* Doughnut Center text labels */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Take-Home</span>
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">₹{takeHomePay.toLocaleString()}</span>
              </div>
            </div>

            {/* Legend & Breakdown Amounts */}
            <div className="text-xs space-y-1.5 w-full sm:w-auto text-left">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 block"></span>
                  <span className="text-slate-500 font-medium">Take-Home Pay</span>
                </div>
                <strong className="text-[#bea9a9] font-mono">₹{takeHomePay.toLocaleString()}</strong>
              </div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block"></span>
                  <span className="text-slate-500 font-medium">Taxes Withheld ({taxBracket}%)</span>
                </div>
                <strong className="text-rose-500 font-mono">₹{taxAmount.toLocaleString()}</strong>
              </div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block"></span>
                  <span className="text-slate-500 font-medium">Pension (EPF) ({pension}%)</span>
                </div>
                <strong className="text-amber-500 font-mono">₹{pensionAmount.toLocaleString()}</strong>
              </div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 block"></span>
                  <span className="text-slate-500 font-medium">Health Premium</span>
                </div>
                <strong className="text-cyan-400 font-mono">₹{healthPremium.toLocaleString()}</strong>
              </div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 block"></span>
                  <span className="text-slate-500 font-medium">Std Deductions</span>
                </div>
                <strong className="text-slate-400 font-mono">₹{stdDeductions.toLocaleString()}</strong>
              </div>
            </div>

          </div>

          {/* Payslip Invoice Statement Exactly as Requested in Image 4 */}
          <div className="bg-white border border-slate-200 text-slate-800 p-5 rounded-2xl font-mono text-xs shadow-md space-y-4 text-left">
            <div className="flex justify-between items-start border-b border-dashed border-slate-300 pb-3">
              <div>
                <h3 className="font-extrabold text-sm tracking-tight text-slate-900">SALARY STATEMENT STATEMENT</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Enterprise Operations Division</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Statement Period</span>
                <strong className="text-slate-900">July 2026 Payslip</strong>
              </div>
            </div>

            {/* Meta tags */}
            <div className="grid grid-cols-2 gap-y-1.5 text-[11px] pb-3 border-b border-dashed border-slate-300">
              <div>
                <span className="text-slate-500 block">Employee:</span>
                <strong className="text-slate-800">{empName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Department:</span>
                <strong className="text-slate-800 font-bold">{empDept}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">ID Ref:</span>
                <strong className="text-slate-800 font-bold">{empId}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Job Title:</span>
                <strong className="text-slate-800">{empTitle}</strong>
              </div>
            </div>

            {/* Breakdown table */}
            <div className="space-y-1 text-[11px] font-semibold text-slate-800">
              <div className="flex justify-between border-b border-slate-200 pb-1 text-[9px] uppercase text-slate-400 font-bold">
                <span>Description Item</span>
                <span>Amount (₹)</span>
              </div>
              
              <div className="flex justify-between pt-1">
                <span>Basic Base Salary Rate</span>
                <span>{baseSalary.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Welfare / Travel Allowance</span>
                <span>{allowances.toFixed(2)}</span>
              </div>
              {overtime > 0 && (
                <div className="flex justify-between text-indigo-600 font-bold">
                  <span>Overtime Approved Pay ({overtime} hrs)</span>
                  <span>+{grossOvertime.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-rose-600">
                <span>Taxation Withheld ({taxBracket}%)</span>
                <span>-{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>EPF Contribution ({pension}%)</span>
                <span>-{pensionAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Health Insurance Premium</span>
                <span>-{healthPremium.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Social Security Deductions</span>
                <span>-{stdDeductions.toFixed(2)}</span>
              </div>
            </div>

            {/* Total Footer Net */}
            <div className="bg-slate-50 flex justify-between p-3 rounded-xl border border-slate-150 font-extrabold text-xs text-slate-900">
              <span className="uppercase tracking-wide text-slate-600">Dynamic Take-Home Pay:</span>
              <strong className="text-emerald-600 text-sm">₹{takeHomePay.toLocaleString()}.00</strong>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
