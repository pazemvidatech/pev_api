import IPaymentRepository from '../repositories/IPaymentRepository'
import {
  SortQueryType,
  ColumnSortType,
  OrderQueryType,
} from '../types/SortQueryType'
import { IFindAllPaymentsDTO, PaymentList } from '../dtos/IFindAllPaymentsDTO'
import { injectable, inject } from 'tsyringe'

interface IRequest {
  where?: {
    accountId?: string
  }
  page: number
  size: number
  month?: number | undefined
  year?: number | undefined
  sort: SortQueryType
}

interface IResponse {
  size: number
  page: number
  total: number
  data: PaymentList[]
}

@injectable()
class FindAllPaymentsUseCase {
  constructor(
    @inject('PaymentRepository')
    private paymentRepository: IPaymentRepository,
  ) {}

  public async execute(data: IRequest): Promise<IResponse> {
    const { page, size, sort, where, month, year } = data
    const { accountId } = where

    const queryData = {} as IFindAllPaymentsDTO

    queryData.month = month
    queryData.year = year
    queryData.take = size
    queryData.skip = (page - 1) * size

    const [sortBy, orderBy] = sort.split(':') as [
      ColumnSortType,
      OrderQueryType,
    ]

    queryData.order = { [sortBy]: orderBy }

    if (accountId) queryData.where = { accountId }

    console.log(queryData)

    const result = await this.paymentRepository.findAll(queryData)

    console.log(result)

    return {
      size,
      page,
      ...result,
    }
  }
}

export default FindAllPaymentsUseCase
