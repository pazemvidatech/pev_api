import IAccountRepository from '../repositories/IAccountRepository'
import {
  SortQueryType,
  ColumnSortType,
  OrderQueryType,
} from '../types/SortQueryType'
import { IFindAllPartnersDTO } from '../dtos/IFindAllPartnersDTO'
import { injectable, inject } from 'tsyringe'
import Account from '../infra/typeorm/entities/Account'
import { FindOperator, Like } from 'typeorm'

interface IRequest {
  where?: {
    name?: string | FindOperator<string> | undefined
  }
  page: number
  size: number
  sort: SortQueryType
}

interface IResponse {
  size: number
  page: number
  total: number
  data: Account[]
}

@injectable()
class FindAllAccountsUseCase {
  constructor(
    @inject('AccountRepository')
    private accountRepository: IAccountRepository,
  ) {}

  public async execute(data: IRequest): Promise<IResponse> {
    const { page, size, sort, where } = data

    const queryData = {} as IFindAllPartnersDTO

    queryData.take = size
    queryData.skip = (page - 1) * size

    if (where) queryData.where = {}

    if (where.name) {
      queryData.where.name = Like('%' + where.name + '%')
    }

    const [sortBy, orderBy] = sort.split(':') as [
      ColumnSortType,
      OrderQueryType,
    ]

    queryData.order = { [sortBy]: orderBy }

    const result = await this.accountRepository.findAll(queryData)

    return {
      size,
      page,
      ...result,
    }
  }
}

export default FindAllAccountsUseCase
