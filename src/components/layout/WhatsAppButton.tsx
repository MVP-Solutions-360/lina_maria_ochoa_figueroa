import { MessageCircle } from 'lucide-react'
import { whatsapp } from '../../config/site'
import { Button } from '../ui/Button'

interface WhatsAppButtonProps {
  label?: string
  variant?: 'primary' | 'secondary'
  tone?: 'default' | 'band'
  size?: 'md' | 'sm'
  className?: string
}

/**
 * Botón de contacto. Mientras el número no esté configurado en config/site.ts,
 * se muestra deshabilitado: no se simula un contacto funcional.
 */
export function WhatsAppButton({
  label = 'Contactar por WhatsApp',
  variant = 'primary',
  tone = 'default',
  size = 'md',
  className,
}: WhatsAppButtonProps) {
  const icon = <MessageCircle aria-hidden="true" size={18} strokeWidth={1.5} />

  if (!whatsapp.href) {
    return (
      <Button disabled title={whatsapp.pendingNotice} size={size} className={className} icon={icon}>
        {label}
      </Button>
    )
  }

  return (
    <Button href={whatsapp.href} variant={variant} tone={tone} size={size} className={className} icon={icon}>
      {label}
    </Button>
  )
}
