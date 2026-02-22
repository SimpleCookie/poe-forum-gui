import type { ReactNode } from 'react'
import { useState } from 'react'
import type { ThreadPost } from '@/features/forum/types/forum'
import { formatPostDate } from '@/features/forum/utils/formatPostDate'
import { officialUrls } from '@/features/forum/utils/officialUrls'
import { PostToolbar } from './PostToolbar'

type ThreadPostRowProps = {
  post: ThreadPost
  page: number
}

type QuoteRenderNode = {
  key: string
  author?: string
  text: string
  children: QuoteRenderNode[]
}

type PostRenderItem =
  | {
      kind: 'quote'
      node: QuoteRenderNode
    }
  | {
      kind: 'element'
      element: ReactNode
    }

const renderTextWithLineBreaks = (text: string, keyPrefix: string): ReactNode[] => {
  const normalized = text
    .replace(/\\n/g, '\n')
    .replace(/\r\n?/g, '\n')
    .replace(/^\n+|\n+$/g, '')
    .replace(/\n{2,}/g, '\n')
  const lines = normalized.split('\n')

  return lines.flatMap((line, lineIndex) => {
    if (lineIndex === lines.length - 1) {
      return [<span key={`${keyPrefix}-line-${lineIndex}`}>{line}</span>]
    }

    return [
      <span key={`${keyPrefix}-line-${lineIndex}`}>{line}</span>,
      <br key={`${keyPrefix}-br-${lineIndex}`} />,
    ]
  })
}

const resolveYoutubeVideoId = (videoId: string | undefined, embedUrl: string, url: string) => {
  if (videoId && videoId.length > 0) {
    return videoId
  }

  const embedMatch = embedUrl.match(/\/embed\/([^?&/]+)/)
  if (embedMatch?.[1]) {
    return embedMatch[1]
  }

  const watchMatch = url.match(/[?&]v=([^?&/]+)/)
  if (watchMatch?.[1]) {
    return watchMatch[1]
  }

  return ''
}

const renderQuoteNode = (node: QuoteRenderNode): ReactNode => (
  <blockquote key={node.key} className="post-quote">
    {node.author ? (
      <cite className="quote-author">
        <a href={officialUrls.profile(node.author)} target="_blank" rel="noreferrer">
          {node.author}
        </a>
      </cite>
    ) : (
      <cite className="quote-author quote-author--anon" />
    )}
    {renderTextWithLineBreaks(node.text, `${node.key}-quote`) }
    {node.children.map((child) => renderQuoteNode(child))}
  </blockquote>
)

const renderPostBlock = (
  post: ThreadPost,
  index: number,
  loadedEmbedKeys: Set<string>,
  loadEmbed: (embedKey: string) => void
): ReactNode => {
  const block = post.content.blocks[index]
  const key = `${post.postId}-${index}`

  switch (block.type) {
    case 'paragraph':
      return <p key={key}>{renderTextWithLineBreaks(block.text, key)}</p>
    case 'image':
      return <img key={key} src={block.url} alt={block.alt ?? ''} loading="lazy" />
    case 'embed':
      if (block.provider === 'youtube') {
        const embedKey = `${key}-youtube`
        const isLoaded = loadedEmbedKeys.has(embedKey)
        const youtubeVideoId = resolveYoutubeVideoId(block.videoId, block.embedUrl, block.url)

        if (!isLoaded && youtubeVideoId) {
          const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`

          return (
            <button
              key={key}
              type="button"
              className="post-embed-preview"
              onClick={() => loadEmbed(embedKey)}
              aria-label="Load YouTube video"
            >
              <img src={thumbnailUrl} alt="YouTube video thumbnail" loading="lazy" />
              <span className="post-embed-play">Play</span>
            </button>
          )
        }

        return (
          <iframe
            key={key}
            src={block.embedUrl}
            title={youtubeVideoId || `video-${post.postId}-${index}`}
            loading="lazy"
            allowFullScreen
          />
        )
      }

      return (
        <a key={key} href={block.url} target="_blank" rel="noreferrer">
          {block.url}
        </a>
      )
    default:
      return null
  }
}

const renderPostBlocks = (
  post: ThreadPost,
  loadedEmbedKeys: Set<string>,
  loadEmbed: (embedKey: string) => void
): ReactNode[] => {
  const items: PostRenderItem[] = []
  const quoteStack: QuoteRenderNode[] = []

  post.content.blocks.forEach((block, index) => {
    const key = `${post.postId}-${index}`

    if (block.type !== 'quote') {
      quoteStack.length = 0
      items.push({
        kind: 'element',
        element: renderPostBlock(post, index, loadedEmbedKeys, loadEmbed),
      })
      return
    }

    const targetDepth = Math.max(1, Math.min(block.depth, quoteStack.length + 1))

    while (quoteStack.length > targetDepth - 1) {
      quoteStack.pop()
    }

    const node: QuoteRenderNode = {
      key,
      author: block.author,
      text: block.text,
      children: [],
    }

    const parentNode = quoteStack[quoteStack.length - 1]

    if (parentNode) {
      parentNode.children.push(node)
    } else {
      items.push({ kind: 'quote', node })
    }

    quoteStack.push(node)
  })

  return items.map((item) =>
    item.kind === 'quote' ? renderQuoteNode(item.node) : item.element
  )
}

export const ThreadPostRow = ({ post, page }: ThreadPostRowProps) => {
  const [loadedEmbedKeys, setLoadedEmbedKeys] = useState<Set<string>>(new Set())

  const loadEmbed = (embedKey: string) => {
    setLoadedEmbedKeys((previousKeys) => {
      if (previousKeys.has(embedKey)) {
        return previousKeys
      }

      const nextKeys = new Set(previousKeys)
      nextKeys.add(embedKey)
      return nextKeys
    })
  }

  return (
    <li key={post.postId} className="post-card" id={`post-${post.postId.replace(/^p/, '')}`}>
      <div className="post-card-content">
        <div className="post-head">
          <a
            className="post-author-link"
            href={officialUrls.profile(post.author)}
            target="_blank"
            rel="noreferrer"
          >
            {post.author}
          </a>
          <span>{formatPostDate(post.createdAt)}</span>
        </div>
        <div className="post-body">{renderPostBlocks(post, loadedEmbedKeys, loadEmbed)}</div>
      </div>

      <PostToolbar threadId={post.threadId} page={page} postId={post.postId} author={post.author} />
    </li>
  )
}
