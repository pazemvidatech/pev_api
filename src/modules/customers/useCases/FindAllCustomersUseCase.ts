import ICustomerRepository from '../repositories/ICustomerRepository'
import {
  SortQueryType,
  ColumnSortType,
  OrderQueryType,
} from '../types/SortQueryType'
import { IFindAllCustomersDTO } from '../dtos/IFindAllCustomersDTO'
import { injectable, inject } from 'tsyringe'
import Customer from '../infra/typeorm/entities/Customer'
import { FindOperator, ILike } from 'typeorm'
import { classToPlain, plainToClass } from 'class-transformer'

interface IRequest {
  where?: {
    name?: string | FindOperator<string> | undefined
    cityId?: string | undefined
  }
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
class FindAllCustomersUseCase {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,
  ) {}

  public async execute(data: IRequest): Promise<IResponse> {
    const { page, size, sort, where } = data

    const queryData = {} as IFindAllCustomersDTO

    queryData.take = size
    queryData.skip = (page - 1) * size

    if (where) queryData.where = {}

    if (where.name) {
      queryData.where.name = ILike('%' + where.name + '%')
    }

    if (where.cityId) {
      queryData.where.cityId = where.cityId
    }

    const [sortBy, orderBy] = sort.split(':') as [
      ColumnSortType,
      OrderQueryType,
    ]

    queryData.order = { [sortBy]: orderBy }

    const result = await this.customerRepository.findAll(queryData)

    const customers = plainToClass(Customer, result.data)

    result.data = customers.map(customer =>
      classToPlain(customer),
    ) as Customer[]

    return {
      size,
      page,
      ...result,
    }
  }
}

export default FindAllCustomersUseCase
