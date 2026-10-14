import { credentialInstitutions } from '../../content/professional'

/**
 * Franja de credenciales bajo el hero: instituciones donde se formó Lina. Sin logo configurado
 * muestra el nombre; con logo oficial (content/professional.ts) lo muestra sobre el nombre.
 * No incluye premios, certificaciones ni reconocimientos: sólo formación documentada.
 */
export function CredentialsStrip() {
  return (
    <section aria-labelledby="credenciales-title" className="border-b border-line bg-surface">
      <div className="container-editorial py-10 lg:py-12">
        <h2 id="credenciales-title" className="eyebrow mb-8 text-center lg:text-left">
          Formación académica en
        </h2>

        <ul className="grid grid-cols-1 gap-x-6 gap-y-8 min-[430px]:grid-cols-2 min-[430px]:gap-y-10 lg:grid-cols-4 lg:gap-x-0">
          {credentialInstitutions.map((institution) => (
            <li
              key={institution.name}
              className="flex flex-col items-center text-center lg:items-start lg:border-l lg:border-line lg:px-8 lg:text-left lg:first:border-l-0 lg:first:pl-0"
            >
              {institution.logo && (
                <img
                  src={institution.logo.src}
                  alt={institution.logo.alt}
                  loading="lazy"
                  decoding="async"
                  className="mb-4 h-12 w-auto max-w-[9rem] object-contain"
                />
              )}
              <p className="font-serif text-lg leading-snug [overflow-wrap:anywhere] sm:text-xl">{institution.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {institution.detail}
                {institution.country ? <span className="whitespace-nowrap">{` · ${institution.country}`}</span> : null}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
