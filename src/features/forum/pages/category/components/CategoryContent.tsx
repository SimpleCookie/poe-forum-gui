import { Link } from '@tanstack/react-router'
import type { CategoryThread } from '../../../types/forum'

type CategoryContentProps = {
  isLoading: boolean
  error: string | null
  threads: CategoryThread[]
  currentPage: number
  categorySlug: string
  onPreviousPage: () => void
  onNextPage: () => void
}

export default function CategoryContent({
  isLoading,
  error,
  threads,
  currentPage,
  categorySlug,
  onPreviousPage,
  onNextPage,
}: CategoryContentProps) {
  if (isLoading) {
    return <p className="forum-message">Loading threads...</p>
  }

  if (error) {
    return <p className="forum-message error">Error: {error}</p>
  }

  return (
    <>
      <ul className="forum-list">
        {threads.map((thread) => (
          <li className="forum-row" key={thread.threadId}>
            <div className="forum-row-main">
              <Link
                to="/thread/$threadId"
                params={{ threadId: thread.threadId }}
                search={{ category: categorySlug, page: 1 }}
              >
                {thread.title}
              </Link>
              <span className="forum-slug">Thread #{thread.threadId}</span>
            </div>
            <span className="forum-endpoint">Replies: {thread.replies}</span>
          </li>
        ))}
      </ul>

      <div className="forum-pager">
        <button type="button" onClick={onPreviousPage} disabled={currentPage <= 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button type="button" onClick={onNextPage} disabled={threads.length === 0}>
          Next
        </button>
      </div>
    </>
  )
}
