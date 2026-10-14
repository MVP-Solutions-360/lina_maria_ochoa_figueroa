import { pageMeta } from '../content/pages'
import { usePageMeta } from '../hooks/usePageMeta'
import { Button } from '../components/ui/Button'

export default function NotFoundPage() {
  usePageMeta(pageMeta.notFound)

  return (
    <section className="section-y">
      <div className="container-editorial min-h-[50vh] max-w-3xl">
        <p className="eyebrow mb-6">Error 404</p>
        <h1 className="text-[2.5rem] sm:text-6xl">Esta página no está disponible.</h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Es posible que el enlace haya cambiado o que la dirección no sea correcta. Puedes volver al
          inicio o explorar las secciones principales.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button to="/">Volver al inicio</Button>
          <Button to="/perfil-profesional" variant="secondary">
            Perfil profesional
          </Button>
        </div>
      </div>
    </section>
  )
}
