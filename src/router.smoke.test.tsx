import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAppQueryClient } from '@/app/queryClient'
import { router } from '@/app/router'

const categoriesResponse = {
  poe1: [
    {
      name: 'Announcements',
      slug: 'news',
      endpoint: '/api/category/news',
      sourceUrl: 'https://www.pathofexile.com/forum/view-forum/news',
    },
  ],
  poe2: [],
}

const categoryResponse = {
  category: 'news',
  page: 1,
  threads: [
    {
      threadId: '3912574',
      title: 'Watch GGG Live on February 26 (PST)',
      replies: 84,
    },
  ],
}

const threadResponse = {
  threadId: '3912574',
  posts: [
    {
      threadId: '3912574',
      indexOnPage: 1,
      contentText: 'LOGIN',
      contentHtml: 'LOGIN',
      author: 'cennythaking#4769',
      createdAt: '2026-02-19T12:04:54.000Z',
      postId: 'p26573846',
    },
  ],
  pagination: {
    page: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
    pageSize: 20,
  },
}

describe('forum router smoke test', () => {
  const renderApp = () => {
    const queryClient = createAppQueryClient()

    return render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    )
  }

  beforeEach(async () => {
    window.history.replaceState({}, '', '/')
    await router.navigate({ to: '/' })

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
        const pathname = new URL(url).pathname

        if (pathname === '/api/v3/categories') {
          return new Response(JSON.stringify(categoriesResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        if (pathname === '/api/v3/category/news') {
          return new Response(JSON.stringify(categoryResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        if (pathname === '/api/v3/thread/3912574') {
          return new Response(JSON.stringify(threadResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        return new Response('Not found', { status: 404 })
      })
    )
  })

  it('renders categories, navigates to thread list, then renders posts', async () => {
    const user = userEvent.setup()

    renderApp()

    expect(await screen.findByText('Announcements')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Announcements' }))

    expect(await screen.findByText('Watch GGG Live on February 26 (PST)')).toBeInTheDocument()
    expect(screen.getByText('Thread #3912574')).toBeInTheDocument()
    expect(screen.getByText('Replies: 84')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Watch GGG Live on February 26 (PST)' }))

    expect(await screen.findByText('LOGIN')).toBeInTheDocument()
    expect(screen.getByText('cennythaking#4769')).toBeInTheDocument()

    await waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledTimes(3)
    })
  })

  it('shows error message when categories request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ error: 'Internal Server Error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    )

    renderApp()

    expect(await screen.findByText('Error: Internal Server Error')).toBeInTheDocument()
  })

  it('shows error message when category threads request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
        const pathname = new URL(url).pathname

        if (pathname === '/api/v3/categories') {
          return new Response(JSON.stringify(categoriesResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        if (pathname === '/api/v3/category/news') {
          return new Response(JSON.stringify({ error: 'Category fetch failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        return new Response('Not found', { status: 404 })
      })
    )

    const user = userEvent.setup()
    renderApp()

    await user.click(await screen.findByRole('link', { name: 'Announcements' }))

    expect(await screen.findByText('Error: Category fetch failed')).toBeInTheDocument()
  })
})
