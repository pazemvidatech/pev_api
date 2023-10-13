import { ColumnSortType, OrderQueryType } from '../types/SortQueryType'
import Transaction from '../infra/typeorm/entities/Transaction'

export interface IFindAllTransactionsDTO {
  where?: {
    accountId?: string
  }
  order: {
    [key in ColumnSortType]: OrderQueryType
  }
  take: number
  skip: number
}

export interface IFindAllTransactionsResponseDTO {
  data: Transaction[]
  total: number
}
