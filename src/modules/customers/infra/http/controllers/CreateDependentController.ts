import { Response, Request } from 'express'
import { container } from 'tsyringe'

import CreateDependentUseCase from '../../../useCases/CreateDependentUseCase'

export default class CreateDependentController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { customerId, name, deathDate } = req.body

    const createDependentUseCase = container.resolve(CreateDependentUseCase)

    const dependentCreated = await createDependentUseCase.execute({
      customerId,
      name,
      deathDate,
    })

    return res.status(201).send(dependentCreated)
  }
}
