import EssayStatusEnum from '@modules/essays/enums/EssayStatusEnum'
import { EssaySortQueryType } from '@modules/essays/types/EssaySortQueryType'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

import FindAllEssaysUseCase from '../../../useCases/FindAllEssaysUseCase'
import { classToPlain } from 'class-transformer'

interface IRequest {
  where?: {
    status?: EssayStatusEnum
    accountId?: string
  }
  page: number
  size: number
  sort: EssaySortQueryType
}
class FindAllEssaysController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { sort, page, size, status } = req.query
    const { id } = req.account

    const findAllEssaysUseCase = container.resolve(FindAllEssaysUseCase)

    const query = <IRequest>{ where: {} }

    query.where.accountId = id
    if (status) query.where.status = status as EssayStatusEnum
    if (sort) query.sort = sort as EssaySortQueryType
    if (page) query.page = Number(page)
    if (size) query.size = Number(size)

    const result = await findAllEssaysUseCase.execute(query)

    const data = classToPlain(result.data)

    delete result.data

    return res.json({
      data,
      ...result,
    })
  }
}

export default FindAllEssaysController
