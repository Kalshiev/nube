import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays } from 'lucide-react'
import type { LeaveRequest, Employee } from '@/lib/types'

interface RecentActivityProps {
  leaveRequests: (LeaveRequest & { employee: Pick<Employee, 'first_name' | 'last_name'> | null })[]
}

function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'approved':
      return 'default'
    case 'rejected':
      return 'destructive'
    default:
      return 'secondary'
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function RecentActivity({ leaveRequests }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Leave Requests</CardTitle>
        <CardDescription>Latest leave requests from employees</CardDescription>
      </CardHeader>
      <CardContent>
        {leaveRequests.length > 0 ? (
          <div className="space-y-4">
            {leaveRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {request.employee?.first_name} {request.employee?.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {request.leave_type.replace('_', ' ')} leave
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="text-sm font-medium">
                      {formatDate(request.start_date)} - {formatDate(request.end_date)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requested {formatDate(request.created_at)}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(request.status)} className="capitalize">
                    {request.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarDays className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No recent leave requests</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
