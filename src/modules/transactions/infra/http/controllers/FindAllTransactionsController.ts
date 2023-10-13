import { Request, Response } from 'express'
import { container } from 'tsyringe'

import FindAllTransactionsUseCase from '../../../useCases/FindAllTransactionsUseCase'
import { SortQueryType } from '@modules/transactions/types/SortQueryType'

interface IRequest {
  where?: {
    accountId?: string
  }
  page: number
  size: number
  sort: SortQueryType
}

class FindAllTransactionsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { sort, page, size } = req.query
    const { id } = req.account

    const findAllTransactions = container.resolve(FindAllTransactionsUseCase)

    const query = <IRequest>{ where: {} }

    query.where.accountId = id
    if (sort) query.sort = sort as SortQueryType
    if (page) query.page = Number(page)
    if (size) query.size = Number(size)

    const transactions = await findAllTransactions.execute(query)

    return res.json(transactions)
  }
}

export default FindAllTransactionsController
