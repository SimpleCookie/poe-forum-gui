import DOMPurify from 'dompurify'
import { officialUrls } from './officialUrls'

/**
 * Iteratively converts BBCode [quote="author"]…[/quote] blocks (including
 * nested ones) into <blockquote> HTML, working innermost-first so that
 * nested quotes expand correctly.
 *
 * Handles both literal " and HTML-encoded &quot; in the quote tag.
 */
const expandBbcodeQuotes = (html: string): string => {
  // Matches innermost [quote] blocks - author value uses " or &quot;
  const inner =
    /\[quote(?:=(?:"|&quot;)([^"&]*)(?:"|&quot;))\]([\s\S]*?)\[\/quote\]|\[quote\]([\s\S]*?)\[\/quote\]/gi

  const stripEdgeBr = (s: string) =>
    s
      .replace(/^(\s*<br\s*\/?>\s*)+/i, '')
      .replace(/(\s*<br\s*\/?>\s*)+$/i, '')
      .trim()

  let out = html
  let prev: string
  do {
    prev = out
    out = out.replace(
      inner,
      (_match, namedAuthor: string | undefined, namedBody: string | undefined, anonBody: string | undefined) => {
        const author = namedAuthor
        const body = stripEdgeBr(namedBody ?? anonBody ?? '')
        const cite = author
          ? `<cite class="quote-author"><a href="${officialUrls.profile(author)}" target="_blank" rel="noreferrer">${author}</a></cite>`
          : `<cite class="quote-author quote-author--anon"></cite>`
        return `<blockquote class="post-quote">${cite}${body}</blockquote>`
      },
    )
  } while (out !== prev)
  return out
}

export const sanitizePostHtml = (rawHtml: string) => {
  if (!rawHtml.trim()) {
    return ''
  }

  const withQuotes = expandBbcodeQuotes(rawHtml)

  const parser = new DOMParser()
  const parsed = parser.parseFromString(withQuotes, 'text/html')
  const contentRoot = parsed.querySelector('.content') ?? parsed.body

  // Remove decorative BBCode artefacts the API injects around [quote] tags
  contentRoot.querySelectorAll('span.quote').forEach((el) => el.remove())

  return DOMPurify.sanitize(contentRoot.innerHTML, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['class', 'target', 'rel'],
  }).trim()
}
