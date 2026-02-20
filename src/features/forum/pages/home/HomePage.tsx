import { useQuery } from '@tanstack/react-query'
import { getForumCategories } from '../../api/forumApi'
import HomeContent from './components/HomeContent'

export default function HomePage() {
  const categoriesQuery = useQuery({
    queryKey: ['forum', 'categories'],
    queryFn: getForumCategories,
  })

  if (categoriesQuery.isPending) {
    return <p className="forum-message">Loading forum categories...</p>
  }

  if (categoriesQuery.isError) {
    const message =
      categoriesQuery.error instanceof Error
        ? categoriesQuery.error.message
        : 'Failed to load categories'

    return <p className="forum-message error">Error: {message}</p>
  }

  return (
    <HomeContent
      responseStatus={categoriesQuery.data.status}
      categories={categoriesQuery.data.data}
    />
  )
}
