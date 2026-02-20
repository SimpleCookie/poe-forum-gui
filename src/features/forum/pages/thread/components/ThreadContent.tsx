import { ForumPager } from '@/features/forum/components/ForumPager'
import type { ThreadResponse } from '@/features/forum/types/forum'
import { ThreadPostRow } from './ThreadPostRow'

type ThreadContentProps = {
  threadData: ThreadResponse
  currentPage: number
  onPreviousPage: () => void
  onNextPage: () => void
}

export const ThreadContent = ({
  threadData,
  currentPage,
  onPreviousPage,
  onNextPage,
}: ThreadContentProps) => {
  const posts = threadData.posts

  return (
    <>
      <ul className="post-list">
        {posts.map((post) => (
          <ThreadPostRow key={post.postId} post={post} />
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
