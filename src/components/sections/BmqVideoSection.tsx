import { bmqCareStages, bmqVideoIntro } from '../../content/bmq'
import { featuredVideos } from '../../content/videos'
import { InstagramVideoCard } from '../ui/InstagramVideoCard'

/** Portada: único video destacado, la presentación de BMQ. Va después de la sección de BMQ y antes del contacto. */
export function BmqVideoSection() {
  const [video] = featuredVideos('bmq-presentacion')
  if (!video) return null

  return (
    <section aria-labelledby="bmq-video-title" className="section-y border-y border-line bg-surface">
      <div className="container-editorial grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-7">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-link">Blindaje Médico Quirúrgico</p>
          <h2 id="bmq-video-title" className="max-w-xl text-[1.9rem] sm:text-4xl lg:text-[2.5rem]">
            Cómo entiende BMQ la protección legal en el sector salud.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{bmqVideoIntro}</p>

          <ol className="mt-10 max-w-xl border-b border-line-strong">
            {bmqCareStages.map((item, index) => (
              <li key={item.stage} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-line-strong py-5">
                <span aria-hidden="true" className="font-serif text-sm leading-7 text-link">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-sans text-base font-medium leading-7">{item.stage}</h3>
                  <p className="text-[0.9375rem] leading-relaxed text-muted">{item.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-5 lg:justify-self-end">
          <InstagramVideoCard video={video} className="mx-auto lg:mx-0" />
        </div>
      </div>
    </section>
  )
}
