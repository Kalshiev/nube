import { createClient } from '@/lib/supabase/server'
import { LeaveRequestsTable } from '@/components/leave/leave-requests-table'
import { NewLeaveRequestDialog } from '@/components/leave/new-leave-request-dialog'
import type { LeaveRequest, Employee } from '@/lib/types'

export const metadata = {
  title: 'Leave Requests',
}

async function getLeaveData() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get current user's employee data
  const { data: currentEmployee } = await supabase
    .from('employees')
    .select('*')
    .eq('id', user?.id)
    .single()
  
  const isManagerOrAdmin = currentEmployee?.role === 'admin' || currentEmployee?.role === 'manager'
  
  // Get leave requests (managers/admins see all, employees see their own)
  let query = supabase
    .from('leave_requests')
    .select('*, employee:employees(id, first_name, last_name, email, department:departments(name)), reviewer:employees!leave_requests_reviewed_by_fkey(first_name, last_name)')
    .order('created_at', { ascending: false })
  
  if (!isManagerOrAdmin) {
    query = query.eq('employee_id', user?.id)
  }
  
  const { data: leaveRequests } = await query
  
  return {
    leaveRequests: (leaveRequests || []) as LeaveRequest[],
    currentEmployee: currentEmployee as Employee,
    isManagerOrAdmin,
  }
}

export default async function LeavePage() {
  const { leaveRequests, currentEmployee, isManagerOrAdmin } = await getLeaveData()
  
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
      
      <LeaveRequestsTable 
        leaveRequests={leaveRequests} 
        currentEmployee={currentEmployee}
        isManagerOrAdmin={isManagerOrAdmin} 
      />
    </div>
  )
}
