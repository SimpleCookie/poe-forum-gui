import { useQuery } from '@tanstack/react-query'
import { getForumCategories } from '../../api/forumApi'
import ForumMessage from '../../components/ForumMessage'
import { assertNever } from '../../utils/assertNever'
import HomeContent from './components/HomeContent'

export default function HomePage() {
  const {
    isPending: isHomePending,
    isError: isHomeError,
    error: homeError,
    data: categoriesResult,
  } = useQuery({
    queryKey: ['forum', 'categories'],
    queryFn: getForumCategories,
  })

  if (isHomePending) {
    return <ForumMessage text="Loading forum categories..." />
  }

  if (isHomeError) {
    const message = homeError instanceof Error ? homeError.message : 'Failed to load categories'
    return <ForumMessage text={`Error: ${message}`} variant="error" />
  }

  if (categoriesResult.kind === 'failure') {
    return <ForumMessage text={`Error: ${categoriesResult.error}`} variant="error" />
  }

  if (categoriesResult.kind === 'success') {
    return (
      <HomeContent responseStatus={categoriesResult.status} categories={categoriesResult.data} />
    )
  }

  return assertNever(categoriesResult)
}
