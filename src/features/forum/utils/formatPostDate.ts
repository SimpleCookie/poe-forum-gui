import dayjs from 'dayjs'

export const formatPostDate = (dateIso: string) => dayjs(dateIso).format('YYYY-MM-DD, HH:mm')
