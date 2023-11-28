import { Request, Response } from 'express'
import { container } from 'tsyringe'

import FindAllCustomersUseCase from '../../../useCases/FindAllCustomersUseCase'
import { SortQueryType } from '@modules/customers/types/SortQueryType'
import { CustomerMap } from '@modules/customers/mapper/CustomerMap'

interface IRequest {
  where?: {
    name?: string | undefined
    cityId?: string | undefined
  }
  page: number
  size: number
  sort: SortQueryType
}

class FindAllCustomersController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { sort, page, size, search, cityId } = req.query
    const findAllCustomers = container.resolve(FindAllCustomersUseCase)

    const query = <IRequest>{ where: {} }
    if (search && search !== '') query.where.name = search as string
    if (cityId && cityId !== '') query.where.cityId = cityId as string

    if (sort) query.sort = sort as SortQueryType
    if (page) query.page = Number(page)
    if (size) query.size = Number(size)

    const result = await findAllCustomers.execute(query)

    const customers = result.data.map(customer => CustomerMap.toDTO(customer))

    delete result.data

    return res.json({
      data: customers,
      ...result,
    })
  }
}

export default FindAllCustomersController
