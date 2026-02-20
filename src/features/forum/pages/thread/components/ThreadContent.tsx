import type { ThreadResponse } from '../../../types/forum'

type ThreadContentProps = {
  isLoading: boolean
  error: string | null
  threadData: ThreadResponse | null
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
    return <p className="forum-message">Loading posts...</p>
  }

  if (error) {
    return <p className="forum-message error">Error: {error}</p>
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

      <div className="forum-pager">
        <button
          type="button"
          onClick={onPreviousPage}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          type="button"
          onClick={onNextPage}
          disabled={!threadData?.nextPageUrl}
        >
          Next
        </button>
      </div>
    </>
  )
}
