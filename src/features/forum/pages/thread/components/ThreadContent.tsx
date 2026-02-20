import ForumPager from '../../../components/ForumPager'
import type { ThreadResponse } from '../../../types/forum'
import ThreadPostRow from './ThreadPostRow'

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
