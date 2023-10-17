import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreatePaymentUseCase from '../../../useCases/CreatePaymentUseCase'

class CreatePaymentController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { customerId, quantity } = req.body

    const accountId = req.account.id

    const createPayment = container.resolve(CreatePaymentUseCase)

    const payments = await createPayment.execute({
      accountId,
      customerId,
      quantity,
    })

    return res.json(payments)
  }
}

export default CreatePaymentController
