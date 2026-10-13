import { useState } from 'react'
import type { PhotoSource } from '../../config/images'
import { cx } from '../../lib/cx'

interface EditorialImageProps {
  photo: PhotoSource
  /** Clase de relación de aspecto de Tailwind, ej. 'aspect-[4/5]' */
  aspect?: string
  /** Prioriza la carga (sólo para la imagen de la primera pantalla) */
  priority?: boolean
  sizes?: string
  /** Sobrescribe el object-position definido en config/images.ts */
  position?: string
  /** Marco fino desplazado, recurso editorial */
  frame?: boolean
  className?: string
}

export function EditorialImage({
  photo,
  aspect = 'aspect-[4/5]',
  priority = false,
  sizes,
  position,
  frame = true,
  className,
}: EditorialImageProps) {
  const [failed, setFailed] = useState(false)

  return (
    <figure className={cx('relative', className)}>
      {frame && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-3 -right-3 hidden h-full w-full border border-accent-soft/70 sm:block"
        />
      )}
      <div className={cx('relative w-full overflow-hidden bg-surface-muted', aspect)}>
        {failed ? (
          <div className="flex h-full w-full items-center justify-center font-serif text-5xl text-accent">
            <span aria-hidden="true">LO</span>
            <figcaption className="sr-only">{photo.alt}</figcaption>
          </div>
        ) : (
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
            style={{ objectPosition: position ?? photo.position }}
          />
        )}
      </div>
    </figure>
  )
}
