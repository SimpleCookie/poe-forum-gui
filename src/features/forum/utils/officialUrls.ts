const OFFICIAL_POE_BASE_URL = 'https://www.pathofexile.com'

const toProfileSlug = (author: string) => author.trim().replace(/#/g, '-')

export const officialUrls = {
  profile: (author: string) =>
    `${OFFICIAL_POE_BASE_URL}/account/view-profile/${encodeURIComponent(toProfileSlug(author))}`,
  quote: (threadId: string, postId: string) =>
    `${OFFICIAL_POE_BASE_URL}/forum/post-reply/${threadId}/quote/${postId}`,
  threadPost: (threadId: string, page: number, postId: string) =>
    `${OFFICIAL_POE_BASE_URL}/forum/view-thread/${threadId}/page/${page}#p${postId}`,
}
