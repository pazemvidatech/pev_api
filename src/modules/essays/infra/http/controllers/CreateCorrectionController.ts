import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateCorrectionUseCase from '../../../useCases/CreateCorrectionUseCase'

class CreateCorrectionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { essayId } = req.body

    const createCorrection = container.resolve(CreateCorrectionUseCase)

    const correction = await createCorrection.execute(essayId)

    return res.json(correction)
  }
}

export default CreateCorrectionController
