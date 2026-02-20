import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { CategoryThreadRow } from './CategoryThreadRow'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a href="#">{children}</a>,
}))

describe('CategoryThreadRow', () => {
  it('renders title, thread id, and replies count', () => {
    render(
      <ul>
        <CategoryThreadRow
          categorySlug="news"
          thread={{
            threadId: '3912574',
            title: 'Watch GGG Live on February 26 (PST)',
            replies: 84,
          }}
        />
      </ul>
    )

    expect(screen.getByRole('link', { name: 'Watch GGG Live on February 26 (PST)' })).toBeInTheDocument()
    expect(screen.getByText('Thread #3912574')).toBeInTheDocument()
    expect(screen.getByText('Replies: 84')).toBeInTheDocument()
  })
})
