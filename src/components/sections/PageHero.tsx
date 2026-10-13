import type { ReactNode } from 'react'
import type { PhotoSource } from '../../config/images'
import { EditorialImage } from '../ui/EditorialImage'
import { SectionHeading } from '../ui/SectionHeading'

interface PageHeroProps {
  eyebrow: string
  title: ReactNode
  description: ReactNode
  photo?: PhotoSource
  photoPosition?: string
  photoAspect?: string
  children?: ReactNode
}

/** Encabezado editorial de las páginas interiores. El h1 de cada página nace aquí. */
export function PageHero({ eyebrow, title, description, photo, photoPosition, photoAspect, children }: PageHeroProps) {
  return (
    <section className="border-b border-line">
      <div
        className={
          photo
            ? 'container-editorial grid items-center gap-12 pb-16 pt-12 lg:grid-cols-12 lg:gap-16 lg:pb-24 lg:pt-20'
            : 'container-editorial pb-16 pt-12 lg:pb-24 lg:pt-20'
        }
      >
        <div className={photo ? 'lg:col-span-7' : 'max-w-4xl'}>
          <SectionHeading
            as="h1"
            eyebrow={eyebrow}
            title={title}
            description={description}
            titleClassName="!text-[2.25rem] sm:!text-5xl lg:!text-[3.5rem]"
          />
          {children && <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">{children}</div>}
        </div>
        {photo && (
          <div className="lg:col-span-5">
            <EditorialImage
              photo={photo}
              priority
              position={photoPosition}
              aspect={photoAspect ?? 'aspect-[4/5]'}
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="mx-auto max-w-md lg:max-w-none"
            />
          </div>
        )}
      </div>
    </section>
  )
}
