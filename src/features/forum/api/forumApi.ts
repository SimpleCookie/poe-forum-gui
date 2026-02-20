import { getGetCategoriesUrl, getGetCategoryUrl, getGetThreadUrl } from '@devgroup.se/poe-forum-api'
import type { CategoryResponse, ForumCategoryGroups, ThreadResponse } from '../types/forum'

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

const resolveApiUrl = (generatedUrl: string) => {
  const parsedGeneratedUrl = new URL(generatedUrl)
  const targetBaseUrl = configuredApiBaseUrl?.length ? configuredApiBaseUrl : window.location.origin

  return new URL(
    `${parsedGeneratedUrl.pathname}${parsedGeneratedUrl.search}`,
    targetBaseUrl
  ).toString()
}

const fetchJson = async <T>(generatedUrl: string): Promise<{ data: T; status: number }> => {
  const res = await fetch(resolveApiUrl(generatedUrl), { method: 'GET' })

  if (!res.ok) {
    const message = await res.text()
    throw new Error(message || `Request failed with status ${res.status}`)
  }

  const body = [204, 205, 304].includes(res.status) ? null : await res.text()
  const data = (body ? JSON.parse(body) : {}) as T

  return { data, status: res.status }
}

export const getForumCategories = () => fetchJson<ForumCategoryGroups>(getGetCategoriesUrl())

export const getForumCategory = (slug: string, page: number) =>
  fetchJson<CategoryResponse>(getGetCategoryUrl(slug, { page: String(page) }))

export const getForumThread = (threadId: string, page: number) =>
  fetchJson<ThreadResponse>(getGetThreadUrl(threadId, { page: String(page) }))
