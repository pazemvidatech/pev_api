import { Request, Response } from 'express'
import { container } from 'tsyringe'

import FindAllSubscriptionsUseCase from '../../../useCases/FindAllSubscriptionsUseCase'

class FindAllSubscriptionsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const findAllSubscriptions = container.resolve(FindAllSubscriptionsUseCase)

    const subscription = await findAllSubscriptions.execute()

    return res.json(subscription)
  }
}

export default FindAllSubscriptionsController
