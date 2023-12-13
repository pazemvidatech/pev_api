import { Request, Response } from 'express'
import { container } from 'tsyringe'

import DeleteRenegotiationUseCase from '../../../useCases/DeleteRenegotiationUseCase'

class DeleteRenegotiationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { renegotiationId } = req.params

    const deleteRenegotiation = container.resolve(DeleteRenegotiationUseCase)

    await deleteRenegotiation.execute(renegotiationId)

    return res.status(204).send()
  }
}

export default DeleteRenegotiationController
