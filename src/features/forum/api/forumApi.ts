import { setBaseUrl, v4 } from '@devgroup.se/poe-forum-api'
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

const hasText = (value: string) => value.trim().length > 0

const hasPostMetadata = (post: ThreadResponse['posts'][number]) =>
  hasText(post.postId) && hasText(post.author) && hasText(post.createdAt)

const isGggAuthor = (author: string) => /_GGG(?:#\d+)?$/i.test(author.trim())

const shouldMergeSplitPostRows = (
  first: ThreadResponse['posts'][number],
  second: ThreadResponse['posts'][number]
) => {
  if (first.threadId !== second.threadId) {
    return false
  }

  const firstHasContent = hasText(first.content)
  const secondHasContent = hasText(second.content)

  if (firstHasContent === secondHasContent) {
    return false
  }

  const firstHasMetadata = hasPostMetadata(first)
  const secondHasMetadata = hasPostMetadata(second)

  if (firstHasMetadata === secondHasMetadata) {
    return false
  }

  const metadataPost = firstHasMetadata ? first : second

  return isGggAuthor(metadataPost.author)
}

const mergeSplitPostRows = (
  first: ThreadResponse['posts'][number],
  second: ThreadResponse['posts'][number]
): ThreadResponse['posts'][number] => {
  const content = hasText(first.content)
    ? first.content
    : hasText(second.content)
      ? second.content
      : first.content

  return {
    ...first,
    ...second,
    postId: hasText(first.postId) ? first.postId : second.postId,
    author: hasText(first.author) ? first.author : second.author,
    createdAt: hasText(first.createdAt) ? first.createdAt : second.createdAt,
    content,
    indexOnPage: Math.min(first.indexOnPage, second.indexOnPage),
  }
}

const normalizeThreadResponse = (threadResponse: ThreadResponse): ThreadResponse => {
  const normalizedPosts: ThreadResponse['posts'] = []

  for (let index = 0; index < threadResponse.posts.length; index += 1) {
    const currentPost = threadResponse.posts[index]
    const nextPost = threadResponse.posts[index + 1]

    if (nextPost && shouldMergeSplitPostRows(currentPost, nextPost)) {
      normalizedPosts.push(mergeSplitPostRows(currentPost, nextPost))
      index += 1
      continue
    }

    normalizedPosts.push(currentPost)
  }

  return {
    ...threadResponse,
    posts: normalizedPosts,
  }
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

export const getForumCategories = () => fetchJson<ForumCategoryGroups>(() => v4.getCategories())

export const getForumCategory = (slug: string, page: number) =>
  fetchJson<CategoryResponse>(() => v4.getCategory(slug, { page: String(page) }))

export const getForumThread = (threadId: string, page: number) =>
  fetchJson<ThreadResponse>(() => v4.getThread(threadId, String(page))).then((result) => {
    if (result.kind === 'failure') {
      return result
    }

    return {
      ...result,
      data: normalizeThreadResponse(result.data),
    }
  })
