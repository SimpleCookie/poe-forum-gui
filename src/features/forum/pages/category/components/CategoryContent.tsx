import { ForumPager } from '@/features/forum/components/ForumPager'
import type { CategoryThread } from '@/features/forum/types/forum'
import { CategoryThreadRow } from './CategoryThreadRow'

type CategoryContentProps = {
  threads: CategoryThread[]
  currentPage: number
  categorySlug: string
  onPreviousPage: () => void
  onNextPage: () => void
}

export const CategoryContent = ({
  threads,
  currentPage,
  categorySlug,
  onPreviousPage,
  onNextPage,
}: CategoryContentProps) => {
  return (
    <>
      <ul className="forum-list">
        {threads.map((thread) => (
          <CategoryThreadRow key={thread.threadId} thread={thread} categorySlug={categorySlug} />
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
