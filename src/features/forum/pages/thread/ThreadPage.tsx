import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { getForumThread } from '../../api/forumApi'
import type { ThreadResponse } from '../../types/forum'
import ThreadContent from './components/ThreadContent'

export default function ThreadPage() {
  const { threadId } = useParams({ from: '/thread/$threadId' })
  const search = useSearch({ from: '/thread/$threadId' })
  const categorySlug = search.category
  const currentPage = search.page
  const navigate = useNavigate({ from: '/thread/$threadId' })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [threadData, setThreadData] = useState<ThreadResponse | null>(null)

  useEffect(() => {
    const loadThread = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await getForumThread(threadId, currentPage)
        setThreadData(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load thread')
      } finally {
        setIsLoading(false)
      }
    }

    void loadThread()
  }, [threadId, currentPage])

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
          isLoading={isLoading}
          error={error}
          threadData={threadData}
          currentPage={currentPage}
          onPreviousPage={() => goToPage(currentPage - 1)}
          onNextPage={() => goToPage(currentPage + 1)}
        />
      </article>
    </section>
  )
}
