import type { ReactNode } from 'react'
import type { ThreadPost } from '@/features/forum/types/forum'
import { formatPostDate } from '@/features/forum/utils/formatPostDate'
import { officialUrls } from '@/features/forum/utils/officialUrls'
import { PostToolbar } from './PostToolbar'

type ThreadPostRowProps = {
  post: ThreadPost
  page: number
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

const buildNestedQuote = (content: ReactNode, depth: number, key: string): ReactNode => {
  let nestedQuote = content

  for (let level = 1; level < depth; level += 1) {
    nestedQuote = (
      <blockquote key={`${key}-depth-${level}`} className="post-quote">
        {nestedQuote}
      </blockquote>
    )
  }

  return nestedQuote
}

const renderPostBlock = (post: ThreadPost, index: number): ReactNode => {
  const block = post.content.blocks[index]
  const key = `${post.postId}-${index}`

  switch (block.type) {
    case 'paragraph':
      return <p key={key}>{renderTextWithLineBreaks(block.text, key)}</p>
    case 'quote':
      return buildNestedQuote(
        <blockquote key={key} className="post-quote">
          {block.author ? (
            <cite className="quote-author">
              <a href={officialUrls.profile(block.author)} target="_blank" rel="noreferrer">
                {block.author}
              </a>
            </cite>
          ) : (
            <cite className="quote-author quote-author--anon" />
          )}
          {renderTextWithLineBreaks(block.text, `${key}-quote`)}
        </blockquote>,
        Math.max(1, block.depth),
        key
      )
    case 'image':
      return <img key={key} src={block.url} alt={block.alt ?? ''} loading="lazy" />
    case 'embed':
      if (block.provider === 'youtube') {
        return (
          <iframe
            key={key}
            src={block.embedUrl}
            title={block.videoId ?? `video-${post.postId}-${index}`}
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

export const ThreadPostRow = ({ post, page }: ThreadPostRowProps) => {
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
        <div className="post-body">{post.content.blocks.map((_block, index) => renderPostBlock(post, index))}</div>
      </div>

      <PostToolbar threadId={post.threadId} page={page} postId={post.postId} author={post.author} />
    </li>
  )
}
