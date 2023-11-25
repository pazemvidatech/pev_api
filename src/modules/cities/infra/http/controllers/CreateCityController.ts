import { Response, Request } from 'express'
import { container } from 'tsyringe'

import CreateCityUseCase from '../../../useCases/CreateCityUseCase'

export default class CreateCityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name } = req.body

    const createCityUseCase = container.resolve(CreateCityUseCase)

    await createCityUseCase.execute({
      name,
    })

    return res.status(204).send()
  }
}
