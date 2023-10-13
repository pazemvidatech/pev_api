import OrderQueryType from '@shared/infra/types/OrderQueryType'

type CorrectionColumnSortType = 'createdAt'

// eslint-disable-next-line prettier/prettier
type CorrectionSortQueryType = `${CorrectionColumnSortType}:${OrderQueryType}`

const arrayCorrectionSorts = [
  'createdAt:ASC',
  'createdAt:DESC',
] as CorrectionSortQueryType[]

export {
  CorrectionSortQueryType,
  CorrectionColumnSortType,
  OrderQueryType,
  arrayCorrectionSorts,
}
