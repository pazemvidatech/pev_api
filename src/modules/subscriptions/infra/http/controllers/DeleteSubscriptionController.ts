import { Request, Response } from 'express'
import { container } from 'tsyringe'

import DeleteSubscriptionUseCase from '../../../useCases/DeleteSubscriptionUseCase'

class DeleteSubscriptionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { subscription_id } = req.params

    const deleteSubscription = container.resolve(DeleteSubscriptionUseCase)

    await deleteSubscription.execute(subscription_id)

    return res.status(204).send()
  }
}

export default DeleteSubscriptionController
