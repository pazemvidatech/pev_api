import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ResetPasswordUseCase from '../../../useCases/ResetPasswordUseCase'

class ResetPasswordAccountController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { username, password, code } = request.body
    const resetPasswordAccountUseCase = container.resolve(ResetPasswordUseCase)

    await resetPasswordAccountUseCase.execute({
      username,
      code: String(code),
      password,
    })

    return response.status(204).send()
  }
}

export default ResetPasswordAccountController
