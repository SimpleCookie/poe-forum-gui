export type ForumCategory = {
  name: string
  slug: string
  endpoint: string
  sourceUrl: string
}

export type ForumCategoryGroups = Record<string, ForumCategory[]>

export type CategoryThread = {
  threadId: string
  title: string
  replies: number
}

export type CategoryResponse = {
  category: string
  page: number
  threads: CategoryThread[]
}

export type ThreadPost = {
  threadId: string
  page: number
  indexOnPage: number
  contentText: string
  author: string
  createdAt: string
  postId: string
}

export type ThreadResponse = {
  posts: ThreadPost[]
  nextPageUrl?: string
}

export type ApiSuccess<T> = {
  kind: 'success'
  status: number
  data: T
}

export type ApiFailure = {
  kind: 'failure'
  status: number
  error: string
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure
