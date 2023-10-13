import { Request, Response } from 'express'
import { container } from 'tsyringe'

import SubscriptionWebhookUseCase from '../../../useCases/SubscriptionWebhookUseCase'

class SubscriptionWebhookController {
  async handle(req: Request, res: Response): Promise<Response> {
    const paymentData = req.body.data

    const subscriptionWebhook = container.resolve(SubscriptionWebhookUseCase)

    await subscriptionWebhook.execute(paymentData.id)

    return res.json()
  }
}

export default SubscriptionWebhookController
