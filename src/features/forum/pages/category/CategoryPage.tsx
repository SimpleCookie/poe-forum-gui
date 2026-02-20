import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { getForumCategory } from '../../api/forumApi'
import type { CategoryResponse } from '../../types/forum'
import CategoryContent from './components/CategoryContent'

export default function CategoryPage() {
  const { slug } = useParams({ from: '/category/$slug' })
  const search = useSearch({ from: '/category/$slug' })
  const currentPage = search.page
  const categoryName = search.name
  const navigate = useNavigate({ from: '/category/$slug' })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryData, setCategoryData] = useState<CategoryResponse | null>(null)

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await getForumCategory(slug, currentPage)
        setCategoryData(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load category')
      } finally {
        setIsLoading(false)
      }
    }

    void loadCategory()
  }, [slug, currentPage])

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
          isLoading={isLoading}
          error={error}
          threads={categoryData?.threads ?? []}
          currentPage={currentPage}
          categorySlug={slug}
          onPreviousPage={() => goToPage(currentPage - 1)}
          onNextPage={() => goToPage(currentPage + 1)}
        />
      </article>
    </section>
  )
}
