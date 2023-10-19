import { Request, Response } from 'express'
import { container } from 'tsyringe'

import FindAllDebtorsUseCase from '../../../useCases/FindAllDebtorsUseCase'
import { SortQueryType } from '@modules/customers/types/SortQueryType'
import { CustomerMap } from '@modules/customers/mapper/CustomerMap'
import { DebtorMap } from '@modules/customers/mapper/DebtorMap'

interface IRequest {
  search?: string | undefined
  page: number
  size: number
  sort: SortQueryType
}

class FindAllDebtorsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { sort, page, size, search } = req.query
    const findAllCustomers = container.resolve(FindAllDebtorsUseCase)

    const query = <IRequest>{}
    if (search && search !== '') query.search = search as string

    if (sort) query.sort = sort as SortQueryType
    if (page) query.page = Number(page)
    if (size) query.size = Number(size)

    const result = await findAllCustomers.execute(query)

    const customers = result.data.map(customer => DebtorMap.toDTO(customer))

    delete result.data

    return res.json({
      data: customers,
      ...result,
    })
  }
}

export default FindAllDebtorsController
