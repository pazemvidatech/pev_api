import { Request, Response } from 'express'
import { container } from 'tsyringe'

import TransactionWebhookUseCase from '../../../useCases/TransactionWebhookUseCase'

class TransactionWebhookController {
  async handle(req: Request, res: Response): Promise<Response> {
    const paymentData = req.body.data

    const transactionWebhook = container.resolve(TransactionWebhookUseCase)

    await transactionWebhook.execute(paymentData.id)

    return res.json()
  }
}

export default TransactionWebhookController
