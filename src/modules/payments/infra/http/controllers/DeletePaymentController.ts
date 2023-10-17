import { Request, Response } from 'express'
import { container } from 'tsyringe'

import DeletePaymentUseCase from '../../../useCases/DeletePaymentUseCase'

class DeletePaymentController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { paymentId } = req.params
    const account = req.account

    const deletePayment = container.resolve(DeletePaymentUseCase)

    await deletePayment.execute(paymentId, account)

    return res.status(204).send()
  }
}

export default DeletePaymentController
