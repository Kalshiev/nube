import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 items-center justify-center bg-white px-6">
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            Error de autenticación
          </h2>
          <p className="mt-3 text-sm text-[#5F5F5F] leading-relaxed">
            Ocurrió un problema durante la autenticación. Por favor, intenta iniciar sesión nuevamente.
          </p>
          <p className="mt-2 text-sm text-[#9D9EA3]">
            Si el problema persiste, contacta a tu administrador de HR.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild variant="outline" className="h-11 rounded-lg border-[#CACBD2] px-6">
              <Link href="/auth/login">Intentar de nuevo</Link>
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
