import { Response, Request } from 'express'
import { container } from 'tsyringe'

import UpdateCustomerUseCase from '../../../useCases/UpdateCustomerUseCase'

export default class UpdateCustomerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const {
      name,
      silverPlan,
      numberId,
      address,
      email,
      document,
      payday,
    } = req.body

    const { customerId } = req.params

    const createCustomerUseCase = container.resolve(UpdateCustomerUseCase)

    await createCustomerUseCase.execute({
      customerId,
      name,
      silverPlan,
      numberId,
      address,
      email,
      document,
      payday: Number(payday),
    })

    return res.status(202).send()
  }
}
