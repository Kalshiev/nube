import { createClient } from '@/lib/supabase/server'
import { EmployeeTable } from '@/components/employees/employee-table'
import { AddEmployeeDialog } from '@/components/employees/add-employee-dialog'
import type { Employee, Department } from '@/lib/types'

export const metadata = {
  title: 'Employees',
}

async function getEmployeesData() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get current user's role
  const { data: currentEmployee } = await supabase
    .from('employees')
    .select('role')
    .eq('id', user?.id)
    .single()
  
  // Get all employees with department info
  const { data: employees } = await supabase
    .from('employees')
    .select('*, department:departments(*)')
    .order('created_at', { ascending: false })
  
  // Get departments for the add form
  const { data: departments } = await supabase
    .from('departments')
    .select('*')
    .order('name')
  
  return {
    employees: (employees || []) as Employee[],
    departments: (departments || []) as Department[],
    isAdmin: currentEmployee?.role === 'admin',
  }
}

export default async function EmployeesPage() {
  const { employees, departments, isAdmin } = await getEmployeesData()
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage your organization&apos;s employee directory
          </p>
        </div>
        {isAdmin && <AddEmployeeDialog departments={departments} />}
      </div>
      
      <EmployeeTable employees={employees} departments={departments} isAdmin={isAdmin} />
    </div>
  )
}
