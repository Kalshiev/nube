'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Employee } from '@/lib/types'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface SidebarProps {
  employee: Employee | null
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Leave Requests', href: '/leave', icon: Calendar },
  { name: 'Departments', href: '/departments', icon: Building2 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function DashboardSidebar({ employee }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm hidden" />
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          'hidden lg:flex flex-col'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <Users className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              <span className="font-semibold text-sidebar-foreground">NUBE</span>
            </Link>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary mx-auto">
              <Users className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent',
              collapsed && 'absolute -right-3 top-4 bg-sidebar border border-sidebar-border rounded-full'
            )}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        {employee && (
          <div className="p-4 border-t border-sidebar-border">
            <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
              <Avatar className="size-9 shrink-0">
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm font-medium">
                  {employee.first_name?.[0]}{employee.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {employee.first_name} {employee.last_name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70 capitalize truncate">
                    {employee.role}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
