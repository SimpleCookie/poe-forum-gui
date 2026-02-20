type ForumPagerProps = {
  currentPage: number
  onPreviousPage: () => void
  onNextPage: () => void
  isPreviousDisabled: boolean
  isNextDisabled: boolean
  totalPages?: number
  onFirstPage?: () => void
  onLastPage?: () => void
  isFirstDisabled?: boolean
  isLastDisabled?: boolean
}

export const ForumPager = ({
  currentPage,
  onPreviousPage,
  onNextPage,
  isPreviousDisabled,
  isNextDisabled,
  totalPages,
  onFirstPage,
  onLastPage,
  isFirstDisabled,
  isLastDisabled,
}: ForumPagerProps) => {
  return (
    <div className="forum-pager">
      {onFirstPage ? (
        <button type="button" onClick={onFirstPage} disabled={isFirstDisabled ?? isPreviousDisabled}>
          First
        </button>
      ) : null}
      <button type="button" onClick={onPreviousPage} disabled={isPreviousDisabled}>
        Previous
      </button>
      <span>{typeof totalPages === 'number' ? `Page ${currentPage} of ${totalPages}` : `Page ${currentPage}`}</span>
      <button type="button" onClick={onNextPage} disabled={isNextDisabled}>
        Next
      </button>
      {onLastPage ? (
        <button type="button" onClick={onLastPage} disabled={isLastDisabled ?? isNextDisabled}>
          Last
        </button>
      ) : null}
    </div>
  )
}
