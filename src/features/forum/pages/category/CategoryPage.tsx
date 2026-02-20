import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { getForumCategory } from '../../api/forumApi'
import ForumMessage from '../../components/ForumMessage'
import { assertNever } from '../../utils/assertNever'
import CategoryContent from './components/CategoryContent'

export default function CategoryPage() {
  const { slug } = useParams({ from: '/category/$slug' })
  const search = useSearch({ from: '/category/$slug' })
  const currentPage = search.page
  const categoryName = search.name
  const navigate = useNavigate({ from: '/category/$slug' })

  const {
    isPending: isCategoryPending,
    isError: isCategoryError,
    error: categoryError,
    data: categoryResult,
  } = useQuery({
    queryKey: ['forum', 'category', slug, currentPage],
    queryFn: () => getForumCategory(slug, currentPage),
  })

  const goToPage = (nextPage: number) => {
    void navigate({
      to: '/category/$slug',
      params: { slug },
      search: (prev) => ({ ...prev, page: nextPage }),
    })
  }

  const renderCategoryWrapper = (content: ReactNode) => (
    <section className="forum-board">
      <div className="forum-status">
        <Link to="/">← All categories</Link>
      </div>
      <article className="forum-group">
        <h2>{categoryName || `Category: ${slug}`}</h2>
        {content}
      </article>
    </section>
  )

  if (isCategoryPending) {
    return renderCategoryWrapper(<ForumMessage text="Loading threads..." />)
  }

  if (isCategoryError) {
    const message = categoryError instanceof Error ? categoryError.message : 'Failed to load category'

    return renderCategoryWrapper(<ForumMessage text={`Error: ${message}`} variant="error" />)
  }

  if (categoryResult.kind === 'failure') {
    return renderCategoryWrapper(
      <ForumMessage text={`Error: ${categoryResult.error}`} variant="error" />
    )
  }

  if (categoryResult.kind === 'success') {
    return renderCategoryWrapper(
      <CategoryContent
        threads={categoryResult.data.threads}
        currentPage={currentPage}
        categorySlug={slug}
        onPreviousPage={() => goToPage(currentPage - 1)}
        onNextPage={() => goToPage(currentPage + 1)}
      />
    )
  }

  return assertNever(categoryResult)
}
