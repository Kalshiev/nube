'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { LeaveType } from '@/lib/types'

interface LeaveBalance {
  leave_type: LeaveType
  total_days: number
  used_days: number
  remaining_days: number
}

interface LeaveBalancesProps {
  balances: LeaveBalance[]
}

function getLeaveTypeColor(leaveType: LeaveType): string {
  switch (leaveType) {
    case 'vacation':
      return 'bg-chart-1'
    case 'sick':
      return 'bg-chart-2'
    case 'personal':
      return 'bg-chart-3'
    case 'maternity':
      return 'bg-chart-4'
    case 'paternity':
      return 'bg-chart-5'
    case 'unpaid':
      return 'bg-muted'
    default:
      return 'bg-muted'
  }
}

function formatLeaveType(type: LeaveType): string {
  return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

export function LeaveBalances({ balances }: LeaveBalancesProps) {
  if (balances.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground">No leave balances configured</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {balances.map((balance) => (
        <Card key={balance.leave_type}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {formatLeaveType(balance.leave_type)}
              </CardTitle>
              <div className={`h-3 w-3 rounded-full ${getLeaveTypeColor(balance.leave_type)}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Used</span>
                <span className="font-medium">{balance.used_days} days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium">{balance.remaining_days} days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium">{balance.total_days} days</span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-muted">
                <div
                  className={`h-2 rounded-full ${getLeaveTypeColor(balance.leave_type)}`}
                  style={{
                    width: `${balance.total_days > 0 ? Math.min(100, (balance.used_days / balance.total_days) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
