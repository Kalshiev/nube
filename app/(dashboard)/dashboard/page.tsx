import { createClient } from '@/lib/supabase/server'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { DepartmentChart } from '@/components/dashboard/department-chart'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { LeaveOverview } from '@/components/dashboard/leave-overview'

export const metadata = {
  title: 'Dashboard',
}

async function getDashboardData() {
  const supabase = await createClient()
  
  // Get employee counts
  const { count: totalEmployees } = await supabase
    .from('employees')
    .select('*', { count: 'exact', head: true })
  
  const { count: activeEmployees } = await supabase
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
  
  // Get pending leave requests
  const { count: pendingLeave } = await supabase
    .from('leave_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')
  
  // Get department count
  const { count: departmentCount } = await supabase
    .from('departments')
    .select('*', { count: 'exact', head: true })
  
  // Get employees by department for chart
  const { data: departments } = await supabase
    .from('departments')
    .select('id, name')
  
  const departmentData = await Promise.all(
    (departments || []).map(async (dept) => {
      const { count } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('department_id', dept.id)
      return { name: dept.name, count: count || 0 }
    })
  )
  
  // Get recent leave requests
  const { data: recentLeave } = await supabase
    .from('leave_requests')
    .select('*, employee:employees(first_name, last_name)')
    .order('created_at', { ascending: false })
    .limit(5)
  
  // Get leave by type for overview
  const { data: leaveByType } = await supabase
    .from('leave_requests')
    .select('leave_type, status')
  
  const leaveStats = {
    vacation: 0,
    sick: 0,
    personal: 0,
    maternity: 0,
    paternity: 0,
    unpaid: 0,
  }
  
  leaveByType?.forEach((leave) => {
    if (leave.leave_type === 'vacation') leaveStats.vacation++
    else if (leave.leave_type === 'sick') leaveStats.sick++
    else if (leave.leave_type === 'personal') leaveStats.personal++
    else if (leave.leave_type === 'maternity') leaveStats.maternity++
    else if (leave.leave_type === 'paternity') leaveStats.paternity++
    else leaveStats.unpaid++
  })
  
  return {
    stats: {
      totalEmployees: totalEmployees || 0,
      activeEmployees: activeEmployees || 0,
      pendingLeave: pendingLeave || 0,
      departmentCount: departmentCount || 0,
    },
    departmentData,
    recentLeave: recentLeave || [],
    leaveStats,
  }
}

export default async function DashboardPage() {
  const { stats, departmentData, recentLeave, leaveStats } = await getDashboardData()
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your organization&apos;s HR metrics
        </p>
      </div>
      
      <StatsCards stats={stats} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <DepartmentChart data={departmentData} />
        <LeaveOverview stats={leaveStats} />
      </div>
      
      <RecentActivity leaveRequests={recentLeave} />
    </div>
  )
}
