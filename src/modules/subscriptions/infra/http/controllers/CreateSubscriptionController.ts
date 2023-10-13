import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateSubscriptionUseCase from '../../../useCases/CreateSubscriptionUseCase'

class CreateSubscriptionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, expireAt, accountId } = req.body

    const createSubscription = container.resolve(CreateSubscriptionUseCase)

    const subscription = await createSubscription.execute({
      name,
      accountId,
      expireAt,
    })

    return res.json(subscription)
  }
}

export default CreateSubscriptionController
