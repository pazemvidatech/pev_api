import { Request, Response } from 'express'
import { container } from 'tsyringe'

import FindAllPartnersUseCase from '../../../useCases/FindAllPartnersUseCase'
import { SortQueryType } from '@modules/accounts/types/SortQueryType'

interface IRequest {
  where?: {
    name?: string | undefined
  }
  page: number
  size: number
  sort: SortQueryType
}

class FindAllPartnersController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { sort, page, size, search } = req.query
    const findAllPartners = container.resolve(FindAllPartnersUseCase)

    const query = <IRequest>{ where: {} }
    if (search && search !== '') query.where.name = search as string

    if (sort) query.sort = sort as SortQueryType
    if (page) query.page = Number(page)
    if (size) query.size = Number(size)

    const partners = await findAllPartners.execute(query)

    return res.json(partners)
  }
}

export default FindAllPartnersController
