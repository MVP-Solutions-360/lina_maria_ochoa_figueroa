import { photos } from '../../config/images'
import { site } from '../../config/site'
import { profileBlocks } from '../../content/professional'
import { Button } from '../ui/Button'
import { EditorialImage } from '../ui/EditorialImage'
import { SectionHeading } from '../ui/SectionHeading'

/** Cuatro bloques narrativos que muestran cómo se relacionan sus áreas de experiencia. */
export function ProfileBlocks() {
  return (
    <section aria-labelledby="perfil-bloques-title" className="section-y border-y border-line bg-surface">
      <div className="container-editorial">
        <SectionHeading
          id="perfil-bloques-title"
          eyebrow="Perfil"
          title="Del ejercicio jurídico a la dirección de instituciones de salud."
        />

        <ol className="mt-14 border-b border-line-strong">
          {profileBlocks.map((block, index) => (
            <li
              key={block.id}
              className="grid gap-5 border-t border-line-strong py-10 lg:grid-cols-12 lg:gap-12 lg:py-14"
            >
              <div className="lg:col-span-4">
                <p aria-hidden="true" className="font-serif text-sm text-accent">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 text-2xl leading-snug sm:text-[1.75rem]">{block.title}</h3>
              </div>

              {block.id === 'bmq' ? (
                <div className="grid items-start gap-8 sm:grid-cols-[1fr_13rem] lg:col-span-8 lg:grid-cols-[1fr_15rem] lg:gap-12">
                  <div>
                    <p className="text-base leading-relaxed text-muted lg:text-lg">{block.text}</p>
                    <Button href={site.bmqUrl} variant="text" className="mt-4">
                      Conocer la propuesta de BMQ en su web
                    </Button>
                  </div>
                  <EditorialImage
                    photo={photos.armchair}
                    aspect="aspect-[4/5]"
                    frame={false}
                    sizes="240px"
                    className="max-w-[13rem] sm:max-w-none"
                  />
                </div>
              ) : (
                <div className="lg:col-span-8">
                  <p className="text-base leading-relaxed text-muted lg:text-lg">{block.text}</p>
                  {block.link && (
                    <Button to={block.link.to} variant="text" className="mt-4">
                      {block.link.label}
                    </Button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
