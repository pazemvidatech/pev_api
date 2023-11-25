import { Response, Request } from 'express'
import { container } from 'tsyringe'

import UpdateCityUseCase from '../../../useCases/UpdateCityUseCase'

export default class UpdateCityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name } = req.body
    const { cityId } = req.params

    const updateCityUseCase = container.resolve(UpdateCityUseCase)

    await updateCityUseCase.execute({
      name,
      cityId,
    })

    return res.status(200).send()
  }
}
