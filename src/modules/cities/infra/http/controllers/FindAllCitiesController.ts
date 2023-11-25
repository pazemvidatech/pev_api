import { Request, Response } from 'express'
import { container } from 'tsyringe'

import FindAllCitiesUseCase from '../../../useCases/FindAllCitiesUseCase'

interface IRequest {
  page: number
  size: number
}

class FindAllCitiesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { sort, page, size, search } = req.query
    const findAllCities = container.resolve(FindAllCitiesUseCase)

    const query = <IRequest>{}

    if (page) query.page = Number(page)
    if (size) query.size = Number(size)

    const cities = await findAllCities.execute(query)

    return res.json(cities)
  }
}

export default FindAllCitiesController
