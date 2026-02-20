import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PostToolbar } from './PostToolbar'

describe('PostToolbar', () => {
  beforeEach(() => {
    Object.defineProperty(window.navigator, 'clipboard', {
      get: () => ({
        writeText: vi.fn().mockResolvedValue(undefined),
      }),
      configurable: true,
    })
  })

  it('renders official quote and view links', () => {
    render(<PostToolbar threadId="3912574" page={3} postId="p26573846" author="newbutnot#7699" />)

    expect(screen.getByLabelText('Quote post')).toHaveAttribute(
      'href',
      'https://www.pathofexile.com/forum/post-reply/3912574/quote/26573846'
    )

    expect(screen.getByLabelText('View original post')).toHaveAttribute(
      'href',
      'https://www.pathofexile.com/forum/view-thread/3912574/page/3#p26573846'
    )
  })

  it('copies app link and shows copied tooltip', async () => {
    const user = userEvent.setup()

    render(<PostToolbar threadId="3912574" page={3} postId="p26573846" author="newbutnot#7699" />)

    await user.click(screen.getByLabelText('Copy post link'))

    expect(await screen.findByText('Copied')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('Copied')).not.toBeInTheDocument()
    }, { timeout: 2000 })
  })
})
