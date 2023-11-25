import { Request, Response } from 'express'
import { container } from 'tsyringe'

import FindAllCitiesUseCase from '../../../useCases/FindAllCitiesUseCase'
import { CityMap } from '@modules/cities/mapper/CityMap'

interface IRequest {
  page: number
  size: number
}

class FindAllCitiesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { page, size } = req.query
    const findAllCities = container.resolve(FindAllCitiesUseCase)

    const query = <IRequest>{}

    if (page) query.page = Number(page)
    if (size) query.size = Number(size)

    const result = await findAllCities.execute(query)

    const cities = result.data.map(city => CityMap.toDTO(city))

    delete result.data

    return res.json({
      data: cities,
      ...result,
    })
  }
}

export default FindAllCitiesController
