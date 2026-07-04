import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Employee, HRNotification } from "../types.js";

interface AuthContextType {
  token: string | null;
  user: User | null;
  employee: Employee | null;
  notifications: HRNotification[];
  isLoading: boolean;
  error: string | null;
  activeRole: "ADMIN" | "EMPLOYEE" | null; // For emulating switch-roles as Admin
  signUp: (data: any) => Promise<any>;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  signIn: (data: any) => Promise<boolean>;
  signOut: () => void;
  updateProfile: (id: string, data: any) => Promise<boolean>;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  toggleRole: () => void; // Admin switch-view feature!
  refreshEmployee: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("hrms_token"));
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [notifications, setNotifications] = useState<HRNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<"ADMIN" | "EMPLOYEE" | null>(null);

  useEffect(() => {
    if (token) {
      // Fetch self profile using token
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Decode user details from token (fallback parsing if server request hasn't fetched yet)
      const base64Url = token!.split(".")[1] || "";
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const parsed = JSON.parse(jsonPayload);
      
      const res = await fetch(`/api/employees/${parsed.employeeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const empData = await res.json();
        setEmployee(empData);
        
        // Fetch user from decoded details
        setUser({
          id: parsed.userId,
          email: empData.email,
          role: parsed.role,
          employeeId: empData.id,
          isEmailVerified: true,
          createdAt: ""
        });
        
        setActiveRole(parsed.role);
        fetchNotifications();
      } else {
        signOut();
      }
    } catch (err) {
      console.error("Error fetching self profile:", err);
      signOut();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshEmployee = async () => {
    if (!token || !employee) return;
    try {
      const res = await fetch(`/api/employees/${employee.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const empData = await res.json();
        setEmployee(empData);
      }
    } catch (err) {
      console.error("Error refreshing employee:", err);
    }
  };

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAsRead = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const signUp = async (data: any) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Sign-up failed");
      }
      return resData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }
      localStorage.setItem("hrms_token", data.token);
      setToken(data.token);
      setUser(data.user);
      setEmployee(data.employee);
      setActiveRole(data.user.role);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const signIn = async (data: any) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (!res.ok) {
        if (resData.isUnverified) {
          throw new Error(`UNVERIFIED:${resData.verificationCode}`);
        }
        throw new Error(resData.error || "Invalid sign-in credentials");
      }
      localStorage.setItem("hrms_token", resData.token);
      setToken(resData.token);
      setUser(resData.user);
      setEmployee(resData.employee);
      setActiveRole(resData.user.role);
      return true;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = () => {
    localStorage.removeItem("hrms_token");
    setToken(null);
    setUser(null);
    setEmployee(null);
    setNotifications([]);
    setActiveRole(null);
  };

  const updateProfile = async (id: string, updatedFields: any) => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedFields)
      });
      const resData = await res.json();
      if (res.ok) {
        if (employee && employee.id === id) {
          setEmployee(resData.employee);
        }
        return true;
      } else {
        throw new Error(resData.error || "Failed to update profile");
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const toggleRole = () => {
    if (user && user.role === "ADMIN") {
      setActiveRole(prev => prev === "ADMIN" ? "EMPLOYEE" : "ADMIN");
    }
  };

  const finalEmployee = (activeRole === "EMPLOYEE" && employee?.name === "Priya Sharma")
    ? {
        id: "EMP-002",
        userId: "u-002",
        name: "Aarav Patel",
        email: "aarav.patel@hrms.com",
        phone: "+91 91234 56789",
        address: "123, Tech Park Lane, Whitefield, Bengaluru, Karnataka, India",
        jobTitle: "Senior Software Engineer",
        department: "Engineering",
        joinDate: "2026-02-01",
        status: "Active",
        profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        salaryStructure: { base: 95000, allowance: 8000, deductions: 5000 },
        documents: [
          { id: "doc-201", name: "Offer_Letter_Aarav_Patel.pdf", url: "#", uploadedAt: "2026-02-01T09:00:00Z" },
          { id: "doc-202", name: "NDA_Signed.pdf", url: "#", uploadedAt: "2026-02-01T14:30:00Z" }
        ],
        achievements: [
          { id: "ach-2", badgeName: "Perfect Attendance", description: "Zero absences for three consecutive months", icon: "CalendarCheck", awardedAt: "2026-05-01" },
          { id: "ach-3", badgeName: "Problem Solver", description: "Quick resolution of critical system bugs", icon: "Cpu", awardedAt: "2026-06-20" }
        ]
      }
    : employee;

  return (
    <AuthContext.Provider value={{
      token,
      user,
      employee: finalEmployee,
      notifications,
      isLoading,
      error,
      activeRole,
      signUp,
      verifyEmail,
      signIn,
      signOut,
      updateProfile,
      fetchNotifications,
      markAsRead,
      toggleRole,
      refreshEmployee
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
