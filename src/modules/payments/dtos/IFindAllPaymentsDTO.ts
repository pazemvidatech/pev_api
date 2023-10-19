import { ColumnSortType, OrderQueryType } from '../types/SortQueryType'
import Payment from '../infra/typeorm/entities/Payment'

export interface IFindAllPaymentsDTO {
  where?: {
    accountId?: string
  }
  order: {
    [key in ColumnSortType]: OrderQueryType
  }
  take: number
  skip: number
  month?: number | undefined
  year?: number | undefined
}

export interface IFindAllPaymentsResponseDTO {
  data: Payment[]
  total: number
}
