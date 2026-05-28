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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Search, MoreHorizontal, Mail, Phone, Pencil, Trash2, Users } from 'lucide-react'
import { EditEmployeeDialog } from './edit-employee-dialog'
import type { Employee, Department } from '@/lib/types'

interface EmployeeTableProps {
  employees: Employee[]
  departments: Department[]
  isAdmin: boolean
}

function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active':
      return 'default'
    case 'on_leave':
      return 'secondary'
    case 'inactive':
      return 'destructive'
    default:
      return 'outline'
  }
}

function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
  switch (role) {
    case 'admin':
      return 'default'
    case 'manager':
      return 'secondary'
    default:
      return 'outline'
  }
}

export function EmployeeTable({ employees, departments, isAdmin }: EmployeeTableProps) {
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | null>(null)
  const router = useRouter()

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.first_name.toLowerCase().includes(search.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase())
    
    const matchesDepartment =
      departmentFilter === 'all' || employee.department_id === departmentFilter
    
    return matchesSearch && matchesDepartment
  })

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('employees').delete().eq('id', id)

    if (error) {
      toast.error('Failed to delete employee: ' + error.message)
      return
    }

    router.refresh()
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredEmployees.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    {isAdmin && <TableHead className="w-[50px]" />}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10">
                            <AvatarFallback className="text-sm font-medium">
                              {employee.first_name?.[0]}{employee.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {employee.first_name} {employee.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {employee.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {employee.department?.name || (
                          <span className="text-muted-foreground">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {employee.position || (
                          <span className="text-muted-foreground">Not set</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(employee.role)} className="capitalize">
                          {employee.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(employee.status)} className="capitalize">
                          {employee.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <a href={`mailto:${employee.email}`}>
                              <Mail className="h-4 w-4" />
                            </a>
                          </Button>
                          {employee.phone && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                              <a href={`tel:${employee.phone}`}>
                                <Phone className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingEmployee(employee)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeletingEmployeeId(employee.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {search || departmentFilter !== 'all'
                  ? 'No employees match your filters'
                  : 'No employees found'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {editingEmployee && (
        <EditEmployeeDialog
          employee={editingEmployee}
          departments={departments}
          open={!!editingEmployee}
          onOpenChange={(open) => !open && setEditingEmployee(null)}
        />
      )}

      <AlertDialog open={!!deletingEmployeeId} onOpenChange={(open) => !open && setDeletingEmployeeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: 'destructive' })}
              onClick={() => {
                if (deletingEmployeeId) handleDelete(deletingEmployeeId)
                setDeletingEmployeeId(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
