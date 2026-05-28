import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddDepartmentDialog } from '@/components/departments/add-department-dialog'
import { DepartmentTable } from '@/components/departments/department-table'
import type { Department } from '@/lib/types'

export const metadata = {
  title: 'Departments',
}

async function getDepartmentsData() {
  const supabase = await createClient()
  
  const { data: departments } = await supabase
    .from('departments')
    .select('*')
    .order('name')
  
  const { data: employees } = await supabase
    .from('employees')
    .select('id, department_id')

  const employeeCountByDept: Record<string, number> = {}
  employees?.forEach((emp) => {
    if (emp.department_id) {
      employeeCountByDept[emp.department_id] = (employeeCountByDept[emp.department_id] || 0) + 1
    }
  })

  return (departments || []).map((dept) => ({
    ...dept,
    employeeCount: employeeCountByDept[dept.id] || 0,
  })) as (Department & { employeeCount: number })[]
}

async function isAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: employee } = await supabase
    .from('employees')
    .select('role')
    .eq('id', user.id)
    .single()

  return employee?.role === 'admin'
}

export default async function DepartmentsPage() {
  const [departments, admin] = await Promise.all([
    getDepartmentsData(),
    isAdmin(),
  ])
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">
            View your organization's department structure
          </p>
        </div>
        {admin && <AddDepartmentDialog />}
      </div>
      
      <DepartmentTable departments={departments} isAdmin={admin} />
    </div>
  )
}
