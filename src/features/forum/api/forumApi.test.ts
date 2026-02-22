import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ThreadResponse } from '@/features/forum/types/forum'

vi.mock('@devgroup.se/poe-forum-api', () => ({
  setBaseUrl: vi.fn(),
  v4: {
    getCategories: vi.fn(),
    getCategory: vi.fn(),
    getThread: vi.fn(),
  },
}))

import { v4 } from '@devgroup.se/poe-forum-api'
import { getForumThread } from './forumApi'

const mockedGetThread = vi.mocked(v4.getThread)

const createThreadResponse = (posts: ThreadResponse['posts']): ThreadResponse => ({
  threadId: '3912574',
  posts,
  pagination: {
    page: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
    pageSize: 20,
  },
})

describe('getForumThread', () => {
  beforeEach(() => {
    mockedGetThread.mockReset()
  })

  it('merges split first news post rows', async () => {
    mockedGetThread.mockResolvedValue({
      status: 200,
      headers: new Headers(),
      data: createThreadResponse([
        {
          postId: '',
          threadId: '3912574',
          author: '',
          createdAt: '',
          content: '<div>GGG announcement body</div>',
          indexOnPage: 1,
        },
        {
          postId: 'p26573837',
          threadId: '3912574',
          author: 'Natalia_GGG',
          createdAt: '2026-02-19T21:02:23.000Z',
          content: '',
          indexOnPage: 2,
        },
      ]),
    })

    const result = await getForumThread('3912574', 1)

    expect(result.kind).toBe('success')
    if (result.kind === 'failure') {
      throw new Error('Expected success result')
    }

    expect(result.data.posts).toHaveLength(1)
    expect(result.data.posts[0]).toMatchObject({
      postId: 'p26573837',
      author: 'Natalia_GGG',
      createdAt: '2026-02-19T21:02:23.000Z',
      content: '<div>GGG announcement body</div>',
      indexOnPage: 1,
    })
  })

  it('keeps regular posts unchanged', async () => {
    const posts: ThreadResponse['posts'] = [
      {
        postId: 'p1',
        threadId: '3912574',
        author: 'AuthorOne#0001',
        createdAt: '2026-02-19T21:04:54.000Z',
        content: 'Hello',
        indexOnPage: 1,
      },
      {
        postId: 'p2',
        threadId: '3912574',
        author: 'AuthorTwo#0002',
        createdAt: '2026-02-19T21:05:06.000Z',
        content: 'World',
        indexOnPage: 2,
      },
    ]

    mockedGetThread.mockResolvedValue({
      status: 200,
      headers: new Headers(),
      data: createThreadResponse(posts),
    })

    const result = await getForumThread('3912574', 1)

    expect(result.kind).toBe('success')
    if (result.kind === 'failure') {
      throw new Error('Expected success result')
    }

    expect(result.data.posts).toEqual(posts)
  })

  it('does not merge split rows for non-GGG authors', async () => {
    mockedGetThread.mockResolvedValue({
      status: 200,
      headers: new Headers(),
      data: createThreadResponse([
        {
          postId: '',
          threadId: '3912574',
          author: '',
          createdAt: '',
          content: '<div>Regular user content row</div>',
          indexOnPage: 1,
        },
        {
          postId: 'p26573899',
          threadId: '3912574',
          author: 'RegularUser#1234',
          createdAt: '2026-02-19T21:02:23.000Z',
          content: '',
          indexOnPage: 2,
        },
      ]),
    })

    const result = await getForumThread('3912574', 1)

    expect(result.kind).toBe('success')
    if (result.kind === 'failure') {
      throw new Error('Expected success result')
    }

    expect(result.data.posts).toHaveLength(2)
    expect(result.data.posts[0].content).toBe('<div>Regular user content row</div>')
    expect(result.data.posts[1].author).toBe('RegularUser#1234')
  })
})
