import ITransactionRepository from '../repositories/ITransactionRepository'
import {
  SortQueryType,
  ColumnSortType,
  OrderQueryType,
} from '../types/SortQueryType'
import { IFindAllTransactionsDTO } from '../dtos/IFindAllTransactionsDTO'
import { injectable, inject } from 'tsyringe'
import Transaction from '../infra/typeorm/entities/Transaction'

interface IRequest {
  where?: {
    accountId?: string
  }
  page: number
  size: number
  sort: SortQueryType
}

interface IResponse {
  size: number
  page: number
  total: number
  data: Transaction[]
}

@injectable()
class FindAllTransactionsUseCase {
  constructor(
    @inject('TransactionRepository')
    private transactionRepository: ITransactionRepository,
  ) {}

  public async execute(data: IRequest): Promise<IResponse> {
    const { page, size, sort, where } = data
    const { accountId } = where

    const queryData = {} as IFindAllTransactionsDTO

    queryData.take = size
    queryData.skip = (page - 1) * size

    const [sortBy, orderBy] = sort.split(':') as [
      ColumnSortType,
      OrderQueryType,
    ]

    queryData.order = { [sortBy]: orderBy }

    if (accountId) queryData.where = { accountId }

    const result = await this.transactionRepository.findAll(queryData)

    return {
      size,
      page,
      ...result,
    }
  }
}

export default FindAllTransactionsUseCase
