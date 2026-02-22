import type { ReactNode } from 'react'
import type { ThreadPost } from '@/features/forum/types/forum'
import { formatPostDate } from '@/features/forum/utils/formatPostDate'
import { officialUrls } from '@/features/forum/utils/officialUrls'
import { PostToolbar } from './PostToolbar'

type ThreadPostRowProps = {
  post: ThreadPost
  page: number
}

const renderPostBlock = (post: ThreadPost, index: number): ReactNode => {
  const block = post.content.blocks[index]
  const key = `${post.postId}-${index}`

  switch (block.type) {
    case 'paragraph':
      return <p key={key}>{block.text}</p>
    case 'quote':
      return (
        <blockquote key={key} className="post-quote">
          {block.author ? <cite>{block.author} wrote:</cite> : null}
          {block.text}
        </blockquote>
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
