import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ChangePasswordUseCase from '../../../useCases/ChangePasswordUseCase'

class ChangePasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { oldPassword, newPassword } = request.body
    const { accessToken } = request
    const resetPasswordUseCase = container.resolve(ChangePasswordUseCase)

    await resetPasswordUseCase.execute({
      accessToken,
      oldPassword,
      newPassword,
    })

    return response.status(204).send()
  }
}

export default ChangePasswordController
