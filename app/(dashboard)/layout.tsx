import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import type { Employee } from '@/lib/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  // Get employee data
  const { data: employee } = await supabase
    .from('employees')
    .select('*, department:departments(*)')
    .eq('id', user.id)
    .single()
  
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar employee={employee as Employee} />
      <div className="flex-1 flex flex-col lg:pl-64">
        <DashboardHeader employee={employee as Employee} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
