import { createClient } from '@/lib/supabase/server'
import { LeaveBalances } from '@/components/leave/leave-balances'
import { LeaveRequestsTable } from '@/components/leave/leave-requests-table'
import { NewLeaveRequestDialog } from '@/components/leave/new-leave-request-dialog'
import type { LeaveRequest, Employee, LeaveBalance } from '@/lib/types'

export const metadata = {
  title: 'Leave Requests',
}

const DEFAULT_LEAVE_DAYS: Record<string, number> = {
  vacation: 15,
  sick: 10,
  personal: 5,
  maternity: 90,
  paternity: 14,
  unpaid: 0,
}

async function getLeaveData() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: currentEmployee } = await supabase
    .from('employees')
    .select('*')
    .eq('id', user?.id)
    .single()
  
  const isManagerOrAdmin = currentEmployee?.role === 'admin' || currentEmployee?.role === 'manager'
  
  let query = supabase
    .from('leave_requests')
    .select('*, employee:employees(id, first_name, last_name, email, department:departments(name)), reviewer:employees!leave_requests_reviewed_by_fkey(first_name, last_name)')
    .order('created_at', { ascending: false })
  
  if (!isManagerOrAdmin) {
    query = query.eq('employee_id', user?.id)
  }
  
  const { data: leaveRequests } = await query

  const { data: leaveBalances } = await supabase
    .from('leave_balances')
    .select('*')
    .eq('employee_id', user?.id)
    .eq('year', new Date().getFullYear())

  const usedDaysByType: Record<string, number> = {}
  leaveRequests?.forEach((lr) => {
    if (lr.status === 'approved' || lr.status === 'pending') {
      const start = new Date(lr.start_date)
      const end = new Date(lr.end_date)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      usedDaysByType[lr.leave_type] = (usedDaysByType[lr.leave_type] || 0) + days
    }
  })

  const balances: LeaveBalance[] = (leaveBalances || []).map((lb) => ({
    id: lb.id,
    employee_id: lb.employee_id,
    leave_type: lb.leave_type as LeaveBalance['leave_type'],
    total_days: lb.total_days,
    used_days: lb.used_days,
    remaining_days: lb.remaining_days,
    year: lb.year,
  }))

  if (balances.length === 0) {
    Object.keys(DEFAULT_LEAVE_DAYS).forEach((type) => {
      balances.push({
        id: `calc-${type}`,
        employee_id: user?.id || '',
        leave_type: type as LeaveBalance['leave_type'],
        total_days: DEFAULT_LEAVE_DAYS[type],
        used_days: usedDaysByType[type] || 0,
        remaining_days: Math.max(0, DEFAULT_LEAVE_DAYS[type] - (usedDaysByType[type] || 0)),
        year: new Date().getFullYear(),
      })
    })
  }

  return {
    leaveRequests: (leaveRequests || []) as LeaveRequest[],
    currentEmployee: currentEmployee as Employee,
    isManagerOrAdmin,
    balances,
  }
}

export default async function LeavePage() {
  const { leaveRequests, currentEmployee, isManagerOrAdmin, balances } = await getLeaveData()
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leave Requests</h1>
          <p className="text-muted-foreground">
            {isManagerOrAdmin 
              ? 'Manage and approve leave requests from your team'
              : 'View and submit your leave requests'
            }
          </p>
        </div>
        <NewLeaveRequestDialog employeeId={currentEmployee.id} />
      </div>
      
      <LeaveBalances balances={balances} />
      
      <LeaveRequestsTable 
        leaveRequests={leaveRequests} 
        currentEmployee={currentEmployee}
        isManagerOrAdmin={isManagerOrAdmin} 
      />
    </div>
  )
}
