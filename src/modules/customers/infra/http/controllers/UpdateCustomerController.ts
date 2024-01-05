import { Response, Request } from 'express'
import { container } from 'tsyringe'

import UpdateCustomerUseCase from '../../../useCases/UpdateCustomerUseCase'

export default class UpdateCustomerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const {
      name,
      silverPlan,
      oldRegister,
      numberId,
      frequency,
      address,
      phone,
      email,
      cityId,
      document,
      payday,
      dependents,
    } = req.body

    const { customerId } = req.params

    const createCustomerUseCase = container.resolve(UpdateCustomerUseCase)

    await createCustomerUseCase.execute({
      customerId,
      name,
      silverPlan,
      oldRegister,
      numberId,
      address,
      phone,
      frequency,
      email,
      cityId,
      document,
      payday: Number(payday),
      dependents: dependents,
    })

    return res.status(204).send()
  }
}
