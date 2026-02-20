import ForumMessage from '../../../components/ForumMessage'
import ForumPager from '../../../components/ForumPager'
import type { ThreadResponse } from '../../../types/forum'

type ThreadContentProps = {
  isLoading: boolean
  error?: string
  threadData?: ThreadResponse
  currentPage: number
  onPreviousPage: () => void
  onNextPage: () => void
}

export default function ThreadContent({
  isLoading,
  error,
  threadData,
  currentPage,
  onPreviousPage,
  onNextPage,
}: ThreadContentProps) {
  if (isLoading) {
    return <ForumMessage text="Loading posts..." />
  }

  if (error) {
    return <ForumMessage text={`Error: ${error}`} variant="error" />
  }

  const posts = threadData?.posts ?? []

  return (
    <>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.postId} className="post-card">
            <div className="post-head">
              <strong>{post.author}</strong>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <p>{post.contentText}</p>
          </li>
        ))}
      </ul>

      <ForumPager
        currentPage={currentPage}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        isPreviousDisabled={currentPage <= 1}
        isNextDisabled={!threadData?.nextPageUrl}
      />
    </>
  )
}
