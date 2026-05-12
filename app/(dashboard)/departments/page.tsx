import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Users } from 'lucide-react'
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
  
  // Get employee counts per department
  const departmentData = await Promise.all(
    (departments || []).map(async (dept) => {
      const { count } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('department_id', dept.id)
      return { ...dept, employeeCount: count || 0 }
    })
  )
  
  return departmentData as (Department & { employeeCount: number })[]
}

export default async function DepartmentsPage() {
  const departments = await getDepartmentsData()
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
        <p className="text-muted-foreground">
          View your organization&apos;s department structure
        </p>
      </div>
      
      {departments.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <Card key={dept.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {dept.employeeCount}
                  </Badge>
                </div>
                <CardTitle className="mt-3">{dept.name}</CardTitle>
                <CardDescription>
                  {dept.description || 'No description available'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Created {new Date(dept.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No departments found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
