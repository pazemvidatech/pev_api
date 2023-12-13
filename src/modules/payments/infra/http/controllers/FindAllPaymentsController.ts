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
  month?: number | undefined
  year?: number | undefined
  sort: SortQueryType
}

class FindAllPaymentsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { sort, page, size, accountId, month, year } = req.query
    const { isAdmin, id } = req.account

    const findAllPayments = container.resolve(FindAllPaymentsUseCase)

    const query = <IRequest>{ where: {} }

    if (isAdmin) {
      if (accountId) query.where.accountId = accountId as string
    } else {
      query.where.accountId = id as string
    }
    if (sort) query.sort = sort as SortQueryType
    if (page) query.page = Number(page)
    if (size) query.size = Number(size)
    if (month) query.month = Number(month)
    if (year) query.year = Number(year)

    const payments = await findAllPayments.execute(query)

    return res.json(payments)
  }
}

export default FindAllPaymentsController
