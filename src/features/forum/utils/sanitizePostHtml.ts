import DOMPurify from 'dompurify'

export const sanitizePostHtml = (rawHtml: string) => {
  if (!rawHtml.trim()) {
    return ''
  }

  const parser = new DOMParser()
  const parsed = parser.parseFromString(rawHtml, 'text/html')
  const contentRoot = parsed.querySelector('.content') ?? parsed.body

  return DOMPurify.sanitize(contentRoot.innerHTML, {
    USE_PROFILES: { html: true },
  }).trim()
}
