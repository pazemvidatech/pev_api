import { Request, Response } from 'express'
import { container } from 'tsyringe'

import DeleteEssayUseCase from '../../../useCases/DeleteEssayUseCase'

class DeleteEssayController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { essayId } = req.params

    const deleteEssayUseCase = container.resolve(DeleteEssayUseCase)

    await deleteEssayUseCase.execute(essayId)

    return res.status(204).send()
  }
}

export default DeleteEssayController
