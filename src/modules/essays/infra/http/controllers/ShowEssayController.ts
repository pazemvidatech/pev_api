import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ShowEssayUseCase from '../../../useCases/ShowEssayUseCase'
import { EssayMap } from '@modules/essays/mapper/EssayMap'

class ShowEssayController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { essayId } = req.params
    const { id } = req.account

    const showEssayUseCase = container.resolve(ShowEssayUseCase)

    const essay = await showEssayUseCase.execute(essayId, id)

    const essayMapped = EssayMap.toDTO(essay)

    return res.json(essayMapped)
  }
}

export default ShowEssayController
