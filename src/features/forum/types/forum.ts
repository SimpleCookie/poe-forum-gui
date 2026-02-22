import type { Pageable, PostV5, ThreadResponseV5 } from '@devgroup.se/poe-forum-api'

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

export type ThreadPost = PostV5

export type ThreadPagination = Pageable

export type ThreadResponse = ThreadResponseV5

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
