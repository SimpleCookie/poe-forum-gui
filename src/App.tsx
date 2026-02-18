import { useEffect, useState } from 'react'
import { getGetCategoriesUrl } from '@devgroup.se/poe-forum-api'
import './App.css'

type ForumCategory = {
  name: string
  slug: string
  endpoint: string
  sourceUrl: string
}

type ForumCategoryGroups = Record<string, ForumCategory[]>

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

const resolveApiUrl = (generatedUrl: string) => {
  const parsedGeneratedUrl = new URL(generatedUrl)
  const targetBaseUrl = configuredApiBaseUrl?.length
    ? configuredApiBaseUrl
    : window.location.origin

  return new URL(
    `${parsedGeneratedUrl.pathname}${parsedGeneratedUrl.search}`,
    targetBaseUrl,
  ).toString()
}

const getCategories = async () => {
  const res = await fetch(resolveApiUrl(getGetCategoriesUrl()), {
    method: 'GET',
  })

  const body = [204, 205, 304].includes(res.status) ? null : await res.text()
  const data = body ? JSON.parse(body) : {}

  return { data, status: res.status, headers: res.headers }
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)
  const [categories, setCategories] = useState<ForumCategoryGroups | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await getCategories()
        setResponseStatus(response.status)
        setCategories(response.data as ForumCategoryGroups)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories')
      } finally {
        setIsLoading(false)
      }
    }

    void loadCategories()
  }, [])

  return (
    <main className="forum-app">
      <header className="forum-header">
        <h1>Path of Exile Forums</h1>
        <p className="forum-subtitle">Browse announcements and patch notes by game</p>
      </header>

      {isLoading ? (
        <p className="forum-message">Loading forum categories...</p>
      ) : error ? (
        <p className="forum-message error">Error: {error}</p>
      ) : (
        <section className="forum-board">
          <div className="forum-status">
            API status: <strong>{responseStatus}</strong>
          </div>

          {Object.entries(categories ?? {}).map(([group, items]) => (
            <article className="forum-group" key={group}>
              <h2>{group === 'poe1' ? 'Path of Exile 1' : group === 'poe2' ? 'Path of Exile 2' : group}</h2>

              <ul className="forum-list">
                {items.map((item) => (
                  <li className="forum-row" key={`${group}-${item.slug}`}>
                    <div className="forum-row-main">
                      <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                        {item.name}
                      </a>
                      <span className="forum-slug">/{item.slug}</span>
                    </div>
                    <a className="forum-endpoint" href={item.endpoint}>
                      {item.endpoint}
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      )}

      <p className="forum-footer">
        Data source: <strong>@devgroup.se/poe-forum-api</strong>
      </p>
    </main>
  )
}

export default App
