import { photos } from '../config/images'
import { site } from '../config/site'
import { usePageMeta } from '../hooks/usePageMeta'
import { BmqSection } from '../components/sections/BmqSection'
import { ContactSection } from '../components/sections/ContactSection'
import { HomeHero } from '../components/sections/HomeHero'
import { PracticeAreas } from '../components/sections/PracticeAreas'
import { ProfessionalProfile } from '../components/sections/ProfessionalProfile'
import { ValueProposition } from '../components/sections/ValueProposition'

export default function HomePage() {
  usePageMeta({
    title: site.name,
    description:
      'Abogada especializada en Derecho Médico y directiva del sector salud. Acompañamiento jurídico y estratégico para médicos, especialistas, clínicas e IPS.',
    path: '/',
    image: photos.hallway.src,
  })

  return (
    <>
      <HomeHero />
      <ValueProposition />
      <PracticeAreas />
      <ProfessionalProfile />
      <BmqSection />
      <ContactSection />
    </>
  )
}
