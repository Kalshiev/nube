// Database types for HR Management System

export type UserRole = 'admin' | 'manager' | 'employee'
export type EmployeeStatus = 'active' | 'inactive' | 'on_leave'
export type LeaveType = 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid'
export type LeaveStatus = 'pending' | 'approved' | 'rejected'

export interface Department {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Employee {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  department_id: string | null
  position: string | null
  phone: string | null
  hire_date: string
  status: EmployeeStatus
  avatar_url: string | null
  created_at: string
  updated_at: string
  // Joined fields
  department?: Department
}

export interface LeaveRequest {
  id: string
  employee_id: string
  leave_type: LeaveType
  start_date: string
  end_date: string
  reason: string | null
  status: LeaveStatus
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
  // Joined fields
  employee?: Employee
  reviewer?: Employee
}

// Dashboard stats
export interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  pendingLeaveRequests: number
  departmentCount: number
}

// Leave balance
export interface LeaveBalance {
  id: string
  employee_id: string
  leave_type: LeaveType
  total_days: number
  used_days: number
  remaining_days: number
  year: number
}

// Notification
export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  read: boolean
  created_at: string
}

// Form types
export interface EmployeeFormData {
  first_name: string
  last_name: string
  email: string
  role: UserRole
  department_id: string | null
  position: string | null
  phone: string | null
  hire_date: string
  status: EmployeeStatus
}

export interface LeaveRequestFormData {
  leave_type: LeaveType
  start_date: string
  end_date: string
  reason: string
}
