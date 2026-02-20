import { useQuery } from '@tanstack/react-query'
import { getForumCategories } from '../../api/forumApi'
import ForumMessage from '../../components/ForumMessage'
import HomeContent from './components/HomeContent'

export default function HomePage() {
  const categoriesQuery = useQuery({
    queryKey: ['forum', 'categories'],
    queryFn: getForumCategories,
  })

  if (categoriesQuery.isPending) {
    return <ForumMessage text="Loading forum categories..." />
  }

  if (categoriesQuery.isError) {
    const message =
      categoriesQuery.error instanceof Error
        ? categoriesQuery.error.message
        : 'Failed to load categories'

    return <ForumMessage text={`Error: ${message}`} variant="error" />
  }

  return (
    <HomeContent
      responseStatus={categoriesQuery.data.status}
      categories={categoriesQuery.data.data}
    />
  )
}
