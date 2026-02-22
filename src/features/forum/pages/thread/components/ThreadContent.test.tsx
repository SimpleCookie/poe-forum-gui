import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { ThreadResponse } from '@/features/forum/types/forum'
import { ThreadContent } from './ThreadContent'

const createThreadData = (pagination: ThreadResponse['pagination']): ThreadResponse => ({
  threadId: '3912574',
  posts: [],
  pagination,
})

describe('ThreadContent pagination', () => {
  it('handles controls correctly on page 1', async () => {
    const user = userEvent.setup()
    const onPreviousPage = vi.fn()
    const onNextPage = vi.fn()
    const onFirstPage = vi.fn()
    const onLastPage = vi.fn()

    render(
      <ThreadContent
        threadData={createThreadData({
          page: 1,
          totalPages: 5,
          hasNext: true,
          hasPrevious: false,
          pageSize: 20,
        })}
        currentPage={1}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        onFirstPage={onFirstPage}
        onLastPage={onLastPage}
      />
    )

    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument()

    const firstButton = screen.getByRole('button', { name: 'First' })
    const previousButton = screen.getByRole('button', { name: 'Previous' })
    const nextButton = screen.getByRole('button', { name: 'Next' })
    const lastButton = screen.getByRole('button', { name: 'Last' })

    expect(firstButton).toBeDisabled()
    expect(previousButton).toBeDisabled()
    expect(nextButton).toBeEnabled()
    expect(lastButton).toBeEnabled()

    await user.click(nextButton)
    await user.click(lastButton)

    expect(onNextPage).toHaveBeenCalledTimes(1)
    expect(onLastPage).toHaveBeenCalledTimes(1)
    expect(onPreviousPage).not.toHaveBeenCalled()
    expect(onFirstPage).not.toHaveBeenCalled()
  })

  it('handles controls correctly on page 3', async () => {
    const user = userEvent.setup()
    const onPreviousPage = vi.fn()
    const onNextPage = vi.fn()
    const onFirstPage = vi.fn()
    const onLastPage = vi.fn()

    render(
      <ThreadContent
        threadData={createThreadData({
          page: 3,
          totalPages: 5,
          hasNext: true,
          hasPrevious: true,
          pageSize: 20,
        })}
        currentPage={3}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        onFirstPage={onFirstPage}
        onLastPage={onLastPage}
      />
    )

    expect(screen.getByText('Page 3 of 5')).toBeInTheDocument()

    const firstButton = screen.getByRole('button', { name: 'First' })
    const previousButton = screen.getByRole('button', { name: 'Previous' })
    const nextButton = screen.getByRole('button', { name: 'Next' })
    const lastButton = screen.getByRole('button', { name: 'Last' })

    expect(firstButton).toBeEnabled()
    expect(previousButton).toBeEnabled()
    expect(nextButton).toBeEnabled()
    expect(lastButton).toBeEnabled()

    await user.click(firstButton)
    await user.click(previousButton)
    await user.click(nextButton)
    await user.click(lastButton)

    expect(onFirstPage).toHaveBeenCalledTimes(1)
    expect(onPreviousPage).toHaveBeenCalledTimes(1)
    expect(onNextPage).toHaveBeenCalledTimes(1)
    expect(onLastPage).toHaveBeenCalledTimes(1)
  })

  it('handles controls correctly on last page', async () => {
    const user = userEvent.setup()
    const onPreviousPage = vi.fn()
    const onNextPage = vi.fn()
    const onFirstPage = vi.fn()
    const onLastPage = vi.fn()

    render(
      <ThreadContent
        threadData={createThreadData({
          page: 5,
          totalPages: 5,
          hasNext: false,
          hasPrevious: true,
          pageSize: 20,
        })}
        currentPage={5}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        onFirstPage={onFirstPage}
        onLastPage={onLastPage}
      />
    )

    expect(screen.getByText('Page 5 of 5')).toBeInTheDocument()

    const firstButton = screen.getByRole('button', { name: 'First' })
    const previousButton = screen.getByRole('button', { name: 'Previous' })
    const nextButton = screen.getByRole('button', { name: 'Next' })
    const lastButton = screen.getByRole('button', { name: 'Last' })

    expect(firstButton).toBeEnabled()
    expect(previousButton).toBeEnabled()
    expect(nextButton).toBeDisabled()
    expect(lastButton).toBeDisabled()

    await user.click(firstButton)
    await user.click(previousButton)

    expect(onFirstPage).toHaveBeenCalledTimes(1)
    expect(onPreviousPage).toHaveBeenCalledTimes(1)
    expect(onNextPage).not.toHaveBeenCalled()
    expect(onLastPage).not.toHaveBeenCalled()
  })
})
