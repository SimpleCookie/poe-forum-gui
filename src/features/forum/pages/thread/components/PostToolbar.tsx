import { useEffect, useState } from 'react'
import { officialUrls } from '../../../utils/officialUrls'
import { LinkIcon } from './icons/LinkIcon'
import { QuoteIcon } from './icons/QuoteIcon'
import { ViewIcon } from './icons/ViewIcon'

type PostToolbarProps = {
  threadId: string
  page: number
  postId: string
  author: string
}

const normalizePostId = (postId: string) => postId.replace(/^p/, '')

export const PostToolbar = ({ threadId, page, postId, author }: PostToolbarProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const normalizedPostId = normalizePostId(postId)

  const quoteUrl = officialUrls.quote(threadId, normalizedPostId)
  const viewUrl = officialUrls.threadPost(threadId, page, normalizedPostId)

  const copyPostLink = async () => {
    const appPostLink = `${window.location.origin}/thread/${threadId}?page=${page}#post-${normalizedPostId}`

    try {
      await navigator.clipboard.writeText(appPostLink)
      setIsCopied(true)
    } catch {
      setIsCopied(false)
    }
  }

  useEffect(() => {
    if (!isCopied) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setIsCopied(false)
    }, 1200)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isCopied])

  return (
    <div className="post-toolbar" role="toolbar" aria-label={`Actions for ${author}`}>
      <a
        className="post-toolbar-button"
        href={quoteUrl}
        target="_blank"
        rel="noreferrer"
        title="Quote on official forum"
        aria-label="Quote post"
      >
        <QuoteIcon />
      </a>
      <a
        className="post-toolbar-button"
        href={viewUrl}
        target="_blank"
        rel="noreferrer"
        title="View original post"
        aria-label="View original post"
      >
        <ViewIcon />
      </a>
      <div className="post-toolbar-item">
        {isCopied ? <span className="post-toolbar-tooltip">Copied</span> : null}
        <button
          type="button"
          className="post-toolbar-button"
          onClick={copyPostLink}
          title="Copy link to this post on this app"
          aria-label="Copy post link"
        >
          <LinkIcon />
        </button>
      </div>
    </div>
  )
}
