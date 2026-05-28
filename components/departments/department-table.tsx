'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Building2, Users, Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { EditDepartmentDialog } from './edit-department-dialog'
import type { Department } from '@/lib/types'

interface DepartmentTableProps {
  departments: (Department & { employeeCount: number })[]
  isAdmin: boolean
}

export function DepartmentTable({ departments, isAdmin }: DepartmentTableProps) {
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null)
  
  const handleDelete = async (departmentId: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', departmentId)

    if (error) {
      toast.error('Failed to delete department: ' + error.message)
      return
    }

    toast.success('Department deleted successfully')
    setDeletingDepartment(null)
  }

  if (departments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No departments found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => (
          <Card key={dept.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {dept.employeeCount}
                  </Badge>
                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingDepartment(dept)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingDepartment(dept)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
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

      {editingDepartment && (
        <EditDepartmentDialog
          department={editingDepartment}
          open={!!editingDepartment}
          onOpenChange={(open) => !open && setEditingDepartment(null)}
        />
      )}

      <AlertDialog
        open={!!deletingDepartment}
        onOpenChange={(open) => !open && setDeletingDepartment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingDepartment?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: 'destructive' })}
              onClick={() => deletingDepartment && handleDelete(deletingDepartment.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
