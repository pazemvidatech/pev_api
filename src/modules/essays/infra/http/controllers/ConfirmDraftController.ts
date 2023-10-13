import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ConfirmDraftUseCase from '../../../useCases/ConfirmDraftUseCase'

class ConfirmDraftController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { essayId } = req.params
    const { text, theme, isFour } = req.body
    const { id } = req.account

    const confirmDraft = container.resolve(ConfirmDraftUseCase)

    await confirmDraft.execute({
      accountId: id,
      text,
      theme,
      essayId,
      isFour,
    })

    return res.status(201).send()
  }
}

export default ConfirmDraftController
