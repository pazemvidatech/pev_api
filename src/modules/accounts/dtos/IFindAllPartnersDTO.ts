import { ColumnSortType, OrderQueryType } from '../types/SortQueryType'
import Account from '../infra/typeorm/entities/Account'
import { FindOperator } from 'typeorm'

export interface IFindAllPartnersDTO {
  where?: {
    name?: string | FindOperator<string> | null
  }
  order: {
    [key in ColumnSortType]: OrderQueryType
  }
  take: number
  skip: number
}

export interface IFindAllPartnersResponseDTO {
  data: Account[]
  total: number
}
