import { Request, Response } from 'express'
import { container } from 'tsyringe'

import UpdatePreferencesUseCase from '../../../useCases/UpdatePreferencesUseCase'

class UpdatePreferencesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const bodyData = req.body

    const updatePreferences = container.resolve(UpdatePreferencesUseCase)

    const preferences = await updatePreferences.execute(bodyData)

    return res.json(preferences)
  }
}

export default UpdatePreferencesController
