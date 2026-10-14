import { featuredVideos, type InstagramVideo, type VideoTopic } from '../../content/videos'
import { InstagramVideoCard } from '../ui/InstagramVideoCard'
import { SectionHeading } from '../ui/SectionHeading'

interface VideoShowcaseProps {
  topic: VideoTopic
  id: string
  eyebrow: string
  title: string
  description: string
}

/** Ideas principales del texto de la publicación, resumidas. */
function VideoIdeas({ video }: { video: InstagramVideo }) {
  if (!video.ideas?.length || !video.ideasTitle) return null
  return (
    <div className="mt-8 border-t border-line-strong pt-6">
      <h3 className="font-serif text-xl leading-snug">{video.ideasTitle}</h3>
      <ul className="mt-4 flex flex-col gap-3">
        {video.ideas.map((idea) => (
          <li key={idea} className="flex gap-4 text-[0.9375rem] leading-relaxed text-muted">
            <span aria-hidden="true" className="mt-[0.8em] h-px w-5 shrink-0 bg-accent" />
            <span>{idea}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Sección discreta de videos de una página temática. No se renderiza si el tema no tiene videos
 * publicados.
 * - Con varios videos: encabezado y texto a todo el ancho y, debajo, una columna por video
 *   (tarjeta + ideas principales).
 * - Con uno solo: encabezado a la izquierda y la tarjeta a la derecha, para no dejar un hueco.
 */
export function VideoShowcase({ topic, id, eyebrow, title, description }: VideoShowcaseProps) {
  const videos = featuredVideos(topic)
  if (videos.length === 0) return null

  if (videos.length === 1) {
    const [video] = videos as [InstagramVideo]
    return (
      <section aria-labelledby={id} className="section-y border-t border-line bg-surface">
        <div className="container-editorial grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7 lg:self-center">
            <SectionHeading id={id} eyebrow={eyebrow} title={title} description={description} />
            <VideoIdeas video={video} />
          </div>
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <InstagramVideoCard video={video} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby={id} className="section-y border-t border-line bg-surface">
      <div className="container-editorial">
        <SectionHeading id={id} eyebrow={eyebrow} title={title} description={description} wide />

        {/* Filas compartidas (subgrid): el bloque de ideas de ambas columnas empieza a la misma altura. */}
        <div className="mt-14 grid gap-16 md:grid-cols-2 md:grid-rows-[auto_auto] md:gap-x-12 md:gap-y-0 lg:gap-x-20">
          {videos.map((video) => (
            <div key={video.shortcode} className="md:row-span-2 md:grid md:grid-rows-subgrid">
              <InstagramVideoCard video={video} className="mx-auto md:mx-0" />
              <VideoIdeas video={video} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
