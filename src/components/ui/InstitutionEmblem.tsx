import type { CredentialInstitution } from '../../content/professional'

interface InstitutionEmblemProps {
  institution: CredentialInstitution
  loading?: 'eager' | 'lazy'
  className?: string
}

/** Logotipo a color en tema claro; en tema oscuro, la versión monocroma original. */
export function InstitutionEmblem({ institution, loading = 'lazy', className }: InstitutionEmblemProps) {
  const { emblem, emblemColor } = institution
  if (!emblem) return null
  return (
    <picture>
      {emblemColor && <source media="(prefers-color-scheme: dark)" srcSet={emblem.src} />}
      <img
        src={emblemColor?.src ?? emblem.src}
        alt={emblem.alt}
        width={emblemColor?.width ?? emblem.width}
        height={emblemColor?.height ?? emblem.height}
        loading={loading}
        decoding="async"
        className={className}
      />
    </picture>
  )
}
