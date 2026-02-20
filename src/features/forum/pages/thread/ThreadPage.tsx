import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { getForumThread } from '../../api/forumApi'
import ForumMessage from '../../components/ForumMessage'
import { assertNever } from '../../utils/assertNever'
import ThreadContent from './components/ThreadContent'

export default function ThreadPage() {
  const { threadId } = useParams({ from: '/thread/$threadId' })
  const search = useSearch({ from: '/thread/$threadId' })
  const categorySlug = search.category
  const currentPage = search.page
  const navigate = useNavigate({ from: '/thread/$threadId' })

  const {
    isPending: isThreadPending,
    isError: isThreadError,
    error: threadError,
    data: threadResult,
  } = useQuery({
    queryKey: ['forum', 'thread', threadId, currentPage],
    queryFn: () => getForumThread(threadId, currentPage),
  })

  const goToPage = (nextPage: number) => {
    void navigate({
      to: '/thread/$threadId',
      params: { threadId },
      search: (prev) => ({ ...prev, page: nextPage }),
    })
  }

  const renderBackLink = () => {
    if (categorySlug) {
      return (
        <Link
          to="/category/$slug"
          params={{ slug: categorySlug }}
          search={{ name: undefined, page: 1 }}
        >
          ← Back to category
        </Link>
      )
    }

    return <Link to="/">← Back to categories</Link>
  }

  const renderThreadWrapper = (content: ReactNode) => (
    <section className="forum-board">
      <div className="forum-status">{renderBackLink()}</div>
      <article className="forum-group">
        <h2>Thread #{threadId}</h2>
        {content}
      </article>
    </section>
  )

  if (isThreadPending) {
    return renderThreadWrapper(<ForumMessage text="Loading posts..." />)
  }

  if (isThreadError) {
    const message = threadError instanceof Error ? threadError.message : 'Failed to load thread'

    return renderThreadWrapper(<ForumMessage text={`Error: ${message}`} variant="error" />)
  }

  if (threadResult.kind === 'failure') {
    return renderThreadWrapper(<ForumMessage text={`Error: ${threadResult.error}`} variant="error" />)
  }

  if (threadResult.kind === 'success') {
    return renderThreadWrapper(
      <ThreadContent
        threadData={threadResult.data}
        currentPage={currentPage}
        onPreviousPage={() => goToPage(currentPage - 1)}
        onNextPage={() => goToPage(currentPage + 1)}
      />
    )
  }

  return assertNever(threadResult)
}
