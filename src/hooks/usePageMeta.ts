import { useEffect } from 'react'
import { applyPageMeta, type PageMeta } from '../lib/seo'

export function usePageMeta({ title, description, path, noindex }: PageMeta) {
  useEffect(() => {
    applyPageMeta({ title, description, path, noindex })
  }, [title, description, path, noindex])
}
