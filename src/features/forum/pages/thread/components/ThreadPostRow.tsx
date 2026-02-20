import type { ThreadPost } from '../../../types/forum'
import { formatPostDate } from '../../../utils/formatPostDate'
import { officialUrls } from '../../../utils/officialUrls'
import PostToolbar from './PostToolbar'

type ThreadPostRowProps = {
  post: ThreadPost
}

export default function ThreadPostRow({ post }: ThreadPostRowProps) {
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
        <p>{post.contentText}</p>
      </div>

      <PostToolbar threadId={post.threadId} page={post.page} postId={post.postId} author={post.author} />
    </li>
  )
}
