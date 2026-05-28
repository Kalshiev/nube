'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button'
import { toast } from 'sonner'

interface DeleteDepartmentDialogProps {
  departmentId: string
  departmentName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}

export function DeleteDepartmentDialog({
  departmentId,
  departmentName,
  open,
  onOpenChange,
  onDeleted,
}: DeleteDepartmentDialogProps) {
  const router = useRouter()

  const handleDelete = async () => {
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
    onOpenChange(false)
    onDeleted?.()
    router.refresh()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Department</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{departmentName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
