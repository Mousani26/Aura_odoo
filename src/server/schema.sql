-- PostgreSQL DDL Script for Aura System

-- Create Enums if they don't exist
CREATE TYPE user_role AS ENUM ('ADMIN', 'EMPLOYEE');
CREATE TYPE attendance_status AS ENUM ('Present', 'Absent', 'Half-day', 'On-Leave');
CREATE TYPE leave_status AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE TYPE payroll_status AS ENUM ('Pending', 'Paid');

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(30),
    address TEXT,
    job_title VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    join_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    profile_picture TEXT,
    salary_base DOUBLE PRECISION DEFAULT 4000.0,
    salary_allowance DOUBLE PRECISION DEFAULT 400.0,
    salary_deduction DOUBLE PRECISION DEFAULT 250.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'EMPLOYEE',
    employee_id VARCHAR(50) UNIQUE REFERENCES employees(id) ON DELETE CASCADE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in VARCHAR(10),
    check_out VARCHAR(10),
    status attendance_status DEFAULT 'Present',
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (employee_id, date)
);

-- Leave Requests Table
CREATE TABLE IF NOT EXISTS leave_requests (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status leave_status DEFAULT 'Pending',
    approved_by VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payroll Table
CREATE TABLE IF NOT EXISTS payroll (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    base DOUBLE PRECISION NOT NULL,
    allowance DOUBLE PRECISION NOT NULL,
    deductions DOUBLE PRECISION NOT NULL,
    net_amount DOUBLE PRECISION NOT NULL,
    status payroll_status DEFAULT 'Pending',
    transaction_id VARCHAR(100),
    pay_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (employee_id, month, year)
);

-- HR Activities Log Table
CREATE TABLE IF NOT EXISTS hr_activities (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    employee_name VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- HR Notifications Table
CREATE TABLE IF NOT EXISTS hr_notifications (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
