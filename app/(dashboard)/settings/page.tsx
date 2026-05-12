import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/settings/profile-form'
import type { Employee, Department } from '@/lib/types'

export const metadata = {
  title: 'Settings',
}

async function getSettingsData() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  const { data: employee } = await supabase
    .from('employees')
    .select('*, department:departments(*)')
    .eq('id', user.id)
    .single()
  
  const { data: departments } = await supabase
    .from('departments')
    .select('*')
    .order('name')
  
  return {
    employee: employee as Employee,
    departments: (departments || []) as Department[],
  }
}

export default async function SettingsPage() {
  const { employee, departments } = await getSettingsData()
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile
        </p>
      </div>
      
      <ProfileForm employee={employee} departments={departments} />
    </div>
  )
}
