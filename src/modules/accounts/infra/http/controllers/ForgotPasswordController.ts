import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ForgotPasswordUseCase from '../../../useCases/ForgotPasswordUseCase'

class ForgotPasswordAccountController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { username } = request.body
    const resetPasswordAccountUseCase = container.resolve(ForgotPasswordUseCase)

    await resetPasswordAccountUseCase.execute({
      username,
    })

    return response.status(204).send()
  }
}

export default ForgotPasswordAccountController
