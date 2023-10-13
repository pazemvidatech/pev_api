import OrderQueryType from '@shared/infra/types/OrderQueryType'

type CreatedAtColumnSortType = 'created_at'

// eslint-disable-next-line prettier/prettier
type CreatedAtSortQueryType = `${CreatedAtColumnSortType}:${OrderQueryType}`

const arrayCreatedAtSorts = [
  'created_at:ASC',
  'created_at:DESC',
] as CreatedAtSortQueryType[]

export {
  CreatedAtSortQueryType,
  CreatedAtColumnSortType,
  OrderQueryType,
  arrayCreatedAtSorts,
}
