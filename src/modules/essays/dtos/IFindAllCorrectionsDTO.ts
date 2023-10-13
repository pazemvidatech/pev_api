import Correction from '../infra/typeorm/entities/Correction'
import {
  CorrectionColumnSortType,
  OrderQueryType,
} from '../types/CorrectionSortQueryType'

export interface IFindAllCorrectionsRequestDTO {
  where?: {
    essayId?: string
  }
  order: {
    [key in CorrectionColumnSortType]: OrderQueryType
  }
  take: number
  skip: number
}

export interface IFindAllCorrectionsResponseDTO {
  data: Correction[]
  total: number
}
