'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { buttonVariants } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CalendarDays, MoreHorizontal, Check, X, Trash2 } from 'lucide-react'
import type { LeaveRequest, Employee, LeaveStatus } from '@/lib/types'

interface LeaveRequestsTableProps {
  leaveRequests: LeaveRequest[]
  currentEmployee: Employee
  isManagerOrAdmin: boolean
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

function getLeaveTypeBadgeColor(type: string): string {
  switch (type) {
    case 'vacation':
      return 'bg-chart-1/10 text-chart-1'
    case 'sick':
      return 'bg-chart-5/10 text-chart-5'
    case 'personal':
      return 'bg-chart-2/10 text-chart-2'
    case 'maternity':
    case 'paternity':
      return 'bg-chart-3/10 text-chart-3'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}

export function LeaveRequestsTable({ leaveRequests, currentEmployee, isManagerOrAdmin }: LeaveRequestsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(null)
  const router = useRouter()

  const filteredRequests = leaveRequests.filter((request) => {
    return statusFilter === 'all' || request.status === statusFilter
  })

  const handleStatusChange = async (requestId: string, newStatus: LeaveStatus) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('leave_requests')
      .update({
        status: newStatus,
        reviewed_by: currentEmployee.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (error) {
      toast.error('Failed to update request: ' + error.message)
      return
    }

    router.refresh()
  }

  const handleDelete = async (requestId: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('leave_requests')
      .delete()
      .eq('id', requestId)

    if (error) {
      toast.error('Failed to delete request: ' + error.message)
      return
    }

    router.refresh()
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filteredRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {isManagerOrAdmin && <TableHead>Employee</TableHead>}
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => {
                  const employee = request.employee as Employee | undefined
                  const canModify = 
                    request.status === 'pending' && 
                    (request.employee_id === currentEmployee.id || isManagerOrAdmin)
                  
                  return (
                    <TableRow key={request.id}>
                      {isManagerOrAdmin && (
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9">
                              <AvatarFallback className="text-sm font-medium">
                                {employee?.first_name?.[0]}{employee?.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {employee?.first_name} {employee?.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(employee?.department as { name: string } | undefined)?.name || 'No department'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge className={`capitalize ${getLeaveTypeBadgeColor(request.leave_type)}`}>
                          {request.leave_type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {calculateDays(request.start_date, request.end_date)} day(s)
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{formatDate(request.start_date)}</p>
                          <p className="text-muted-foreground">to {formatDate(request.end_date)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(request.status)} className="capitalize">
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="max-w-[200px] truncate text-sm text-muted-foreground">
                          {request.reason || '-'}
                        </p>
                      </TableCell>
                      <TableCell>
                        {canModify && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {isManagerOrAdmin && request.employee_id !== currentEmployee.id && (
                                <>
                                  <DropdownMenuItem onClick={() => handleStatusChange(request.id, 'approved')}>
                                    <Check className="mr-2 h-4 w-4 text-green-600" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(request.id, 'rejected')}>
                                    <X className="mr-2 h-4 w-4 text-red-600" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              {(request.employee_id === currentEmployee.id || currentEmployee.role === 'admin') && (
                                <DropdownMenuItem
                                  onClick={() => setDeletingRequestId(request.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarDays className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              {statusFilter !== 'all'
                ? 'No leave requests match your filter'
                : 'No leave requests found'}
            </p>
          </div>
        )}
      </CardContent>

      <AlertDialog open={!!deletingRequestId} onOpenChange={(open) => !open && setDeletingRequestId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Leave Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this leave request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: 'destructive' })}
              onClick={() => {
                if (deletingRequestId) handleDelete(deletingRequestId)
                setDeletingRequestId(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
