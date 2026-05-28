'use client'

import { Suspense } from 'react'
import { LoginContent } from '@/components/auth/LoginContent'

function LoginPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="space-y-4">
          <div className="h-6 w-48 animate-pulse rounded bg-muted mx-auto" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted mx-auto" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginContent />
    </Suspense>
  )
}
