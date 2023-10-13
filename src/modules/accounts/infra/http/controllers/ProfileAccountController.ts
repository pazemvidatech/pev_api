import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ProfileAccountUseCase from '../../../useCases/ProfileAccountUseCase'

class ProfileAccountController {
  async handle(request: Request, response: Response): Promise<Response> {
    const profileAccountUseCase = container.resolve(ProfileAccountUseCase)

    const profile = await profileAccountUseCase.execute(request.account)

    delete profile.terms
    return response.json(profile)
  }
}

export default ProfileAccountController
