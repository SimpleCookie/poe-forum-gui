import { getGetCategoriesUrl, getGetCategoryUrl, getGetThreadUrl } from '@devgroup.se/poe-forum-api'
import type {
  ApiResult,
  CategoryResponse,
  ForumCategoryGroups,
  ThreadResponse,
} from '../types/forum'

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

const resolveApiUrl = (generatedUrl: string) => {
  const parsedGeneratedUrl = new URL(generatedUrl)
  const targetBaseUrl = configuredApiBaseUrl?.length ? configuredApiBaseUrl : window.location.origin

  return new URL(
    `${parsedGeneratedUrl.pathname}${parsedGeneratedUrl.search}`,
    targetBaseUrl
  ).toString()
}

const fetchJson = async <T>(generatedUrl: string): Promise<ApiResult<T>> => {
  try {
    const res = await fetch(resolveApiUrl(generatedUrl), { method: 'GET' })
    const body = [204, 205, 304].includes(res.status) ? null : await res.text()

    if (!res.ok) {
      return {
        kind: 'failure',
        status: res.status,
        error: body || `Request failed with status ${res.status}`,
      }
    }

    return {
      kind: 'success',
      status: res.status,
      data: (body ? JSON.parse(body) : {}) as T,
    }
  } catch (error) {
    return {
      kind: 'failure',
      status: 0,
      error: error instanceof Error ? error.message : 'Network request failed',
    }
  }
}

export const getForumCategories = () => fetchJson<ForumCategoryGroups>(getGetCategoriesUrl())

export const getForumCategory = (slug: string, page: number) =>
  fetchJson<CategoryResponse>(getGetCategoryUrl(slug, { page: String(page) }))

export const getForumThread = (threadId: string, page: number) =>
  fetchJson<ThreadResponse>(getGetThreadUrl(threadId, { page: String(page) }))
