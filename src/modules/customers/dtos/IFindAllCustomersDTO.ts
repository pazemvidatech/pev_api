import { ColumnSortType, OrderQueryType } from '../types/SortQueryType'
import Customer from '../infra/typeorm/entities/Customer'
import { FindOperator } from 'typeorm'

export interface IFindAllCustomersDTO {
  where?: {
    name?: string | FindOperator<string> | null
  }
  order: {
    [key in ColumnSortType]: OrderQueryType
  }
  take: number
  skip: number
}

export interface IFindAllCustomersResponseDTO {
  data: Customer[]
  total: number
}
