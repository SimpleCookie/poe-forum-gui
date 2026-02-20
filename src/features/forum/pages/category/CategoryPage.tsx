import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { getForumCategory } from '../../api/forumApi'
import CategoryContent from './components/CategoryContent'

export default function CategoryPage() {
  const { slug } = useParams({ from: '/category/$slug' })
  const search = useSearch({ from: '/category/$slug' })
  const currentPage = search.page
  const categoryName = search.name
  const navigate = useNavigate({ from: '/category/$slug' })

  const categoryQuery = useQuery({
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

  return (
    <section className="forum-board">
      <div className="forum-status">
        <Link to="/">← All categories</Link>
      </div>
      <article className="forum-group">
        <h2>{categoryName || `Category: ${slug}`}</h2>
        <CategoryContent
          isLoading={categoryQuery.isPending}
          error={
            categoryQuery.isError
              ? categoryQuery.error instanceof Error
                ? categoryQuery.error.message
                : 'Failed to load category'
              : undefined
          }
          threads={categoryQuery.data?.data.threads ?? []}
          currentPage={currentPage}
          categorySlug={slug}
          onPreviousPage={() => goToPage(currentPage - 1)}
          onNextPage={() => goToPage(currentPage + 1)}
        />
      </article>
    </section>
  )
}
