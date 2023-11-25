import { Response, Request } from 'express'
import { container } from 'tsyringe'

import CreateCustomerUseCase from '../../../useCases/CreateCustomerUseCase'

export default class CreateCustomerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const {
      name,
      silverPlan,
      numberId,
      address,
      email,
      cityId,
      document,
      payday,
      dependents,
    } = req.body

    const createCustomerUseCase = container.resolve(CreateCustomerUseCase)

    await createCustomerUseCase.execute({
      name,
      silverPlan,
      numberId,
      address,
      email,
      cityId,
      document,
      payday: Number(payday),
      dependents,
    })

    return res.status(204).send()
  }
}
