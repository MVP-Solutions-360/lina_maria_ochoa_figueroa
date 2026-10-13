import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom no implementa estas APIs que usa la aplicación.
window.scrollTo = () => {}

afterEach(() => {
  cleanup()
  document.body.style.overflow = ''
})
