import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateEssayUseCase from '../../../useCases/CreateEssayUseCase'

class CreateEssayController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { text, theme, isFour } = req.body
    const { id } = req.account

    const createEssay = container.resolve(CreateEssayUseCase)

    const essay = await createEssay.execute({
      accountId: id,
      text,
      theme,
      isFour,
    })

    return res.json(essay)
  }
}

export default CreateEssayController
