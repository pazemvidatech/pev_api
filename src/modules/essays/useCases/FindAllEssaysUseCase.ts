import IEssayRepository from '../repositories/IEssayRepository'
import {
  EssaySortQueryType,
  EssayColumnSortType,
  OrderQueryType,
} from '../types/EssaySortQueryType'
import { IFindAllEssaysRequestDTO } from '../dtos/IFindAllEssaysDTO'
import { injectable, inject } from 'tsyringe'
import Essay from '../infra/typeorm/entities/Essay'
import EssayStatusEnum from '../enums/EssayStatusEnum'

interface IRequest {
  where?: {
    status?: EssayStatusEnum
    accountId?: string
  }
  relations?: { correction: boolean }
  page: number
  size: number
  sort: EssaySortQueryType
}

interface IResponse {
  size: number
  page: number
  total: number
  data: Essay[]
}

@injectable()
class FindAllEssaysUseCase {
  constructor(
    @inject('EssayRepository')
    private essayRepository: IEssayRepository,
  ) {}

  public async execute(data: IRequest): Promise<IResponse> {
    const { page, size, sort, where, relations } = data

    const queryData = {} as IFindAllEssaysRequestDTO

    queryData.take = size
    queryData.skip = (page - 1) * size

    const [sortBy, orderBy] = sort.split(':') as [
      EssayColumnSortType,
      OrderQueryType,
    ]

    queryData.order = { [sortBy]: orderBy }

    if (where) queryData.where = where
    if (relations) queryData.relations = relations

    const result = await this.essayRepository.findAll(queryData)

    return {
      size,
      page,
      ...result,
    }
  }
}

export default FindAllEssaysUseCase
