import { useEffect, useState } from 'react'
import { getForumCategories } from '../../api/forumApi'
import type { ForumCategoryGroups } from '../../types/forum'
import HomeContent from './components/HomeContent'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)
  const [categories, setCategories] = useState<ForumCategoryGroups | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await getForumCategories()
        setResponseStatus(response.status)
        setCategories(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories')
      } finally {
        setIsLoading(false)
      }
    }

    void loadCategories()
  }, [])

  if (isLoading) {
    return <p className="forum-message">Loading forum categories...</p>
  }

  if (error) {
    return <p className="forum-message error">Error: {error}</p>
  }

  return (
    <HomeContent
      responseStatus={responseStatus}
      categories={categories}
    />
  )
}
