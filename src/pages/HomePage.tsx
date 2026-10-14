import { pageMeta } from '../content/pages'
import { usePageMeta } from '../hooks/usePageMeta'
import { BmqSection } from '../components/sections/BmqSection'
import { BmqVideoSection } from '../components/sections/BmqVideoSection'
import { ContactSection } from '../components/sections/ContactSection'
import { CredentialsStrip } from '../components/sections/CredentialsStrip'
import { HomeHero } from '../components/sections/HomeHero'
import { PracticeAreas } from '../components/sections/PracticeAreas'
import { ProfessionalProfile } from '../components/sections/ProfessionalProfile'
import { ValueProposition } from '../components/sections/ValueProposition'

export default function HomePage() {
  usePageMeta(pageMeta.home)

  return (
    <>
      <HomeHero />
      <CredentialsStrip />
      <ValueProposition />
      <PracticeAreas />
      <ProfessionalProfile />
      <BmqSection />
      <BmqVideoSection />
      <ContactSection />
    </>
  )
}
