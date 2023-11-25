import { Request, Response } from 'express'
import { container } from 'tsyringe'

import DeleteCityUseCase from '../../../useCases/DeleteCityUseCase'

class DeleteCityController {
  async handle(request: Request, response: Response): Promise<Response> {
    const cityId = request.params.cityId
    const deleteCityUseCase = container.resolve(DeleteCityUseCase)

    await deleteCityUseCase.execute(cityId)

    return response.status(204).send()
  }
}

export default DeleteCityController
