import { Link } from '@tanstack/react-router'
import type { CategoryThread } from '@/features/forum/types/forum'

type CategoryThreadRowProps = {
  thread: CategoryThread
  categorySlug: string
}

export const CategoryThreadRow = ({ thread, categorySlug }: CategoryThreadRowProps) => {
  return (
    <li className="forum-row">
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
  )
}
