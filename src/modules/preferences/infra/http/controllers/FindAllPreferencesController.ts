import { Request, Response } from 'express'
import { container } from 'tsyringe'

import FindAllPreferencesUseCase from '../../../useCases/FindAllPreferencesUseCase'

class FindAllPreferencesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const findAllPreferences = container.resolve(FindAllPreferencesUseCase)

    const preferences = await findAllPreferences.execute()

    return res.json(preferences)
  }
}

export default FindAllPreferencesController
