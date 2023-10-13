import { Request, Response } from 'express'
import { container } from 'tsyringe'

import UpdateStatusEssayUseCase from '../../../useCases/UpdateStatusEssayUseCase'

class UpdateStatusEssayController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { essayId } = req.params
    const { newStatus } = req.body

    const updateStatusEssayUseCase = container.resolve(UpdateStatusEssayUseCase)

    await updateStatusEssayUseCase.execute({
      newStatus,
      id: essayId,
    })

    return res.status(204).send()
  }
}

export default UpdateStatusEssayController
