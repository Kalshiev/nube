'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
    toast.success('Enlace de recuperación enviado — revisa tu correo')
  }

  if (sent) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center bg-white px-6">
          <div className="w-full max-w-sm text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10">
                <MailCheck className="h-8 w-8 text-brand" />
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
              Revisa tu correo
            </h2>
            <p className="mt-3 text-sm text-[#5F5F5F] leading-relaxed">
              Hemos enviado un enlace de recuperación a{' '}
              <span className="font-medium text-[#2E2E2E]">{email}</span>
            </p>
            <p className="mt-2 text-sm text-[#9D9EA3]">
              Haz clic en el enlace del correo para restablecer tu contraseña.
              Si no lo ves, revisa tu bandeja de spam.
            </p>
            <div className="mt-8">
              <Button asChild variant="outline" className="h-11 rounded-lg border-[#CACBD2] px-6">
                <Link href="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a iniciar sesión
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex h-12 items-center justify-between bg-brand px-8 text-xs text-white/80">
          <span>&copy; 2026 NUBE. Todos los derechos reservados.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Left side — brand panel */}
        <div className="hidden w-1/2 bg-[#D9D9D9] lg:flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#4C4C4C]" />

          <div className="flex flex-col items-center gap-6 px-12">
            <div className="flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand shadow-lg shadow-brand/30">
                <span className="text-2xl font-bold text-white">N</span>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-[#2E2E2E]">
                NUBE
              </h1>
              <p className="mt-3 text-base text-[#5F5F5F] leading-relaxed max-w-sm">
                ¿Olvidaste tu contraseña? No te preocupes, te ayudamos a recuperarla.
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <div className="h-2 w-2 rounded-full bg-brand/60" />
              <div className="h-2 w-2 rounded-full bg-brand/40" />
              <div className="h-2 w-2 rounded-full bg-brand/20" />
            </div>
          </div>
        </div>

        {/* Right side — form */}
        <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-white px-6 py-12">
          <div className="mb-8 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand shadow-sm">
              <span className="text-lg font-bold text-white">N</span>
            </div>
          </div>

          <div className="w-full max-w-sm">
            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-[#0A0A0A]">
                Recuperar contraseña
              </h2>
              <p className="mt-2 text-sm text-[#5F5F5F]">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            <div className="mb-8 h-px w-full bg-[#E8E8E8]" />

            <form onSubmit={handleReset} className="space-y-6">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#2E2E2E]">
                  Correo electrónico
                </Label>
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

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-lg bg-brand text-white font-semibold text-sm shadow-sm shadow-brand/25 hover:bg-brand/90 hover:shadow-md hover:shadow-brand/30 disabled:opacity-60 disabled:hover:shadow-sm transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar enlace de recuperación'
                )}
              </Button>

              <p className="text-center text-sm text-[#5F5F5F]">
                <Link href="/auth/login" className="font-medium text-brand hover:text-brand/80 transition-colors">
                  <ArrowLeft className="mr-1 inline h-3 w-3" />
                  Volver a iniciar sesión
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
