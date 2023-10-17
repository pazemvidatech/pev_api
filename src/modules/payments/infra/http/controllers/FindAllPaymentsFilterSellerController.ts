import { Request, Response } from 'express'
import { container } from 'tsyringe'

import FindAllPaymentsUseCase from '../../../useCases/FindAllPaymentsUseCase'
import { SortQueryType } from '@modules/payments/types/SortQueryType'

interface IRequest {
  where?: {
    accountId?: string
  }
  page: number
  size: number
  sort: SortQueryType
}

class FindAllPaymentsFilterSellerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { sort, page, size } = req.query
    const { id } = req.account

    const findAllPayments = container.resolve(FindAllPaymentsUseCase)

    const query = <IRequest>{ where: {} }

    query.where.accountId = id
    if (sort) query.sort = sort as SortQueryType
    if (page) query.page = Number(page)
    if (size) query.size = Number(size)

    const payments = await findAllPayments.execute(query)

    return res.json(payments)
  }
}

export default FindAllPaymentsFilterSellerController
