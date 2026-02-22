import { setBaseUrl, v5 } from '@devgroup.se/poe-forum-api'
import type {
  ApiResult,
  CategoryResponse,
  ForumCategoryGroups,
  ThreadResponse,
} from '@/features/forum/types/forum'

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

if (configuredApiBaseUrl?.length) {
  setBaseUrl(configuredApiBaseUrl)
}

const getErrorMessage = (status: number, data: unknown) => {
  if (data && typeof data === 'object' && 'error' in data) {
    const error = (data as { error?: unknown }).error

    if (typeof error === 'string' && error.length > 0) {
      return error
    }
  }

  return `Request failed with status ${status}`
}

const fetchJson = async <T>(request: () => Promise<{ status: number; data: unknown }>): Promise<ApiResult<T>> => {
  try {
    const response = await request()

    if (response.status < 200 || response.status >= 300) {
      return {
        kind: 'failure',
        status: response.status,
        error: getErrorMessage(response.status, response.data),
      }
    }

    return {
      kind: 'success',
      status: response.status,
      data: response.data as T,
    }
  } catch (error) {
    return {
      kind: 'failure',
      status: 0,
      error: error instanceof Error ? error.message : 'Network request failed',
    }
  }
}

export const getForumCategories = () => fetchJson<ForumCategoryGroups>(() => v5.getCategories())

export const getForumCategory = (slug: string, page: number) =>
  fetchJson<CategoryResponse>(() => v5.getCategory(slug, { page: String(page) }))

export const getForumThread = (threadId: string, page: number) =>
  fetchJson<ThreadResponse>(() => v5.getThread(threadId, String(page)))
