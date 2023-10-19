import ICustomerRepository from '../repositories/ICustomerRepository'
import {
  SortQueryType,
  ColumnSortType,
  OrderQueryType,
} from '../types/SortQueryType'
import { IFindAllCustomersDTO } from '../dtos/IFindAllCustomersDTO'
import { injectable, inject } from 'tsyringe'
import Customer from '../infra/typeorm/entities/Customer'

interface IRequest {
  search?: string | undefined
  page: number
  size: number
  sort: SortQueryType
}

interface IResponse {
  size: number
  page: number
  total: number
  data: Customer[]
}

@injectable()
class FindAllDebtorsUseCase {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,
  ) {}

  public async execute(data: IRequest): Promise<IResponse> {
    const { page, size, sort, search } = data

    const queryData = {} as IFindAllCustomersDTO

    queryData.take = size
    queryData.skip = (page - 1) * size

    const [sortBy, orderBy] = sort.split(':') as [
      ColumnSortType,
      OrderQueryType,
    ]

    queryData.order = { [sortBy]: orderBy }

    const result = await this.customerRepository.findAllDebtors(
      queryData,
      search,
    )

    return {
      size,
      page,
      ...result,
    }
  }
}

export default FindAllDebtorsUseCase
