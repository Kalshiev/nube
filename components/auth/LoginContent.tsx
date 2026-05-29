'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Left side — brand panel */}
        <div className="hidden w-1/2 bg-[#D9D9D9] lg:flex flex-col items-center justify-center relative overflow-hidden">
          {/* Dark top strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#4C4C4C]" />

          {/* Brand content */}
          <div className="flex flex-col items-center gap-6 px-12">
            {/* Logo mark */}
            <div className="flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand shadow-lg shadow-brand/30">
                <span className="text-2xl font-bold text-white">N</span>
              </div>
            </div>

            {/* Brand text */}
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-[#2E2E2E]">
                NUBE
              </h1>
              <p className="mt-3 text-base text-[#5F5F5F] leading-relaxed max-w-sm">
                Simplifica la gestión de tu equipo. Control de asistencia, solicitudes y más en un solo lugar.
              </p>
            </div>

            {/* Decorative elements */}
            <div className="mt-8 flex gap-3">
              <div className="h-2 w-2 rounded-full bg-brand/60" />
              <div className="h-2 w-2 rounded-full bg-brand/40" />
              <div className="h-2 w-2 rounded-full bg-brand/20" />
            </div>
          </div>
        </div>

        {/* Right side — form */}
        <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-white px-6 py-12">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand shadow-sm">
              <span className="text-lg font-bold text-white">N</span>
            </div>
          </div>

          <div className="w-full max-w-sm">
            {/* Heading */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-[#0A0A0A]">
                Iniciar sesión
              </h2>
              <p className="mt-2 text-sm text-[#5F5F5F]">
                Ingresa tus credenciales para acceder a tu cuenta
              </p>
            </div>

            {/* Divider */}
            <div className="mb-8 h-px w-full bg-[#E8E8E8]" />

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#2E2E2E]">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="nombre@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 rounded-lg border-[#CACBD2] bg-white px-4 text-sm placeholder:text-[#9D9EA3] focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-[#2E2E2E]">
                    Contraseña
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 rounded-lg border-[#CACBD2] bg-white px-4 pr-10 text-sm placeholder:text-[#9D9EA3] focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9D9EA3] hover:text-[#2E2E2E] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="text-right">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-brand hover:text-brand/80 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading}
                className="relative h-11 w-full rounded-lg bg-brand text-white font-semibold text-sm shadow-sm shadow-brand/25 hover:bg-brand/90 hover:shadow-md hover:shadow-brand/30 disabled:opacity-60 disabled:hover:shadow-sm transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E8E8E8]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-[#9D9EA3]">
                    O continúa con
                  </span>
                </div>
              </div>

              {/* Social login */}
              <button
                type="button"
                onClick={async () => {
                  const supabase = createClient()
                  await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: `${window.location.origin}/auth/callback`,
                    },
                  })
                }}
                className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-[#D6D6D6] bg-white text-sm font-medium text-[#2E2E2E] hover:bg-[#F5F5F5] transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuar con Google
              </button>

              {/* Sign up link */}
              <p className="mt-6 text-center text-sm text-[#5F5F5F]">
                ¿No tienes cuenta?{' '}
                <Link
                  href="/auth/sign-up"
                  className="font-semibold text-brand hover:text-brand/80 transition-colors"
                >
                  Regístrate
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom teal bar */}
      <div className="flex h-12 items-center justify-between bg-brand px-8 text-xs text-white/80">
        <span>&copy; 2026 NUBE. Todos los derechos reservados.</span>
        <div className="hidden items-center gap-4 sm:flex">
          <span>nube-hr.com</span>
          <span className="h-3 w-px bg-white/20" />
          <span>Soporte</span>
          <span className="h-3 w-px bg-white/20" />
          <span>Privacidad</span>
        </div>
      </div>
    </div>
  )
}
