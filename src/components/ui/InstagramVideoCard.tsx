import { useEffect, useState } from 'react'
import { ArrowUpRight, Play } from 'lucide-react'
import { instagramEmbedUrl, instagramPostUrl, type InstagramVideo } from '../../content/videos'
import { cx } from '../../lib/cx'
import { InstagramIcon } from './BrandIcons'

/** Tiempo máximo de espera del reproductor antes de ofrecer el enlace alternativo. */
export const EMBED_TIMEOUT_MS = 10000

type PlayerState = 'idle' | 'loading' | 'ready' | 'failed'

interface InstagramVideoCardProps {
  video: InstagramVideo
  className?: string
}

/**
 * Tarjeta editorial de video de Instagram. No carga nada de Instagram hasta que la persona
 * pulsa "Reproducir": entonces monta el reproductor oficial (iframe /embed/). Si no carga
 * a tiempo, ofrece el enlace a la publicación original, que además siempre está visible.
 * (Un iframe de otro origen no emite eventos de error fiables: la espera máxima es la detección.)
 */
export function InstagramVideoCard({ video, className }: InstagramVideoCardProps) {
  const [state, setState] = useState<PlayerState>('idle')
  const [thumbFailed, setThumbFailed] = useState(false)
  const postUrl = instagramPostUrl(video.shortcode)

  useEffect(() => {
    if (state !== 'loading') return
    const timer = window.setTimeout(() => setState('failed'), EMBED_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [state])

  const showThumbnail = Boolean(video.thumbnail) && !thumbFailed
  const showEmbed = state === 'loading' || state === 'ready'

  return (
    <article className={cx('flex w-full max-w-[19rem] flex-col', className)}>
      {/* Proporción vertical tipo Reel reservada desde el inicio: sin saltos de diseño. */}
      <div className="on-band relative aspect-[9/16] w-full overflow-hidden border border-line-strong">
        {showThumbnail ? (
          <img
            src={video.thumbnail}
            alt={`Miniatura del video: ${video.title}`}
            loading="lazy"
            decoding="async"
            onError={() => setThumbFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-start justify-start gap-5 px-6 pb-24 pt-8 text-left">
            <InstagramIcon size={26} className="text-band-accent" />
            <p className="font-serif text-2xl leading-snug">{video.title}</p>
          </div>
        )}

        {showEmbed && (
          <iframe
            src={instagramEmbedUrl(video.shortcode)}
            title={`Reproductor de Instagram: ${video.title}`}
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation"
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => setState('ready')}
            className="absolute inset-0 h-full w-full border-0 bg-band"
          />
        )}

        {state === 'loading' && (
          <output
            className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-xs uppercase tracking-[0.18em] text-band-muted"
          >
            Cargando reproductor…
          </output>
        )}

        {state === 'idle' && (
          <button
            type="button"
            onClick={() => setState('loading')}
            aria-label={`Reproducir video: ${video.title}`}
            className="group absolute inset-0 flex items-end justify-start p-5 text-left"
          >
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--band-btn-bg)] text-[var(--band-btn-text)] transition-[transform,background-color] duration-200 group-hover:scale-105 group-hover:bg-[var(--band-btn-hover)]">
              <Play size={20} strokeWidth={1.5} fill="currentColor" aria-hidden="true" className="ml-0.5" />
            </span>
          </button>
        )}

        {state === 'failed' && (
          <div
            role="alert"
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-band/95 px-6 text-center"
          >
            <p className="text-sm leading-relaxed text-band-muted">
              No se pudo cargar el reproductor en esta página. Puedes verlo directamente en Instagram.
            </p>
            <a
              href={postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 border border-band-ink/60 px-5 text-sm font-medium text-band-ink transition-colors hover:bg-band-ink hover:text-band"
            >
              Abrir en Instagram
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </div>
        )}
      </div>

      <div className="mt-5">
        {state !== 'idle' && (
          // Un iframe bloqueado (bloqueadores, políticas del navegador) puede quedar en blanco sin avisar:
          // la ayuda es visible siempre que se haya pedido el reproductor.
          <p className="mb-4 border-l-2 border-accent pl-3 text-sm leading-relaxed text-muted">
            ¿No ves el video?{' '}
            <a
              href={postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent underline underline-offset-4 hover:text-accent-strong"
            >
              Ábrelo en Instagram<span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </p>
        )}
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
          <InstagramIcon size={14} />
          <span>Instagram</span>
          {video.account && <span className="normal-case tracking-normal">· {video.account}</span>}
        </p>
        <h3 className="mt-3 text-xl leading-snug">{video.title}</h3>
        {video.description && <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{video.description}</p>}
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-strong"
        >
          Ver publicación original
          <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
          <span className="sr-only"> en Instagram: {video.title} (se abre en una pestaña nueva)</span>
        </a>
      </div>
    </article>
  )
}
