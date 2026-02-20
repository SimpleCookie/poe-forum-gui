type ForumPagerProps = {
  currentPage: number
  onPreviousPage: () => void
  onNextPage: () => void
  isPreviousDisabled: boolean
  isNextDisabled: boolean
}

export const ForumPager = ({
  currentPage,
  onPreviousPage,
  onNextPage,
  isPreviousDisabled,
  isNextDisabled,
}: ForumPagerProps) => {
  return (
    <div className="forum-pager">
      <button type="button" onClick={onPreviousPage} disabled={isPreviousDisabled}>
        Previous
      </button>
      <span>Page {currentPage}</span>
      <button type="button" onClick={onNextPage} disabled={isNextDisabled}>
        Next
      </button>
    </div>
  )
}
