import { Request, Response } from 'express'
import { container } from 'tsyringe'

import FindRenegotiationsCustomerUseCase from '../../../useCases/FindRenegotiationsCustomerUseCase'

class FindRenegotiationsCustomerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { customerId } = req.params

    const findRenegotiationsCustomer = container.resolve(
      FindRenegotiationsCustomerUseCase,
    )

    const renegotiations = await findRenegotiationsCustomer.execute(customerId)

    return res.json(renegotiations)
  }
}

export default FindRenegotiationsCustomerController
