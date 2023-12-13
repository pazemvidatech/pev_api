import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateRenegotiationUseCase from '../../../useCases/CreateRenegotiationUseCase'

class CreateRenegotiationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { customerId, amount, negotiator } = req.body

    const accountId = req.account.id

    const createRenegotiation = container.resolve(CreateRenegotiationUseCase)

    const renegotiation = await createRenegotiation.execute({
      accountId,
      customerId,
      negotiator,
      amount,
    })

    return res.json(renegotiation)
  }
}

export default CreateRenegotiationController
