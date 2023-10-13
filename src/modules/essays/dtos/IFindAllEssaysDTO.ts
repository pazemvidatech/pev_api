import EssayStatusEnum from '../enums/EssayStatusEnum'
import Essay from '../infra/typeorm/entities/Essay'
import {
  EssayColumnSortType,
  OrderQueryType,
} from '../types/EssaySortQueryType'

export interface IFindAllEssaysRequestDTO {
  where?: {
    status?: EssayStatusEnum
    accountId?: string
  }
  relations?: { correction: boolean }
  order: {
    [key in EssayColumnSortType]: OrderQueryType
  }
  take: number
  skip: number
}

export interface IFindAllEssaysResponseDTO {
  data: Essay[]
  total: number
}
