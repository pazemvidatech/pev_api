import { CreatedAtSortQueryType } from '@shared/types/CreatedAtSortQueryType'

export default interface IPaginationDTO {
  order: CreatedAtSortQueryType
  page: number
  limit: number
}
