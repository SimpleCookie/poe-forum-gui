import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { getForumThread } from '../../api/forumApi'
import ThreadContent from './components/ThreadContent'

export default function ThreadPage() {
  const { threadId } = useParams({ from: '/thread/$threadId' })
  const search = useSearch({ from: '/thread/$threadId' })
  const categorySlug = search.category
  const currentPage = search.page
  const navigate = useNavigate({ from: '/thread/$threadId' })

  const threadQuery = useQuery({
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

  return (
    <section className="forum-board">
      <div className="forum-status">{renderBackLink()}</div>
      <article className="forum-group">
        <h2>Thread #{threadId}</h2>
        <ThreadContent
          isLoading={threadQuery.isPending}
          error={
            threadQuery.isError
              ? threadQuery.error instanceof Error
                ? threadQuery.error.message
                : 'Failed to load thread'
              : undefined
          }
          threadData={threadQuery.data?.data}
          currentPage={currentPage}
          onPreviousPage={() => goToPage(currentPage - 1)}
          onNextPage={() => goToPage(currentPage + 1)}
        />
      </article>
    </section>
  )
}
