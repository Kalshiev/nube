import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MailCheck } from 'lucide-react'

export default function SignUpSuccessPage() {
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
            Te hemos enviado un enlace de confirmación para verificar tu dirección de correo electrónico.
          </p>
          <p className="mt-2 text-sm text-[#9D9EA3]">
            Haz clic en el enlace para completar tu registro y acceder a NUBE.
            Si no lo ves, revisa tu bandeja de spam.
          </p>
          <div className="mt-8">
            <Button asChild variant="outline" className="h-11 rounded-lg border-[#CACBD2] px-6">
              <Link href="/auth/login">Volver a iniciar sesión</Link>
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
