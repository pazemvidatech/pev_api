import EssayStatusEnum from '@modules/essays/enums/EssayStatusEnum'
import { EssaySortQueryType } from '@modules/essays/types/EssaySortQueryType'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

import FindAllEssaysUseCase from '../../../useCases/FindAllEssaysUseCase'

interface IRequest {
  where?: {
    status?: EssayStatusEnum
    accountId?: string
  }
  relations: {
    correction: boolean
  }
  page: number
  size: number
  sort: EssaySortQueryType
}
class FindAllEssaysController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { sort, page, size, status, accountId } = req.query

    const findAllEssaysUseCase = container.resolve(FindAllEssaysUseCase)

    const query = <IRequest>{}

    query.relations = { correction: true }
    if (accountId || status) query.where = {}
    if (accountId) query.where.accountId = accountId as string
    if (status) query.where.status = status as EssayStatusEnum
    if (sort) query.sort = sort as EssaySortQueryType
    if (page) query.page = Number(page)
    if (size) query.size = Number(size)

    const result = await findAllEssaysUseCase.execute(query)

    return res.json(result)
  }
}

export default FindAllEssaysController
