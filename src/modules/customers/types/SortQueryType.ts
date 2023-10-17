import OrderQueryType from '@shared/infra/types/OrderQueryType'

type ColumnSortType = 'createdAt'

// eslint-disable-next-line prettier/prettier
type SortQueryType = `${ColumnSortType}:${OrderQueryType}`

const arraySorts = [
  'createdAt:ASC',
  'createdAt:DESC',
] as SortQueryType[]

export {
  SortQueryType,
  ColumnSortType,
  OrderQueryType,
  arraySorts,
}
