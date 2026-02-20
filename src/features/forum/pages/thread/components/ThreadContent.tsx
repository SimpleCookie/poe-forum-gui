import { ForumPager } from '@/features/forum/components/ForumPager'
import type { ThreadResponse } from '@/features/forum/types/forum'
import { ThreadPostRow } from './ThreadPostRow'

type ThreadContentProps = {
  threadData: ThreadResponse
  currentPage: number
  onPreviousPage: () => void
  onNextPage: () => void
  onFirstPage: () => void
  onLastPage: () => void
}

export const ThreadContent = ({
  threadData,
  currentPage,
  onPreviousPage,
  onNextPage,
  onFirstPage,
  onLastPage,
}: ThreadContentProps) => {
  const posts = threadData.posts

  return (
    <>
      <ul className="post-list">
        {posts.map((post) => (
          <ThreadPostRow key={post.postId} post={post} page={currentPage} />
        ))}
      </ul>

      <ForumPager
        currentPage={currentPage}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        isPreviousDisabled={!threadData.pagination.hasPrevious}
        isNextDisabled={!threadData.pagination.hasNext}
        totalPages={threadData.pagination.totalPages}
        onFirstPage={onFirstPage}
        onLastPage={onLastPage}
        isFirstDisabled={!threadData.pagination.hasPrevious}
        isLastDisabled={!threadData.pagination.hasNext}
      />
    </>
  )
}
