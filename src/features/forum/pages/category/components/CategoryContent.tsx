import { Link } from '@tanstack/react-router'
import ForumPager from '../../../components/ForumPager'
import type { CategoryThread } from '../../../types/forum'

type CategoryContentProps = {
  threads: CategoryThread[]
  currentPage: number
  categorySlug: string
  onPreviousPage: () => void
  onNextPage: () => void
}

export default function CategoryContent({
  threads,
  currentPage,
  categorySlug,
  onPreviousPage,
  onNextPage,
}: CategoryContentProps) {
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

      <ForumPager
        currentPage={currentPage}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        isPreviousDisabled={currentPage <= 1}
        isNextDisabled={threads.length === 0}
      />
    </>
  )
}
