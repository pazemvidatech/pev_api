import IPaymentRepository from '../repositories/IPaymentRepository'
import {
  SortQueryType,
  ColumnSortType,
  OrderQueryType,
} from '../types/SortQueryType'
import { IFindAllPaymentsDTO } from '../dtos/IFindAllPaymentsDTO'
import { injectable, inject } from 'tsyringe'
import Payment from '../infra/typeorm/entities/Payment'

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
  data: Payment[]
}

@injectable()
class FindAllPaymentsUseCase {
  constructor(
    @inject('PaymentRepository')
    private paymentRepository: IPaymentRepository,
  ) {}

  public async execute(data: IRequest): Promise<IResponse> {
    const { page, size, sort, where } = data
    const { accountId } = where

    const queryData = {} as IFindAllPaymentsDTO

    queryData.take = size
    queryData.skip = (page - 1) * size

    const [sortBy, orderBy] = sort.split(':') as [
      ColumnSortType,
      OrderQueryType,
    ]

    queryData.order = { [sortBy]: orderBy }

    if (accountId) queryData.where = { accountId }

    const result = await this.paymentRepository.findAll(queryData)

    return {
      size,
      page,
      ...result,
    }
  }
}

export default FindAllPaymentsUseCase