import OrderQueryType from '@shared/infra/types/OrderQueryType'

type EssayColumnSortType = 'createdAt'

// eslint-disable-next-line prettier/prettier
type EssaySortQueryType = `${EssayColumnSortType}:${OrderQueryType}`

const arrayEssaySorts = [
  'createdAt:ASC',
  'createdAt:DESC',
] as EssaySortQueryType[]

export {
  EssaySortQueryType,
  EssayColumnSortType,
  OrderQueryType,
  arrayEssaySorts,
}
