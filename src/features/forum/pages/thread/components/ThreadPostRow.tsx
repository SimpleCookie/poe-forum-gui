import { useMemo } from 'react'
import type { ThreadPost } from '@/features/forum/types/forum'
import { formatPostDate } from '@/features/forum/utils/formatPostDate'
import { officialUrls } from '@/features/forum/utils/officialUrls'
import { sanitizePostHtml } from '@/features/forum/utils/sanitizePostHtml'
import { PostToolbar } from './PostToolbar'

type ThreadPostRowProps = {
  post: ThreadPost
  page: number
}

export const ThreadPostRow = ({ post, page }: ThreadPostRowProps) => {
  const postHtml = useMemo(() => sanitizePostHtml(post.content), [post.content])

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
        {postHtml ? (
          <div className="post-body" dangerouslySetInnerHTML={{ __html: postHtml }} />
        ) : (
          <p>{post.content}</p>
        )}
      </div>

      <PostToolbar threadId={post.threadId} page={page} postId={post.postId} author={post.author} />
    </li>
  )
}
