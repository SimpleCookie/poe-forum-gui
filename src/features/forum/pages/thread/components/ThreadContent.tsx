import ForumPager from '../../../components/ForumPager'
import type { ThreadResponse } from '../../../types/forum'
import { formatPostDate } from '../../../utils/formatPostDate'
import PostToolbar from './PostToolbar'

type ThreadContentProps = {
  threadData: ThreadResponse
  currentPage: number
  onPreviousPage: () => void
  onNextPage: () => void
}

export default function ThreadContent({
  threadData,
  currentPage,
  onPreviousPage,
  onNextPage,
}: ThreadContentProps) {
  const posts = threadData.posts

  return (
    <>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.postId} className="post-card" id={`post-${post.postId.replace(/^p/, '')}`}>
            <div className="post-card-content">
              <div className="post-head">
                <strong>{post.author}</strong>
                <span>{formatPostDate(post.createdAt)}</span>
              </div>
              <p>{post.contentText}</p>
            </div>

            <PostToolbar
              threadId={post.threadId}
              page={post.page}
              postId={post.postId}
              author={post.author}
            />
          </li>
        ))}
      </ul>

      <ForumPager
        currentPage={currentPage}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        isPreviousDisabled={currentPage <= 1}
        isNextDisabled={!threadData.nextPageUrl}
      />
    </>
  )
}
